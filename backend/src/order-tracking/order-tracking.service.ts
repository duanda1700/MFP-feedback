import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';

@Injectable()
export class OrderTrackingService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(ProductionPlan)
    private productionPlanRepository: Repository<ProductionPlan>,
    @InjectRepository(ManufacturePlanFeedbackMain)
    private feedbackMainRepository: Repository<ManufacturePlanFeedbackMain>,
    @InjectRepository(ManufacturePlanFeedbackVersion)
    private feedbackVersionRepository: Repository<ManufacturePlanFeedbackVersion>,
    @InjectRepository(PurchaseDetails)
    private purchaseDetailsRepository: Repository<PurchaseDetails>,
    private dataSource: DataSource,
  ) {}

  async getOrdersByStatus() {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .orderBy('order.createTime', 'DESC')
      .getMany();

    const result: any = {
      pending: [],
      processing: [],
      completed: [],
    };

    for (const order of orders) {
      const orderWithDetails = {
        ...order,
        planCount: 0,
        feedbackCount: 0,
        feedbackProgress: 0,
      };

      const planCount = await this.productionPlanRepository.count({
        where: { djbH: order.djbH, planStatus: '已确认' },
      });

      const feedbackCount = await this.feedbackMainRepository.count({
        where: { djbH: order.djbH },
      });

      orderWithDetails.planCount = planCount;
      orderWithDetails.feedbackCount = feedbackCount;
      orderWithDetails.feedbackProgress = planCount > 0 ? Math.round((feedbackCount / planCount) * 100) : 0;

      switch (order.orderStatus) {
        case '待下发':
          result.pending.push(orderWithDetails);
          break;
        case '已下发':
          result.pending.push(orderWithDetails);
          break;
        case '已确认':
          result.processing.push(orderWithDetails);
          break;
        case '已完成':
          result.completed.push(orderWithDetails);
          break;
        default:
          result.pending.push(orderWithDetails);
      }
    }

    return result;
  }

  async getOrderDetail(djbH: string) {
    const order = await this.orderRepository.findOne({
      where: { djbH },
    });

    if (!order) {
      return null;
    }

    const originalPlans = await this.productionPlanRepository
      .createQueryBuilder('plan')
      .where('plan.djbH = :djbH', { djbH })
      .andWhere('plan.planStatus = :status', { status: '已确认' })
      .orderBy('plan.sortOrder', 'ASC')
      .getMany();

    const latestVersions = new Map<string, any>();
    originalPlans.forEach((plan) => {
      const key = `${plan.purchaseDetailsId}_${plan.planClass}`;
      if (!latestVersions.has(key) || plan.version > latestVersions.get(key).version) {
        latestVersions.set(key, plan);
      }
    });

    const plans = Array.from(latestVersions.values());

    const plansWithFeedback = await Promise.all(
      plans.map(async (plan) => {
        const feedbackMain = await this.feedbackMainRepository.findOne({
          where: {
            purchaseDetailsId: plan.purchaseDetailsId?.toString(),
            materialCode: plan.materialCode,
            planClass: plan.planClass,
          },
          order: { createTime: 'DESC' },
          relations: ['versions'],
        });

        let feedbackStatus = '未反馈';
        let latestFeedback: any = null;
        let feedbackHistory: any[] = [];

        if (feedbackMain) {
          feedbackStatus = feedbackMain.progressStatus || '未开始';
          if (feedbackMain.versions && feedbackMain.versions.length > 0) {
            const sortedVersions = feedbackMain.versions.sort((a, b) => b.version - a.version);
            latestFeedback = sortedVersions[0];
            feedbackHistory = sortedVersions.map((v) => ({
              version: v.version,
              feedbackTime: v.feedbackTime,
              progressStatus: v.progressStatus,
              finishedQuantity: v.finishedQuantity,
              actualDeliveryDate: v.actualDeliveryDate,
              remarks: v.remarks,
            }));
          }
        }

        return {
          ...plan,
          feedbackStatus,
          latestFeedback,
          feedbackHistory,
        };
      }),
    );

    const statistics = {
      totalPlans: plans.length,
      completedPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '已完成').length,
      inProgressPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '进行中').length,
      delayedPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '已延期').length,
      notStartedPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '未开始').length,
    };

    return {
      order,
      plans: plansWithFeedback,
      statistics,
    };
  }

  async comparePlans(djbH: string) {
    const originalPlans = await this.productionPlanRepository
      .createQueryBuilder('plan')
      .where('plan.djbH = :djbH', { djbH })
      .orderBy('plan.version', 'ASC')
      .addOrderBy('plan.sortOrder', 'ASC')
      .getMany();

    const groupedByDetails = new Map<string, any[]>();
    originalPlans.forEach((plan) => {
      const key = `${plan.purchaseDetailsId}_${plan.planClass}`;
      if (!groupedByDetails.has(key)) {
        groupedByDetails.set(key, []);
      }
      groupedByDetails.get(key)!.push(plan);
    });

    const comparison: any[] = [];

    groupedByDetails.forEach((versions, key) => {
      if (versions.length > 1) {
        const sortedVersions = versions.sort((a, b) => a.version - b.version);
        const original = sortedVersions[0];
        const latest = sortedVersions[sortedVersions.length - 1];

        const changes: any = {
          hasChanges: false,
          fields: [],
        };

        const compareFields = ['quantity', 'plannedDate', 'materialDesc', 'remarks'];
        compareFields.forEach((field) => {
          const originalValue = (original as any)[field];
          const latestValue = (latest as any)[field];
          if (originalValue !== latestValue) {
            changes.hasChanges = true;
            changes.fields.push({
              field,
              original: originalValue,
              latest: latestValue,
            });
          }
        });

        comparison.push({
          key,
          purchaseDetailsId: original.purchaseDetailsId,
          materialCode: original.materialCode,
          materialDesc: original.materialDesc,
          planClass: original.planClass,
          originalVersion: original.version,
          latestVersion: latest.version,
          original,
          latest,
          changes,
        });
      }
    });

    return {
      djbH,
      totalItems: groupedByDetails.size,
      changedItems: comparison.filter((c) => c.changes.hasChanges).length,
      comparison,
    };
  }

  async getFeedbackHistory(djbH: string) {
    const feedbackMains = await this.feedbackMainRepository.find({
      where: { djbH },
      order: { createTime: 'DESC' },
      relations: ['versions'],
    });

    const history: any[] = [];

    for (const main of feedbackMains) {
      if (main.versions && main.versions.length > 0) {
        const sortedVersions = main.versions.sort((a, b) => b.version - a.version);
        
        for (const version of sortedVersions) {
          history.push({
            id: version.id,
            materialCode: main.materialCode,
            materialDesc: main.materialDesc,
            planClass: main.planClass,
            version: version.version,
            feedbackTime: version.feedbackTime,
            progressStatus: version.progressStatus,
            finishedQuantity: version.finishedQuantity,
            planQuantity: version.planQuantity,
            actualDeliveryDate: version.actualDeliveryDate,
            remarks: version.remarks,
            creator: version.creator,
          });
        }
      }
    }

    const groupedByCycle: any = {};
    history.forEach((item) => {
      const cycle = item.feedbackTime ? this.formatDateToCycle(item.feedbackTime) : '未知周期';
      if (!groupedByCycle[cycle]) {
        groupedByCycle[cycle] = [];
      }
      groupedByCycle[cycle].push(item);
    });

    return {
      djbH,
      totalRecords: history.length,
      groupedByCycle,
      allRecords: history,
    };
  }

  async getOrderStatistics() {
    const total = await this.orderRepository.count();
    const pending = await this.orderRepository.count({
      where: [{ orderStatus: '待下发' }, { orderStatus: '已下发' }],
    });
    const processing = await this.orderRepository.count({
      where: { orderStatus: '已确认' },
    });
    const completed = await this.orderRepository.count({
      where: { orderStatus: '已完成' },
    });

    return { total, pending, processing, completed };
  }

  private formatDateToCycle(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${year}W${weekNumber.toString().padStart(2, '0')}`;
  }
}
