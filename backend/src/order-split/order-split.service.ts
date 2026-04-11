import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { OrderSplitRecord } from '../database/entities/order-split-record.entity';
import { OrderSplitDetail } from '../database/entities/order-split-detail.entity';
import { OrderSplitPreviewDto, OrderSplitExecuteDto } from './dto/order-split.dto';
import { OperationLog } from '../database/entities/operation-log.entity';

@Injectable()
export class OrderSplitService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseDetails)
    private detailsRepository: Repository<PurchaseDetails>,
    @InjectRepository(OrderSplitRecord)
    private splitRecordRepository: Repository<OrderSplitRecord>,
    @InjectRepository(OrderSplitDetail)
    private splitDetailRepository: Repository<OrderSplitDetail>,
    @InjectRepository(OperationLog)
    private operationLogRepository: Repository<OperationLog>,
    private dataSource: DataSource,
  ) {}

  async previewSplit(dto: OrderSplitPreviewDto) {
    const { orderId, suppliers } = dto;
    
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.orderStatus !== '待下发') {
      throw new BadRequestException('只有状态为"待下发"的订单才能拆分');
    }

    if (order.orderType === 'SPLIT') {
      throw new BadRequestException('子订单不能再次拆分');
    }

    const details = await this.detailsRepository.find({
      where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
    });

    const preview: any = {
      originalOrder: {
        id: order.id,
        djbH: order.djbH,
        supplierName: order.supplierName,
        itemCount: details.length,
        totalQuantity: details.reduce((sum, d) => sum + (d.quantity || 0), 0),
      },
      subOrders: [],
    };

    for (const supplier of suppliers) {
      const subDjbh = await this.generateSubDjbh(order.djbH, supplier.supplierId);
      
      const totalQuantity = supplier.items.reduce((sum, item) => sum + item.quantity, 0);
      
      preview.subOrders.push({
        subDjbh,
        supplierId: supplier.supplierId,
        supplierName: supplier.supplierName,
        itemCount: supplier.items.length,
        totalQuantity,
        items: supplier.items,
      });
    }

    return preview;
  }

  async executeSplit(dto: OrderSplitExecuteDto, operator: string) {
    const { orderId, suppliers, splitReason } = dto;
    
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.orderStatus !== '待下发') {
      throw new BadRequestException('只有状态为"待下发"的订单才能拆分');
    }

    if (order.orderType === 'SPLIT') {
      throw new BadRequestException('子订单不能再次拆分');
    }

    const details = await this.detailsRepository.find({
      where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const splitBatchNo = `SPLIT-${Date.now()}-${orderId}`;
      const splitTime = new Date();

      const splitRecord = queryRunner.manager.create(OrderSplitRecord, {
        originalOrderId: orderId,
        originalDjbh: order.djbH,
        splitBatchNo,
        splitCount: suppliers.length,
        splitType: 'BY_ITEM',
        splitReason: splitReason || '',
        operator,
        status: 'ACTIVE',
      });
      await queryRunner.manager.save(splitRecord);

      const subOrders: any[] = [];

      for (let i = 0; i < suppliers.length; i++) {
        const supplier = suppliers[i];
        const subDjbh = await this.generateSubDjbh(order.djbH, i + 1);

        const subOrder = queryRunner.manager.create(PurchaseOrder, {
          bpmCgddId: order.bpmCgddId,
          bpmCgddInstanceId: Date.now() + i,
          djbH: subDjbh,
          applyUsername: order.applyUsername,
          applyUserno: order.applyUserno,
          applyDept: order.applyDept,
          budgetNo: order.budgetNo,
          secondPlanName: order.secondPlanName,
          purchaseLevel: order.purchaseLevel,
          actualPlanPurchaseName: order.actualPlanPurchaseName,
          isTemporaryEmergency: order.isTemporaryEmergency,
          purchaseTaskType: order.purchaseTaskType,
          major: order.major,
          project: order.project,
          version: order.version,
          versionControlType: order.versionControlType,
          orderStatus: '待下发',
          feedbackStatus: '未开始',
          setCount: order.setCount,
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName,
          purchaseManager: order.purchaseManager,
          parentOrderId: orderId,
          orderType: 'SPLIT',
          splitCount: suppliers.length,
          splitBatchNo,
          splitTime,
          splitOperator: operator,
        });
        await queryRunner.manager.save(subOrder);

        for (const item of supplier.items) {
          const originalDetail = details.find(d => d.materialCode === item.materialCode);
          if (!originalDetail) {
            throw new BadRequestException(`物料编码 ${item.materialCode} 在原订单中不存在`);
          }

          const newDetail = queryRunner.manager.create(PurchaseDetails, {
            id: this.generateDetailId(),
            bpmCgddmxId: originalDetail.bpmCgddmxId,
            bpmCgddInstanceId: subOrder.bpmCgddInstanceId,
            receiveCompany: originalDetail.receiveCompany,
            materialCode: originalDetail.materialCode,
            materialDesc: originalDetail.materialDesc,
            materialGroup: originalDetail.materialGroup,
            quantity: item.quantity,
            planDate: originalDetail.planDate,
            planNo: originalDetail.planNo,
            productType: originalDetail.productType,
            secondPlanNo: originalDetail.secondPlanNo,
            secondPlanName: originalDetail.secondPlanName,
            orderNo: subDjbh,
            setCount: originalDetail.setCount,
            drawingNo: originalDetail.drawingNo,
            changeType: originalDetail.changeType,
            supplierCode: String(supplier.supplierId),
            detailStatus: '待下发',
            isKeyMaterial: originalDetail.isKeyMaterial,
            isComplianceMaterial: originalDetail.isComplianceMaterial,
            jhrq: originalDetail.jhrq,
            sfzz: originalDetail.sfzz,
          });
          await queryRunner.manager.save(newDetail);
        }

        const splitDetail = queryRunner.manager.create(OrderSplitDetail, {
          splitRecordId: splitRecord.id,
          subOrderId: subOrder.id,
          subDjbh: subDjbh,
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName,
          splitAmount: supplier.items.reduce((sum, item) => sum + item.quantity, 0),
          splitRemark: '',
        });
        await queryRunner.manager.save(splitDetail);

        subOrders.push({
          subOrderId: subOrder.id,
          subDjbh: subDjbh,
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName,
        });
      }

      await queryRunner.manager.update(PurchaseOrder, orderId, {
        orderStatus: '已拆分',
        splitCount: suppliers.length,
        splitBatchNo,
        splitTime,
        splitOperator: operator,
      });

      await this.logOperation(queryRunner, {
        operationType: 'ORDER_SPLIT',
        module: 'order',
        targetId: String(orderId),
        targetName: order.djbH,
        operator,
        operationDesc: `订单拆分：${order.djbH} 拆分为 ${suppliers.length} 个子订单`,
        beforeData: JSON.stringify({ originalOrder: order }),
        afterData: JSON.stringify({ subOrders }),
      });

      await queryRunner.commitTransaction();

      return {
        success: true,
        splitRecordId: splitRecord.id,
        splitBatchNo,
        totalSubOrders: subOrders.length,
        subOrders,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`拆分失败: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async cancelSplit(splitRecordId: number, operator: string) {
    const splitRecord = await this.splitRecordRepository.findOne({
      where: { id: splitRecordId },
    });

    if (!splitRecord) {
      throw new NotFoundException('拆分记录不存在');
    }

    if (splitRecord.status === 'CANCELLED') {
      throw new BadRequestException('该拆分已撤销');
    }

    const splitDetails = await this.splitDetailRepository.find({
      where: { splitRecordId },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const detail of splitDetails) {
        const subOrder = await queryRunner.manager.findOne(PurchaseOrder, {
          where: { id: detail.subOrderId },
        });

        if (!subOrder) {
          continue;
        }

        if (subOrder.orderStatus !== '待下发') {
          throw new BadRequestException(`子订单 ${subOrder.djbH} 状态不是"待下发"，无法撤销`);
        }

        await queryRunner.manager.delete(PurchaseDetails, {
          bpmCgddInstanceId: subOrder.bpmCgddInstanceId,
        });

        await queryRunner.manager.delete(PurchaseOrder, detail.subOrderId);
      }

      await queryRunner.manager.update(PurchaseOrder, splitRecord.originalOrderId, {
        orderStatus: '待下发',
        splitCount: undefined,
        splitBatchNo: undefined,
        splitTime: undefined,
        splitOperator: undefined,
      });

      await queryRunner.manager.update(OrderSplitRecord, splitRecordId, {
        status: 'CANCELLED',
      });

      await this.logOperation(queryRunner, {
        operationType: 'ORDER_SPLIT_CANCEL',
        module: 'order',
        targetId: String(splitRecord.originalOrderId),
        targetName: splitRecord.originalDjbh,
        operator,
        operationDesc: `撤销订单拆分：${splitRecord.originalDjbh}`,
        beforeData: JSON.stringify({ splitRecord, splitDetails }),
        afterData: JSON.stringify({ status: 'CANCELLED' }),
      });

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: '拆分已撤销',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`撤销失败: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getSplitHistory(orderId: number) {
    const records = await this.splitRecordRepository.find({
      where: { originalOrderId: orderId },
      order: { createTime: 'DESC' },
    });

    return records;
  }

  async getSubOrders(orderId: number) {
    const subOrders = await this.orderRepository.find({
      where: { parentOrderId: orderId },
      order: { createTime: 'ASC' },
    });

    return subOrders;
  }

  async getSplitDetail(splitRecordId: number) {
    const splitRecord = await this.splitRecordRepository.findOne({
      where: { id: splitRecordId },
    });

    if (!splitRecord) {
      throw new NotFoundException('拆分记录不存在');
    }

    const splitDetails = await this.splitDetailRepository.find({
      where: { splitRecordId },
    });

    return {
      splitRecord,
      splitDetails,
    };
  }

  private async generateSubDjbh(originalDjbh: string, index: number): Promise<string> {
    return `${originalDjbh}-S${index}`;
  }

  private generateDetailId(): string {
    return String(Date.now() + Math.floor(Math.random() * 10000));
  }

  private async logOperation(queryRunner: QueryRunner, logData: any) {
    const operationLog = queryRunner.manager.create(OperationLog, {
      operationType: logData.operationType,
      operationDesc: logData.operationDesc,
      operator: logData.operator,
      operatedAt: new Date(),
      relatedId: logData.targetId,
    });
    await queryRunner.manager.save(operationLog);
  }
}
