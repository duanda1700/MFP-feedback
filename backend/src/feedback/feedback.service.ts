import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackData } from '../database/entities/feedback-data.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackData) private feedbackRepository: Repository<FeedbackData>,
  ) {}

  // 获取反馈列表
  async getFeedbackList(query: any) {
    const {
      page = 1,
      pageSize = 10,
      feedbackStatus,
      orderId,
      planId,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.feedbackRepository.createQueryBuilder('feedback');

    if (feedbackStatus) {
      queryBuilder.andWhere('feedback.feedback_status = :feedbackStatus', { feedbackStatus });
    }

    if (orderId) {
      queryBuilder.andWhere('feedback.order_id = :orderId', { orderId });
    }

    if (planId) {
      queryBuilder.andWhere('feedback.plan_id = :planId', { planId });
    }

    if (startDate) {
      queryBuilder.andWhere('feedback.feedback_time >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('feedback.feedback_time <= :endDate', { endDate });
    }

    const [feedbacks, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('feedback.feedback_time', 'DESC')
      .getManyAndCount();

    return {
      data: feedbacks,
      total,
      page,
      pageSize,
    };
  }

  // 获取反馈详情
  async getFeedbackDetail(id: number) {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  // 提交反馈
  async submitFeedback(feedbackData: any) {
    const feedback = this.feedbackRepository.create({
      ...feedbackData,
      feedbackTime: new Date(),
      feedbackStatus: 1, // 1: 已提交
    });

    const savedFeedback = await this.feedbackRepository.save(feedback);

    // 这里应该实现数据实时回传逻辑
    // 暂时模拟回传
    this.realTimeSync(savedFeedback);

    return savedFeedback;
  }

  // 更新反馈状态
  async updateFeedbackStatus(id: number, status: number) {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    feedback.feedbackStatus = status;
    return this.feedbackRepository.save(feedback);
  }

  // 更新反馈信息（仅可补充备注，不可逆向修改）
  async updateFeedback(id: number, feedbackData: any) {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    // 只允许更新备注，不可修改其他字段
    if (feedbackData.remarks) {
      feedback.remarks = feedbackData.remarks;
    }

    return this.feedbackRepository.save(feedback);
  }

  // 订单状态判断
  async checkOrderStatus(orderId: number) {
    // 这里应该实现订单状态判断逻辑
    // 暂时返回模拟数据
    return {
      orderId,
      status: '进行中',
      canSubmitFeedback: true,
    };
  }

  // 可编辑范围判断
  async checkEditableRange(feedbackId: number, userId: number) {
    const feedback = await this.feedbackRepository.findOne({ where: { id: feedbackId } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    // 这里应该实现可编辑范围判断逻辑
    // 暂时返回模拟数据
    return {
      feedbackId,
      userId,
      canEdit: true,
      editableFields: ['remarks'],
    };
  }

  // 采购端监控
  async getPurchaseMonitoring() {
    // 这里应该实现采购端监控逻辑
    // 暂时返回模拟数据
    return {
      totalFeedbacks: 100,
      pendingFeedbacks: 20,
      overdueFeedbacks: 5,
      trend: [10, 15, 12, 18, 20],
    };
  }

  // 数据实时回传
  async realTimeSync(feedback: any) {
    // 模拟数据回传，实际应该调用 ERP 系统接口
    setTimeout(() => {
      console.log('Feedback synchronized to ERP:', feedback.id);
    }, 1000); // 模拟延迟
  }

  // 删除反馈
  async deleteFeedback(id: number) {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return this.feedbackRepository.remove(feedback);
  }
}
