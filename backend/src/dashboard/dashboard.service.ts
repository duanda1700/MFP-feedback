import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { TodoTask, TodoTaskStatus } from '../database/entities/todo-task.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(PurchaseOrder) private orderRepository: Repository<PurchaseOrder>,
    @InjectRepository(ProductionPlan) private planRepository: Repository<ProductionPlan>,
    @InjectRepository(ManufacturePlanFeedbackMain) private feedbackRepository: Repository<ManufacturePlanFeedbackMain>,
    @InjectRepository(TodoTask) private todoTaskRepository: Repository<TodoTask>,
  ) {}

  async getStatistics(userId?: number) {
    const [
      totalOrders,
      completedOrders,
      inProgressOrders,
      pendingOrders,
      delayedOrders,
      totalPlans,
      confirmedPlans,
      pendingPlans,
      totalFeedbacks,
      completedFeedbacks,
      delayedFeedbacks,
      todoStats,
    ] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({ where: { orderStatus: '已完成' } }),
      this.orderRepository.count({ where: { orderStatus: '进行中' } }),
      this.orderRepository.count({ where: { orderStatus: '待下发' } }),
      this.orderRepository.count({ where: { orderStatus: '已延期' } }),
      this.planRepository.count(),
      this.planRepository.count({ where: { planStatus: '已确认' } }),
      this.planRepository.count({ where: { planStatus: '待确认' } }),
      this.feedbackRepository.count(),
      this.feedbackRepository.count({ where: { feedbackStatus: '已完成' } }),
      this.feedbackRepository.count({ where: { feedbackStatus: '已延期' } }),
      this.getTodoStatistics(userId),
    ]);

    return {
      orders: {
        total: totalOrders,
        completed: completedOrders,
        inProgress: inProgressOrders,
        pending: pendingOrders,
        delayed: delayedOrders,
      },
      plans: {
        total: totalPlans,
        confirmed: confirmedPlans,
        pending: pendingPlans,
      },
      feedbacks: {
        total: totalFeedbacks,
        completed: completedFeedbacks,
        delayed: delayedFeedbacks,
      },
      todos: todoStats,
    };
  }

  async getTodoStatistics(userId?: number) {
    const queryBuilder = this.todoTaskRepository.createQueryBuilder('task');

    if (userId) {
      queryBuilder.where('task.assignee_id = :userId', { userId });
    }

    const [total, pending, processing, completed, highPriority] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TodoTaskStatus.PENDING }).getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TodoTaskStatus.PROCESSING }).getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TodoTaskStatus.COMPLETED }).getCount(),
      queryBuilder.clone()
        .andWhere('task.priority IN (:...priorities)', { priorities: ['high', 'urgent'] })
        .andWhere('task.status != :status', { status: TodoTaskStatus.COMPLETED })
        .getCount(),
    ]);

    return {
      total,
      pending,
      processing,
      completed,
      highPriority,
    };
  }

  async getOrderStatusDistribution() {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.orderStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.orderStatus')
      .getRawMany();

    return result.map(item => ({
      name: item.status || '未知',
      value: parseInt(item.count, 10),
    }));
  }

  async getFeedbackTrend(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('DATE(feedback.createTime)', 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CASE WHEN feedback.feedback_status = :completed THEN 1 ELSE 0 END)', 'completed')
      .addSelect('SUM(CASE WHEN feedback.feedback_status = :delayed THEN 1 ELSE 0 END)', 'delayed')
      .where('feedback.createTime >= :startDate', { startDate })
      .andWhere('feedback.createTime <= :endDate', { endDate })
      .setParameters({
        completed: '已完成',
        delayed: '已延期',
      })
      .groupBy('DATE(feedback.createTime)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map(item => ({
      date: item.date,
      total: parseInt(item.count, 10),
      completed: parseInt(item.completed, 10) || 0,
      delayed: parseInt(item.delayed, 10) || 0,
    }));
  }

  async getRecentAlerts(limit: number = 5) {
    const delayedFeedbacks = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.feedback_status = :status', { status: '已延期' })
      .orderBy('feedback.updateTime', 'DESC')
      .take(limit)
      .getMany();

    return delayedFeedbacks.map(feedback => ({
      id: feedback.id,
      alertType: '进度预警',
      alertContent: `物料 ${feedback.materialCode || feedback.id} 进度延期`,
      createTime: feedback.updateTime,
      status: 'unhandled',
    }));
  }

  async getRecentTodos(userId: number, limit: number = 5) {
    return this.todoTaskRepository
      .createQueryBuilder('task')
      .where('task.assignee_id = :userId', { userId })
      .andWhere('task.status != :status', { status: TodoTaskStatus.COMPLETED })
      .orderBy('task.created_at', 'DESC')
      .take(limit)
      .getMany();
  }

  async getDashboardData(userId?: number) {
    const [statistics, orderDistribution, feedbackTrend, recentAlerts, recentTodos] = await Promise.all([
      this.getStatistics(userId),
      this.getOrderStatusDistribution(),
      this.getFeedbackTrend(7),
      this.getRecentAlerts(5),
      userId ? this.getRecentTodos(userId, 5) : Promise.resolve([]),
    ]);

    return {
      statistics,
      orderDistribution,
      feedbackTrend,
      recentAlerts,
      recentTodos,
    };
  }
}
