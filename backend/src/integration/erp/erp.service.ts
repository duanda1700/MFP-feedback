import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PurchaseOrder } from '../../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../../database/entities/purchase-details.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ErpService {
  private readonly logger = new Logger(ErpService.name);
  private readonly erpApiUrl = 'http://localhost:8080/erp-api'; // 模拟ERP系统API地址

  constructor(private dataSource: DataSource) {}

  async syncErpData(): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('开始同步ERP数据');
      
      // 同步采购订单
      const orders = await this.fetchPurchaseOrders();
      await this.savePurchaseOrders(orders);
      
      // 同步采购明细
      const details = await this.fetchPurchaseDetails();
      await this.savePurchaseDetails(details);
      
      // 同步人员信息
      const employees = await this.fetchEmployees();
      await this.saveEmployees(employees);
      
      // 同步供应商信息
      const suppliers = await this.fetchSuppliers();
      await this.saveSuppliers(suppliers);
      
      this.logger.log('ERP数据同步完成');
      return { success: true, message: 'ERP数据同步成功' };
    } catch (error) {
      this.logger.error('ERP数据同步失败', error);
      return { success: false, message: `ERP数据同步失败: ${error.message}` };
    }
  }

  private async fetchPurchaseOrders() {
    // 模拟从ERP系统获取采购订单数据
    const response = await axios.get(`${this.erpApiUrl}/purchase-orders`);
    return response.data;
  }

  private async fetchPurchaseDetails() {
    // 模拟从ERP系统获取采购明细数据
    const response = await axios.get(`${this.erpApiUrl}/purchase-details`);
    return response.data;
  }

  private async fetchEmployees() {
    // 模拟从ERP系统获取人员信息
    const response = await axios.get(`${this.erpApiUrl}/employees`);
    return response.data;
  }

  private async fetchSuppliers() {
    // 模拟从ERP系统获取供应商信息
    const response = await axios.get(`${this.erpApiUrl}/suppliers`);
    return response.data;
  }

  private async savePurchaseOrders(orders: any[]) {
    const orderRepository = this.dataSource.getRepository(PurchaseOrder);
    
    for (const order of orders) {
      const existingOrder = await orderRepository.findOne({ where: { djbH: order.djbH } });
      
      if (existingOrder) {
        // 更新现有订单
        orderRepository.merge(existingOrder, order);
        await orderRepository.save(existingOrder);
      } else {
        // 创建新订单
        const newOrder = orderRepository.create(order);
        await orderRepository.save(newOrder);
      }
    }
  }

  private async savePurchaseDetails(details: any[]) {
    const detailRepository = this.dataSource.getRepository(PurchaseDetails);
    
    for (const detail of details) {
      const existingDetail = await detailRepository.findOne({ where: { id: detail.id } });
      
      if (existingDetail) {
        // 更新现有明细
        detailRepository.merge(existingDetail, detail);
        await detailRepository.save(existingDetail);
      } else {
        // 创建新明细
        const newDetail = detailRepository.create(detail);
        await detailRepository.save(newDetail);
      }
    }
  }

  private async saveEmployees(employees: any[]) {
    // 保存人员信息逻辑
    this.logger.log(`同步人员信息 ${employees.length} 条`);
  }

  private async saveSuppliers(suppliers: any[]) {
    // 保存供应商信息逻辑
    this.logger.log(`同步供应商信息 ${suppliers.length} 条`);
  }

  async manuallySyncErpData(): Promise<{ success: boolean; message: string }> {
    return this.syncErpData();
  }
}
