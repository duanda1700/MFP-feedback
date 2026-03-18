import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../database/entities/supplier.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    @InjectRepository(PurchaseOrder) private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseDetails) private orderDetailsRepository: Repository<PurchaseDetails>,
    @InjectRepository(ProductionPlan) private productionPlanRepository: Repository<ProductionPlan>,
  ) {}

  // 获取供应商的订单列表
  async getSupplierOrders(supplierId: number, query: any) {
    const {
      page = 1,
      pageSize = 10,
      orderStatus,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    
    // 如果supplierId为null，返回所有订单（用于测试）
    if (supplierId) {
      queryBuilder.where('order.supplier_id = :supplierId', { supplierId });
    }
    
    if (orderStatus) {
      queryBuilder.andWhere('order.order_status = :orderStatus', { orderStatus });
    }
    if (startDate) {
      queryBuilder.andWhere('order.create_time >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('order.create_time <= :endDate', { endDate });
    }

    const [orders, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('order.create_time', 'DESC')
      .getManyAndCount();

    return {
      data: orders,
      total,
      page,
      pageSize,
    };
  }

  // 获取订单详情
  async getOrderDetail(orderId: number, supplierId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, supplierId: supplierId }
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const details = await this.orderDetailsRepository.find({
      where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
    });

    return {
      order,
      details,
    };
  }

  // 获取供应商的生产计划列表
  async getSupplierProductionPlans(supplierId: number, query: any) {
    const {
      page = 1,
      pageSize = 10,
      planStatus,
      planClass,
      startDate,
      endDate,
      orderId,
      planNameEndsWith,
    } = query;

    console.log(`getSupplierProductionPlans called with orderId: ${orderId}, supplierId: ${supplierId}`);

    const queryBuilder = this.productionPlanRepository.createQueryBuilder('plan');

    // 如果提供了 orderId，通过 djbH 字段进行关联
    if (orderId) {
      const order = await this.orderRepository.findOne({ 
        where: { id: parseInt(orderId as string, 10) } 
      });
      
      if (order) {
        console.log(`Found order with djbH: ${order.djbH}`);
        queryBuilder.where('plan.djbH = :djbH', { 
          djbH: order.djbH 
        });
      }
    } else if (supplierId) {
      queryBuilder
        .innerJoin('purchase_details', 'details', 'plan.purchaseDetailsId = details.id')
        .innerJoin('purchase_order', 'order', 'details.bpmCgddInstanceId = order.bpmCgddInstanceId')
        .where('order.supplierId = :supplierId', { supplierId });
    }
    // 如果既没有 orderId 也没有 supplierId，返回所有生产计划（用于管理员）

    // 添加其他过滤条件
    if (planStatus) {
      queryBuilder.andWhere('plan.planStatus = :planStatus', { planStatus });
    }
    if (planClass) {
      queryBuilder.andWhere('plan.planClass = :planClass', { planClass });
    }
    if (startDate) {
      queryBuilder.andWhere('plan.createTime >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('plan.createTime <= :endDate', { endDate });
    }
    if (planNameEndsWith) {
      queryBuilder.andWhere('plan.planName LIKE :planNameEndsWith', { planNameEndsWith: `%${planNameEndsWith}` });
    }

    console.log('SQL Query:', queryBuilder.getSql());
    console.log('Query Parameters:', queryBuilder.getParameters());

    const [plans, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('plan.sort_order', 'ASC')
      .addOrderBy('plan.create_time', 'DESC')
      .getManyAndCount();

    console.log(`Found ${plans.length} production plans, total: ${total}`);

    return {
      data: plans,
      total,
      page,
      pageSize,
    };
  }

  // 更新生产计划状态
  async updatePlanStatus(planId: string, status: string, supplierId: number) {
    // 验证计划是否属于该供应商
    const plan = await this.productionPlanRepository.findOne({
      where: { id: planId }
    });
    
    if (!plan) {
      throw new NotFoundException('Production plan not found');
    }

    // 验证计划是否属于该供应商（通过关联查询）
    const isPlanBelongsToSupplier = await this.productionPlanRepository
      .createQueryBuilder('plan')
      .innerJoin('purchase_details', 'details', 'plan.purchase_details_id = details.id')
      .innerJoin('purchase_order', 'order', 'details.bpm_cgdd_instance_id = order.bpm_cgdd_instance_id')
      .where('plan.id = :planId AND order.supplier_id = :supplierId', { planId, supplierId })
      .getCount() > 0;

    if (!isPlanBelongsToSupplier) {
      throw new NotFoundException('Production plan not found');
    }

    plan.planStatus = status;
    return this.productionPlanRepository.save(plan);
  }

  // 批量更新生产计划状态
  async batchUpdatePlanStatus(planIds: string[], status: string, supplierId: number) {
    console.log(`Batch updating ${planIds.length} plans to status: ${status}`);
    
    const updatedPlans: ProductionPlan[] = [];
    
    for (const planId of planIds) {
      try {
        const plan = await this.productionPlanRepository.findOne({
          where: { id: planId }
        });
        
        if (plan) {
          plan.planStatus = status;
          const savedPlan = await this.productionPlanRepository.save(plan);
          updatedPlans.push(savedPlan);
        }
      } catch (error) {
        console.error(`Failed to update plan ${planId}:`, error);
      }
    }
    
    console.log(`Successfully updated ${updatedPlans.length} plans`);
    
    return {
      success: true,
      updatedCount: updatedPlans.length,
      updatedPlans
    };
  }
}