import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { OperationLog } from '../database/entities/operation-log.entity';
import { TaskService } from '../task/task.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(ProductionPlan) private planRepository: Repository<ProductionPlan>,
    @InjectRepository(PurchaseOrder) private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(OperationLog) private operationLogRepository: Repository<OperationLog>,
    private taskService: TaskService,
  ) {}

  // 获取计划列表
  async getPlanList(query: any) {
    const {
      page = 1,
      pageSize = 10,
      planStatus,
      planName,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.planRepository.createQueryBuilder('plan');

    if (planStatus) {
      queryBuilder.andWhere('plan.plan_status = :planStatus', { planStatus });
    }

    if (planName) {
      queryBuilder.andWhere('plan.plan_name LIKE :planName', { planName: `%${planName}%` });
    }

    if (startDate) {
      queryBuilder.andWhere('plan.plan_date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('plan.plan_date <= :endDate', { endDate });
    }

    const [plans, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('plan.plan_date', 'DESC')
      .getManyAndCount();

    return {
      data: plans,
      total,
      page,
      pageSize,
    };
  }

  // 获取计划详情
  async getPlanDetail(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  // 创建计划
  async createPlan(planData: any) {
    const plan = this.planRepository.create(planData);
    return this.planRepository.save(plan);
  }

  // 更新计划
  async updatePlan(id: string, planData: any) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    Object.assign(plan, planData);
    return this.planRepository.save(plan);
  }

  // 导入计划
  async importPlan(planDataList: any[], createdBy: number, createdName: string, orderId?: number, isFirstConfirmation?: boolean) {
    let savedCount = 0;
    
    if (planDataList.length === 0) {
      return {
        success: false,
        count: 0,
        message: '没有计划数据需要导入',
      };
    }
    
    const djbH = planDataList[0].djbH;
    
    const maxVersionResult = await this.planRepository
      .createQueryBuilder('plan')
      .select('MAX(plan.version)', 'maxVersion')
      .where('plan.djbH = :djbH', { djbH })
      .getRawOne();
    
    const nextVersion = (maxVersionResult.maxVersion || 0) + 1;
    console.log(`Importing plans for order ${djbH}, next version: ${nextVersion}`);
    
    for (const planData of planDataList) {
      const timestamp = Date.now().toString().slice(-10);
      const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const id = `PP${timestamp}_${randomStr}`.slice(0, 16);
      
      const plan = this.planRepository.create({
        id: id,
        ...planData,
        version: nextVersion,
        sortOrder: planData.sortOrder || 0
      });
      
      await this.planRepository.save(plan);
      savedCount++;
    }

    // 只有首次确认时才更新订单状态为"已确认"
    if (orderId && isFirstConfirmation) {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
      if (order) {
        order.orderStatus = '已确认';
        await this.orderRepository.save(order);
        console.log(`Updated order ${orderId} status to "已确认"`);
        
        const operationLog = this.operationLogRepository.create({
          operationType: '生产计划确认',
          operationDesc: `订单 ${order.djbH} 首次确认提交，版本号: ${nextVersion}，计划数量: ${savedCount}`,
          operator: createdName,
          operatedAt: new Date(),
          relatedId: orderId.toString()
        });
        await this.operationLogRepository.save(operationLog);
        console.log(`Recorded operation log for order ${orderId}`);
      }
    } else if (orderId) {
      // 更新模板场景，记录操作日志但不修改订单状态
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
      if (order) {
        const operationLog = this.operationLogRepository.create({
          operationType: '生产计划更新',
          operationDesc: `订单 ${order.djbH} 更新模板提交，版本号: ${nextVersion}，计划数量: ${savedCount}`,
          operator: createdName,
          operatedAt: new Date(),
          relatedId: orderId.toString()
        });
        await this.operationLogRepository.save(operationLog);
        console.log(`Recorded operation log for order ${orderId} (update template)`);
      }
    }

    return {
      success: true,
      count: savedCount,
      version: nextVersion,
      message: `成功导入 ${savedCount} 条生产计划，版本号: ${nextVersion}`,
    };
  }

  // 提交审批
  async submitApproval(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // 计划校验
    const validationError = this.validatePlan(plan);
    if (validationError) {
      throw new Error(validationError);
    }

    plan.planStatus = '待审批';
    return this.planRepository.save(plan);
  }

  // 计划校验
  validatePlan(plan: any) {
    // 校验计划完成时间≤订单交货期
    if (plan.plannedDate && plan.deliveryDate) {
      if (new Date(plan.plannedDate) > new Date(plan.deliveryDate)) {
        return '计划完成时间不能大于订单交货期';
      }
    }

    // 校验责任人不能为空
    if (!plan.planMaker) {
      return '责任人不能为空';
    }

    // 校验关键物料计划明细不可缺失
    // 这里应该根据实际业务逻辑实现

    // 校验台份/型号ID与主数据一致
    // 这里应该根据实际业务逻辑实现

    return null;
  }

  // 删除计划
  async deletePlan(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return this.planRepository.remove(plan);
  }

  // 执行计划
  async executePlan(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    plan.planStatus = '执行中';
    return this.planRepository.save(plan);
  }

  // 完成计划
  async completePlan(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    plan.planStatus = '已完成';
    return this.planRepository.save(plan);
  }

  // 闭环计划
  async closePlan(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    plan.planStatus = '已闭环';
    return this.planRepository.save(plan);
  }
}
