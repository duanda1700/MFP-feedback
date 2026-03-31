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
      confirmed: [],
      inProgress: [],
      completed: [],
      delayed: [],
    };

    for (const order of orders) {
      const orderWithDetails = {
        ...order,
        planCount: 0,
        feedbackCount: 0,
        feedbackProgress: 0,
      };

      const allPlans = await this.productionPlanRepository.find({
        where: { djbH: order.djbH },
      });

      const maxVersion = allPlans.length > 0 
        ? Math.max(...allPlans.map((p) => p.version || 1)) 
        : 1;

      const planCount = allPlans.filter(
        (p) => (p.version || 1) === maxVersion
      ).length;

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
          result.confirmed.push(orderWithDetails);
          break;
        case '进行中':
          result.inProgress.push(orderWithDetails);
          break;
        case '已完成':
          result.completed.push(orderWithDetails);
          break;
        case '已延期':
          result.delayed.push(orderWithDetails);
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

    const allPlans = await this.productionPlanRepository
      .createQueryBuilder('plan')
      .where('plan.djbH = :djbH', { djbH })
      .orderBy('plan.sortOrder', 'ASC')
      .getMany();

    const maxVersion = Math.max(...allPlans.map((p) => p.version || 1));

    const plans = allPlans.filter((p) => (p.version || 1) === maxVersion);

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
    const allPlans = await this.productionPlanRepository
      .createQueryBuilder('plan')
      .where('plan.djbH = :djbH', { djbH })
      .orderBy('plan.version', 'ASC')
      .addOrderBy('plan.sortOrder', 'ASC')
      .getMany();

    if (allPlans.length === 0) {
      return {
        djbH,
        versions: [],
        totalItems: 0,
        changedItems: 0,
        comparison: [],
      };
    }

    const versionSet = new Set<number>();
    allPlans.forEach((plan) => {
      versionSet.add(plan.version || 1);
    });
    const versions = Array.from(versionSet).sort((a, b) => a - b);

    const groupedByKey = new Map<string, any[]>();
    allPlans.forEach((plan) => {
      const key = `${plan.purchaseDetailsId || 0}_${plan.planClass || '生产计划'}`;
      if (!groupedByKey.has(key)) {
        groupedByKey.set(key, []);
      }
      groupedByKey.get(key)!.push(plan);
    });

    const comparison: any[] = [];
    const compareFields = [
      'quantity',
      'plannedDate',
      'materialDesc',
      'materialCode',
      'unit',
      'sfzz',
      'remarks',
      'planType',
      'changeType',
    ];

    groupedByKey.forEach((planVersions, key) => {
      const versionMap = new Map<number, any>();
      planVersions.forEach((plan) => {
        versionMap.set(plan.version || 1, plan);
      });

      const firstPlan = planVersions[0];
      const itemComparison: any = {
        key,
        purchaseDetailsId: firstPlan.purchaseDetailsId,
        materialCode: firstPlan.materialCode,
        materialDesc: firstPlan.materialDesc,
        planClass: firstPlan.planClass,
        versions: {},
        changes: {
          hasChanges: false,
          fields: [],
        },
      };

      versions.forEach((v) => {
        const plan = versionMap.get(v);
        if (plan) {
          itemComparison.versions[v] = {
            id: plan.id,
            quantity: plan.quantity,
            plannedDate: plan.plannedDate,
            materialDesc: plan.materialDesc,
            materialCode: plan.materialCode,
            unit: plan.unit,
            sfzz: plan.sfzz,
            remarks: plan.remarks,
            planType: plan.planType,
            changeType: plan.changeType,
            sortOrder: plan.sortOrder,
          };
        } else {
          itemComparison.versions[v] = null;
        }
      });

      if (versions.length > 1) {
        const firstVersion = versions[0];
        const lastVersion = versions[versions.length - 1];
        const firstPlanData = versionMap.get(firstVersion);
        const lastPlanData = versionMap.get(lastVersion);

        if (firstPlanData && lastPlanData) {
          compareFields.forEach((field) => {
            const originalValue = (firstPlanData as any)[field];
            const latestValue = (lastPlanData as any)[field];
            if (originalValue !== latestValue) {
              itemComparison.changes.hasChanges = true;
              itemComparison.changes.fields.push({
                field,
                original: originalValue,
                latest: latestValue,
                fieldName: this.getFieldDisplayName(field),
              });
            }
          });
        }
      }

      comparison.push(itemComparison);
    });

    comparison.sort((a, b) => {
      const aSort = a.versions[versions[0]]?.sortOrder || 0;
      const bSort = b.versions[versions[0]]?.sortOrder || 0;
      return aSort - bSort;
    });

    return {
      djbH,
      versions,
      totalItems: groupedByKey.size,
      changedItems: comparison.filter((c) => c.changes.hasChanges).length,
      comparison,
    };
  }

  private getFieldDisplayName(field: string): string {
    const fieldNames: Record<string, string> = {
      quantity: '数量',
      plannedDate: '计划日期',
      materialDesc: '物料描述',
      materialCode: '物料编码',
      unit: '单位',
      sfzz: '是否自制',
      remarks: '备注',
      planType: '计划类型',
      changeType: '变更类型',
    };
    return fieldNames[field] || field;
  }

  async getOrderStatistics() {
    const total = await this.orderRepository.count();
    const pending = await this.orderRepository.count({
      where: [{ orderStatus: '待下发' }, { orderStatus: '已下发' }],
    });
    const confirmed = await this.orderRepository.count({
      where: { orderStatus: '已确认' },
    });
    const inProgress = await this.orderRepository.count({
      where: { orderStatus: '进行中' },
    });
    const completed = await this.orderRepository.count({
      where: { orderStatus: '已完成' },
    });
    const delayed = await this.orderRepository.count({
      where: { orderStatus: '已延期' },
    });

    return { total, pending, confirmed, inProgress, completed, delayed };
  }
}
