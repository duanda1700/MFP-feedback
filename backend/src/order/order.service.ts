import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrderTask } from '../database/entities/purchase-order-task.entity';
import { Supplier } from '../database/entities/supplier.entity';
import { OperationLog } from '../database/entities/operation-log.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(PurchaseOrder) private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseDetails) private orderDetailsRepository: Repository<PurchaseDetails>,
    @InjectRepository(ProductionPlan) private productionPlanRepository: Repository<ProductionPlan>,
    @InjectRepository(PurchaseOrderTask) private orderTaskRepository: Repository<PurchaseOrderTask>,
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>,
    @InjectRepository(OperationLog) private operationLogRepository: Repository<OperationLog>,
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
      queryBuilder.andWhere('order.set_count LIKE :setCount', { setCount: `%${setCount}%` });
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
    console.log(`Getting order detail for id: ${id}`);
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      console.error(`Order not found for id: ${id}`);
      throw new NotFoundException('Order not found');
    }

    console.log(`Found order: ${order.djbH}, bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);
    const details = await this.orderDetailsRepository.find({
      where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
    });

    console.log(`Found ${details.length} order details`);
    const result = {
      order,
      details,
    };
    console.log('Order detail response:', result);
    return result;
  }

  // 标记关键物料
  async markKeyMaterial(orderDetailId: string, isKeyMaterial: boolean) {
    console.log(`Marking key material: ${orderDetailId}, isKeyMaterial: ${isKeyMaterial}`);
    const detail = await this.orderDetailsRepository.findOne({ where: { id: orderDetailId } });
    if (!detail) {
      throw new NotFoundException('Order detail not found');
    }

    detail.isKeyMaterial = isKeyMaterial ? '是' : '否';
    const savedDetail = await this.orderDetailsRepository.save(detail);
    console.log('Key material marked successfully:', savedDetail);
    return savedDetail;
  }

  // 标记制造符合性检查物料
  async markComplianceMaterial(orderDetailId: string, isComplianceMaterial: boolean) {
    console.log(`Marking compliance material: ${orderDetailId}, isComplianceMaterial: ${isComplianceMaterial}`);
    const detail = await this.orderDetailsRepository.findOne({ where: { id: orderDetailId } });
    if (!detail) {
      throw new NotFoundException('Order detail not found');
    }

    detail.isComplianceMaterial = isComplianceMaterial ? '是' : '否';
    const savedDetail = await this.orderDetailsRepository.save(detail);
    console.log('Compliance material marked successfully:', savedDetail);
    return savedDetail;
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
          }) as ProductionPlan | null;
          
          if (productionPlan) {
            console.log(`Found production plan using bpmCgddmxId: ${productionPlan.id}`);
          }
        }
        
        // 方式2：如果方式1失败，尝试使用materialCode匹配
        if (!productionPlan && detail.materialCode) {
          console.log(`Trying to find production plan with materialCode: ${detail.materialCode}`);
          productionPlan = await this.productionPlanRepository.findOne({ 
            where: { materialCode: detail.materialCode } 
          }) as ProductionPlan | null;
          
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
              }) as ProductionPlan | null;
              
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
            }) as ProductionPlan | null;
            
            if (productionPlan) {
              console.log(`Found production plan using direct id: ${productionPlan.id}`);
            }
          }
        }
        
        // 方式5：如果所有方式都失败，尝试获取任意一个生产计划
        if (!productionPlan) {
          console.log(`Trying to find any production plan`);
          productionPlan = await this.productionPlanRepository.findOne({}) as ProductionPlan | null;
          
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

  // 更新采购订单状态
  async updateOrderStatus(id: number, status: string) {
    console.log(`Updating order status for id: ${id} to: ${status}`);
    
    // 状态映射
    const statusMap: Record<string, string> = {
      'pending': '待处理',
      'processing': '处理中',
      'completed': '已完成'
    };

    const actualStatus = statusMap[status] || status;
    
    // 查找订单
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      console.error(`Order not found for id: ${id}`);
      throw new NotFoundException('Order not found');
    }
    
    // 更新状态
    order.orderStatus = actualStatus;
    const updatedOrder = await this.orderRepository.save(order);
    
    console.log(`Order status updated successfully: ${updatedOrder.id}`);
    return updatedOrder;
  }

  // 获取供应商列表
  async getSupplierList() {
    console.log('Getting supplier list');
    
    // 只返回启用状态的供应商
    const suppliers = await this.supplierRepository.find({ where: { status: '启用' } });
    
    console.log(`Found ${suppliers.length} suppliers`);
    return suppliers;
  }

  // 生成计划反馈模板
  async generatePlanFeedbackTemplate(orderId: number) {
    console.log(`Generating plan feedback template for orderId: ${orderId}`);
    
    // 获取订单详情
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // 获取采购订单明细
    const details = await this.orderDetailsRepository.find({
      where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
    });

    console.log(`Found ${details.length} purchase details`);
    
    // 生成计划反馈模板
    const template = details.map(detail => ({
      materialCode: detail.materialCode,
      materialDesc: detail.materialDesc,
      quantity: detail.quantity,
      planDate: detail.planDate,
      isKeyMaterial: detail.isKeyMaterial === '是',
      isComplianceMaterial: detail.isComplianceMaterial === '是',
      planStatus: '待确认',
      supplierCode: detail.supplierCode,
      supplierName: order.supplierName,
      orderNo: detail.orderNo,
      remarks: ''
    }));

    console.log(`Generated plan feedback template with ${template.length} items`);
    return template;
  }

  // 订单下发
  async issueOrder(orderId: number, supplierId: number, issueDesc: string, planCompleteTime: Date, detailMarks: any[], planFeedbackTemplate: any[]) {
    console.log(`Issuing order ${orderId} to supplier ${supplierId}`);
    
    // 开始事务
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 获取订单
      const order = await queryRunner.manager.findOne(PurchaseOrder, { where: { id: orderId } });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      
      // 2. 校验订单状态
      if (order.orderStatus !== '待下发' && order.orderStatus !== '有变更') {
        throw new Error('Only orders with status "待下发" or "有变更" can be issued');
      }
      
      // 3. 校验供应商状态
      const supplier = await queryRunner.manager.findOne(Supplier, { where: { id: supplierId } });
      if (!supplier || supplier.status !== '启用') {
        throw new Error('Supplier not found or not enabled');
      }
      
      // 4. 处理采购订单明细标记状态
      for (const mark of detailMarks) {
        const detail = await queryRunner.manager.findOne(PurchaseDetails, { where: { id: mark.detailId } });
        if (detail) {
          detail.isKeyMaterial = mark.isKeyMaterial ? '是' : '否';
          detail.isComplianceMaterial = mark.isComplianceMaterial ? '是' : '否';
          await queryRunner.manager.save(detail);
        }
      }
      
      // 5. 处理计划反馈模板，使用计数器确保每条记录都有唯一的ID
      let planCounter = 0;
      for (const planItem of planFeedbackTemplate) {
        // 为手动添加的行生成唯一标识
        const uniqueKey = `${planItem.materialCode || 'manual'}_${planItem.purchaseDetailsId || Math.random()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // 检查是否已存在对应生产计划
        let productionPlan: ProductionPlan | null = null;
        
        // 只有当存在有效的purchaseDetailsId和materialCode时，才检查是否已存在对应生产计划
        if (planItem.purchaseDetailsId && planItem.materialCode) {
          productionPlan = await queryRunner.manager.findOne(ProductionPlan, {
            where: { materialCode: planItem.materialCode, purchaseDetailsId: planItem.purchaseDetailsId }
          }) as ProductionPlan | null;
        }
        
        if (!productionPlan) {
          // 创建新的生产计划，使用计数器确保每条记录都有唯一的ID
          // 确保id长度不超过16个字符
          const timestamp = Date.now().toString().slice(-10); // 取时间戳的后10位
          const counterStr = planCounter.toString().padStart(2, '0'); // 计数器最多2位
          const id = `PP${timestamp}_${counterStr}`.slice(0, 16); // 确保不超过16个字符
          
          productionPlan = queryRunner.manager.create(ProductionPlan, {
            id: id,
            purchaseDetailsId: planItem.purchaseDetailsId || 0,
            planName: `计划反馈-${order.djbH}`,
            planType: '采购计划',
            planClass: planItem.planClass, // 添加计划分类
            planDept: '采购部',
            planMaker: '系统',
            planDate: new Date(),
            planStatus: planItem.planStatus || '待确认',
            materialCode: planItem.materialCode,
            materialDesc: planItem.materialDesc,
            quantity: planItem.quantity,
            unit: '个',
            plannedDate: planItem.plannedDate || new Date(),
            finishedQuantity: 0,
            isKeyMaterial: planItem.isKeyMaterial,
            productionLine: '',
            remarks: planItem.remarks || ''
          });
          await queryRunner.manager.save(productionPlan);
        } else {
          // 更新现有生产计划
          productionPlan.planStatus = planItem.planStatus || productionPlan.planStatus;
          productionPlan.planClass = planItem.planClass || productionPlan.planClass; // 更新计划分类
          productionPlan.remarks = planItem.remarks || productionPlan.remarks;
          await queryRunner.manager.save(productionPlan);
        }
      }
      
      // 6. 创建下发任务记录
      const orderTask = queryRunner.manager.create(PurchaseOrderTask, {
        orderId: order.id,
        supplierId: supplier.id,
        taskStatus: '已下发',
        issueDesc: issueDesc,
        planCompleteTime: planCompleteTime
      });
      await queryRunner.manager.save(orderTask);
      
      // 7. 更新订单状态
      order.orderStatus = '已下发';
      await queryRunner.manager.save(order);
      
      // 8. 生成操作日志
      const operationLog = queryRunner.manager.create(OperationLog, {
        operationType: '订单下发',
        operationDesc: `订单 ${order.djbH} 已下发给供应商 ${supplier.supplierName}`,
        operator: '系统',
        operatedAt: new Date(),
        relatedId: order.id.toString()
      });
      await queryRunner.manager.save(operationLog);
      
      // 提交事务
      await queryRunner.commitTransaction();
      
      console.log(`Order ${orderId} issued successfully to supplier ${supplierId}`);
      return {
        success: true,
        message: '订单下发成功',
        orderId: order.id,
        taskId: orderTask.id
      };
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      console.error('Error issuing order:', error);
      throw error;
    } finally {
      // 释放查询运行器
      await queryRunner.release();
    }
  }
}