import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(PurchaseOrder) private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseDetails) private orderDetailsRepository: Repository<PurchaseDetails>,
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
    } = query;

    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (orderStatus) {
      queryBuilder.andWhere('order.order_status = :orderStatus', { orderStatus });
    }

    if (supplierName) {
      queryBuilder.andWhere('order.supplier_name LIKE :supplierName', { supplierName: `%${supplierName}%` });
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
}
