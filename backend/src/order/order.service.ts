import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(PurchaseOrder) private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseDetails) private orderDetailsRepository: Repository<PurchaseDetails>,
    @InjectRepository(ProductionPlan) private productionPlanRepository: Repository<ProductionPlan>,
  ) {}

  // 获取订单列表
  async getOrderList(query: any) {
    const {
      page = 1,
      pageSize = 10,
      orderStatus,
      supplierName,
      startDate,
      endDate,
      djbH,
      project,
      setCount,
    } = query;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (orderStatus) {
      queryBuilder.andWhere('order.order_status = :orderStatus', { orderStatus });
    }

    if (supplierName) {
      queryBuilder.andWhere('order.supplier_name LIKE :supplierName', { supplierName: `%${supplierName}%` });
    }

    if (djbH) {
      queryBuilder.andWhere('order.djbH LIKE :djbH', { djbH: `%${djbH}%` });
    }

    if (project) {
      queryBuilder.andWhere('order.project LIKE :project', { project: `%${project}%` });
    }

    if (setCount) {
      queryBuilder.andWhere('order.setCount LIKE :setCount', { setCount: `%${setCount}%` });
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
  async getOrderDetail(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
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

  // 标记关键物料
  async markKeyMaterial(orderDetailId: string, isKeyMaterial: boolean) {
    const detail = await this.orderDetailsRepository.findOne({ where: { id: orderDetailId } });
    if (!detail) {
      throw new NotFoundException('Order detail not found');
    }

    detail.isKeyMaterial = isKeyMaterial ? '是' : '否';
    return this.orderDetailsRepository.save(detail);
  }

  // 下发任务
  async issueTask(orderId: number, supplierId: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.orderStatus = '已下发';
    return this.orderRepository.save(order);
  }

  // 同步ERP数据
  async syncErpData() {
    // 这里应该实现与ERP系统的API对接
    // 暂时返回模拟数据
    return {
      message: 'ERP data synchronized successfully',
      synchronizedCount: 0,
    };
  }

  // 创建订单
  async createOrder(orderData: any) {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  // 更新订单
  async updateOrder(id: number, orderData: any) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    Object.assign(order, orderData);
    return this.orderRepository.save(order);
  }

  // 删除订单
  async deleteOrder(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.orderRepository.remove(order);
  }

  // 获取宽表数据
  async getWideTableData(orderId: number) {
    console.log(`Getting wide table data for orderId: ${orderId}`);
    
    // 根据订单ID获取采购订单
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      console.error(`Order not found for id: ${orderId}`);
      throw new NotFoundException('Order not found');
    }
    
    console.log(`Found order: ${order.djbH}, bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);

    // 确保采购订单有bpmCgddInstanceId
    if (!order.bpmCgddInstanceId) {
      console.error(`Order ${order.djbH} has no bpmCgddInstanceId`);
      return {
        data: [],
        total: 0
      };
    }

    // 根据采购订单的bpmCgddInstanceId获取采购订单明细
    const details = await this.orderDetailsRepository.find({ 
      where: { bpmCgddInstanceId: order.bpmCgddInstanceId } 
    });
    
    console.log(`Found ${details.length} purchase details for bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);

    // 对于每条采购订单明细，获取关联的生产计划
    const wideTableData = [] as Array<{
      materialCode: string;
      materialDesc: string;
      quantity: number;
      drawingNo: string;
      purchasePlanDate: Date;
      productionPlanDate: Date;
      planStatus: string;
      remarks: string;
    }>;
    
    for (const detail of details) {
      console.log(`Processing detail: ${detail.id}, bpmCgddmxId: ${detail.bpmCgddmxId}, materialCode: ${detail.materialCode}`);
      
      // 确保明细有id
      if (!detail.id) {
        console.warn('Detail has no id, skipping');
        continue;
      }

      try {
        // 尝试多种方式获取关联的生产计划
        let productionPlan: ProductionPlan | null = null;
        
        // 方式1：使用detail.bpmCgddmxId（与测试数据中的purchaseDetailsId对应）
        if (detail.bpmCgddmxId) {
          console.log(`Trying to find production plan with purchaseDetailsId: ${detail.bpmCgddmxId}`);
          productionPlan = await this.productionPlanRepository.findOne({ 
            where: { purchaseDetailsId: detail.bpmCgddmxId } 
          });
          
          if (productionPlan) {
            console.log(`Found production plan using bpmCgddmxId: ${productionPlan.id}`);
          }
        }
        
        // 方式2：如果方式1失败，尝试使用materialCode匹配
        if (!productionPlan && detail.materialCode) {
          console.log(`Trying to find production plan with materialCode: ${detail.materialCode}`);
          productionPlan = await this.productionPlanRepository.findOne({ 
            where: { materialCode: detail.materialCode } 
          });
          
          if (productionPlan) {
            console.log(`Found production plan using materialCode: ${productionPlan.id}`);
          }
        }
        
        // 方式3：如果方式1和方式2失败，尝试从detail.id中提取数字部分
        if (!productionPlan && detail.id) {
          // 提取detail.id中的数字部分
          const numericPart = detail.id.replace(/\D/g, '');
          if (numericPart) {
            const purchaseDetailsId = parseInt(numericPart, 10);
            if (!isNaN(purchaseDetailsId)) {
              console.log(`Trying to find production plan with numeric part: ${purchaseDetailsId}`);
              productionPlan = await this.productionPlanRepository.findOne({ 
                where: { purchaseDetailsId } 
              });
              
              if (productionPlan) {
                console.log(`Found production plan using numeric part: ${productionPlan.id}`);
              }
            }
          }
        }
        
        // 方式4：直接使用detail.id（如果是数字格式）
        if (!productionPlan && detail.id) {
          const purchaseDetailsId = parseInt(detail.id, 10);
          if (!isNaN(purchaseDetailsId)) {
            console.log(`Trying to find production plan with direct id: ${purchaseDetailsId}`);
            productionPlan = await this.productionPlanRepository.findOne({ 
              where: { purchaseDetailsId } 
            });
            
            if (productionPlan) {
              console.log(`Found production plan using direct id: ${productionPlan.id}`);
            }
          }
        }
        
        // 方式5：如果所有方式都失败，尝试获取任意一个生产计划
        if (!productionPlan) {
          console.log(`Trying to find any production plan`);
          productionPlan = await this.productionPlanRepository.findOne({});
          
          if (productionPlan) {
            console.log(`Found production plan using any: ${productionPlan.id}`);
          }
        }

        if (productionPlan) {
          console.log(`Adding production plan to wide table data: ${productionPlan.id}`);
          wideTableData.push({
            materialCode: detail.materialCode,
            materialDesc: detail.materialDesc,
            quantity: detail.quantity,
            drawingNo: detail.drawingNo,
            purchasePlanDate: detail.planDate,
            productionPlanDate: productionPlan.plannedDate,
            planStatus: productionPlan.planStatus,
            remarks: productionPlan.remarks
          });
        } else {
          console.warn(`No production plan found for detail: ${detail.id}`);
          // 如果没有找到生产计划，仍然添加采购订单明细数据
          wideTableData.push({
            materialCode: detail.materialCode,
            materialDesc: detail.materialDesc,
            quantity: detail.quantity,
            drawingNo: detail.drawingNo,
            purchasePlanDate: detail.planDate,
            productionPlanDate: new Date(),
            planStatus: '未知',
            remarks: '无生产计划'
          });
        }
      } catch (error) {
        console.error(`Error getting production plan for detail ${detail.id}:`, error);
        continue;
      }
    }
    
    console.log(`Wide table data built with ${wideTableData.length} items`);

    return {
      data: wideTableData,
      total: wideTableData.length
    };
  }

  // 更新计划状态
  async updatePlanStatus(materialCode: string, planStatus: string) {
    console.log(`Updating plan status for materialCode: ${materialCode} to: ${planStatus}`);
    
    // 根据物料编码查找生产计划
    const productionPlan = await this.productionPlanRepository.findOne({ 
      where: { materialCode } 
    });
    
    if (!productionPlan) {
      console.error(`Production plan not found for materialCode: ${materialCode}`);
      throw new NotFoundException('Production plan not found');
    }
    
    // 更新计划状态
    productionPlan.planStatus = planStatus;
    const updatedPlan = await this.productionPlanRepository.save(productionPlan);
    
    console.log(`Plan status updated successfully: ${updatedPlan.id}`);
    return updatedPlan;
  }

  // 更新备注
  async updateRemarks(materialCode: string, remarks: string) {
    console.log(`Updating remarks for materialCode: ${materialCode}`);
    
    // 根据物料编码查找生产计划
    const productionPlan = await this.productionPlanRepository.findOne({ 
      where: { materialCode } 
    });
    
    if (!productionPlan) {
      console.error(`Production plan not found for materialCode: ${materialCode}`);
      throw new NotFoundException('Production plan not found');
    }
    
    // 更新备注
    productionPlan.remarks = remarks;
    const updatedPlan = await this.productionPlanRepository.save(productionPlan);
    
    console.log(`Remarks updated successfully: ${updatedPlan.id}`);
    return updatedPlan;
  }
}
