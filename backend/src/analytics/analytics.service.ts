import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { FeedbackData } from '../database/entities/feedback-data.entity';
import { Alert } from '../database/entities/alert.entity';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { TaskService } from '../task/task.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PurchaseOrder) private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseDetails) private orderDetailsRepository: Repository<PurchaseDetails>,
    @InjectRepository(ProductionPlan) private planRepository: Repository<ProductionPlan>,
    @InjectRepository(FeedbackData) private feedbackRepository: Repository<FeedbackData>,
    @InjectRepository(Alert) private alertRepository: Repository<Alert>,
    private taskService: TaskService,
  ) {}

  // 获取统计数据
  async getStatistics() {
    // 订单统计
    const totalOrders = await this.orderRepository.count();
    const pendingOrders = await this.orderRepository.count({ where: { orderStatus: '待处理' } });
    const completedOrders = await this.orderRepository.count({ where: { orderStatus: '已完成' } });

    // 计划统计
    const totalPlans = await this.planRepository.count();
    const pendingPlans = await this.planRepository.count({ where: { planStatus: '待审批' } });
    const completedPlans = await this.planRepository.count({ where: { planStatus: '已闭环' } });

    // 反馈统计
    const totalFeedbacks = await this.feedbackRepository.count();
    const pendingFeedbacks = await this.feedbackRepository.count({ where: { feedbackStatus: 1 } });

    // 预警统计
    const totalAlerts = await this.alertRepository.count();
    const pendingAlerts = await this.alertRepository.count({ where: { alertStatus: 1 } });
    const highLevelAlerts = await this.alertRepository.count({ where: { alertLevel: 3 } });

    return {
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
      },
      plans: {
        total: totalPlans,
        pending: pendingPlans,
        completed: completedPlans,
      },
      feedbacks: {
        total: totalFeedbacks,
        pending: pendingFeedbacks,
      },
      alerts: {
        total: totalAlerts,
        pending: pendingAlerts,
        highLevel: highLevelAlerts,
      },
    };
  }

  // 获取趋势数据
  async getTrendData(type: string, period: string) {
    // 这里应该实现获取趋势数据的逻辑
    // 暂时返回模拟数据
    const now = new Date();
    const data: { date: string; value: number }[] = [];

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100) + 50,
        });
      }
    } else if (period === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 200) + 100,
        });
      }
    } else if (period === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        data.push({
          date: date.toISOString().substring(0, 7),
          value: Math.floor(Math.random() * 500) + 200,
        });
      }
    }

    return {
      type,
      period,
      data,
    };
  }

  // 导出报表
  async exportReport(reportType: string, filters: any, createdBy: number, createdName: string) {
    // 创建异步任务
    const task = await this.taskService.createTask(
      'export-report',
      { reportType, filters },
      createdBy,
      createdName,
    );

    return {
      taskId: task.id,
      taskStatus: task.taskStatus,
      message: '报表导出任务已创建，正在处理中',
    };
  }

  // 导出订单报表
  private async exportOrderReport(workbook: ExcelJS.Workbook, filters: any) {
    const worksheet = workbook.addWorksheet('订单报表');

    // 设置表头
    worksheet.columns = [
      { header: '订单ID', key: 'id', width: 10 },
      { header: '订单编号', key: 'djbH', width: 20 },
      { header: '供应商', key: 'supplierName', width: 20 },
      { header: '订单状态', key: 'orderStatus', width: 15 },
      { header: '创建时间', key: 'createTime', width: 20 },
      { header: '更新时间', key: 'updateTime', width: 20 },
    ];

    // 获取订单数据
    const orders = await this.orderRepository.find();

    // 添加数据行
    orders.forEach(order => {
      worksheet.addRow({
        id: order.id,
        djbH: order.djbH,
        supplierName: order.supplierName,
        orderStatus: order.orderStatus,
        createTime: order.createTime,
        updateTime: order.updateTime,
      });
    });

    // 设置样式
    worksheet.getRow(1).font = { bold: true };
  }

  // 导出计划报表
  private async exportPlanReport(workbook: ExcelJS.Workbook, filters: any) {
    const worksheet = workbook.addWorksheet('计划报表');

    // 设置表头
    worksheet.columns = [
      { header: '计划ID', key: 'id', width: 20 },
      { header: '计划名称', key: 'planName', width: 30 },
      { header: '计划状态', key: 'planStatus', width: 15 },
      { header: '计划日期', key: 'planDate', width: 20 },
      { header: '创建时间', key: 'createTime', width: 20 },
    ];

    // 获取计划数据
    const plans = await this.planRepository.find();

    // 添加数据行
    plans.forEach(plan => {
      worksheet.addRow({
        id: plan.id,
        planName: plan.planName,
        planStatus: plan.planStatus,
        planDate: plan.planDate,
        createTime: plan.createTime,
      });
    });

    // 设置样式
    worksheet.getRow(1).font = { bold: true };
  }

  // 导出反馈报表
  private async exportFeedbackReport(workbook: ExcelJS.Workbook, filters: any) {
    const worksheet = workbook.addWorksheet('反馈报表');

    // 设置表头
    worksheet.columns = [
      { header: '反馈ID', key: 'id', width: 10 },
      { header: '订单ID', key: 'orderId', width: 10 },
      { header: '计划ID', key: 'planId', width: 10 },
      { header: '反馈状态', key: 'feedbackStatus', width: 15 },
      { header: '反馈时间', key: 'feedbackTime', width: 20 },
      { header: '操作人', key: 'operatorName', width: 15 },
    ];

    // 获取反馈数据
    const feedbacks = await this.feedbackRepository.find();

    // 添加数据行
    feedbacks.forEach(feedback => {
      worksheet.addRow({
        id: feedback.id,
        orderId: feedback.orderId,
        planId: feedback.planId,
        feedbackStatus: feedback.feedbackStatus,
        feedbackTime: feedback.feedbackTime,
        operatorName: feedback.operatorName,
      });
    });

    // 设置样式
    worksheet.getRow(1).font = { bold: true };
  }

  // 导出预警报表
  private async exportAlertReport(workbook: ExcelJS.Workbook, filters: any) {
    const worksheet = workbook.addWorksheet('预警报表');

    // 设置表头
    worksheet.columns = [
      { header: '预警ID', key: 'id', width: 10 },
      { header: '预警类型', key: 'alertType', width: 15 },
      { header: '预警级别', key: 'alertLevel', width: 10 },
      { header: '预警状态', key: 'alertStatus', width: 10 },
      { header: '创建时间', key: 'createTime', width: 20 },
      { header: '处理时间', key: 'processTime', width: 20 },
      { header: '关闭时间', key: 'closeTime', width: 20 },
    ];

    // 获取预警数据
    const alerts = await this.alertRepository.find();

    // 添加数据行
    alerts.forEach(alert => {
      worksheet.addRow({
        id: alert.id,
        alertType: alert.alertType,
        alertLevel: alert.alertLevel,
        alertStatus: alert.alertStatus,
        createTime: alert.createTime,
        processTime: alert.processTime,
        closeTime: alert.closeTime,
      });
    });

    // 设置样式
    worksheet.getRow(1).font = { bold: true };
  }

  // 导出订单变更报表
  private async exportOrderChangeReport(workbook: ExcelJS.Workbook, filters: any) {
    const worksheet = workbook.addWorksheet('订单变更报表');

    // 设置表头
    worksheet.columns = [
      { header: '订单ID', key: 'id', width: 10 },
      { header: '订单编号', key: 'djbH', width: 20 },
      { header: '供应商', key: 'supplierName', width: 20 },
      { header: '变更类型', key: 'changeType', width: 15 },
      { header: '变更时间', key: 'updateTime', width: 20 },
      { header: '处理效率', key: 'processEfficiency', width: 15 },
    ];

    // 这里应该获取订单变更数据
    // 暂时使用订单数据模拟
    const orders = await this.orderRepository.find();

    // 添加数据行
    orders.forEach(order => {
      worksheet.addRow({
        id: order.id,
        djbH: order.djbH,
        supplierName: order.supplierName,
        changeType: '计划变更',
        updateTime: order.updateTime,
        processEfficiency: '高',
      });
    });

    // 设置样式
    worksheet.getRow(1).font = { bold: true };
  }

  // 获取订单变更统计报表
  async getOrderChangeStatistics(filters: any) {
    // 这里应该实现订单变更统计报表逻辑
    // 暂时返回模拟数据
    return {
      byTime: [
        { period: '2026-01-01', count: 10 },
        { period: '2026-01-02', count: 15 },
        { period: '2026-01-03', count: 12 },
        { period: '2026-01-04', count: 18 },
        { period: '2026-01-05', count: 20 },
      ],
      bySupplier: [
        { supplier: '供应商A', count: 30 },
        { supplier: '供应商B', count: 25 },
        { supplier: '供应商C', count: 20 },
      ],
      byChangeType: [
        { type: '计划变更', count: 40 },
        { type: '数量变更', count: 20 },
        { type: '日期变更', count: 15 },
      ],
      byProcessEfficiency: [
        { efficiency: '高', count: 45 },
        { efficiency: '中', count: 20 },
        { efficiency: '低', count: 10 },
      ],
    };
  }
}
