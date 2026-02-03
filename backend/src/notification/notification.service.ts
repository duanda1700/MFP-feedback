import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { NotificationRecord } from '../database/entities/notification-record.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationRecord) private notificationRecordRepository: Repository<NotificationRecord>,
  ) {}

  // 创建通知
  async createNotification(notificationData: {
    notificationType: number;
    notificationContent: string;
    receiverId: number;
    receiverType: string;
    createBy: number;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...notificationData,
      notificationStatus: 0, // 0: unread, 1: read
      sendTime: new Date(),
    });

    return this.notificationRepository.save(notification);
  }

  // 获取通知列表
  async getNotificationList(receiverId: number, query: any) {
    const {
      page = 1,
      pageSize = 10,
      notificationType,
      notificationStatus,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

    // 只查询当前用户的通知
    queryBuilder.andWhere('notification.receiver_id = :receiverId', { receiverId });

    if (notificationType) {
      queryBuilder.andWhere('notification.notification_type = :notificationType', { notificationType });
    }

    if (notificationStatus) {
      queryBuilder.andWhere('notification.notification_status = :notificationStatus', { notificationStatus });
    }

    if (startDate) {
      queryBuilder.andWhere('notification.create_time >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('notification.create_time <= :endDate', { endDate });
    }

    const [notifications, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('notification.create_time', 'DESC')
      .getManyAndCount();

    return {
      data: notifications,
      total,
      page,
      pageSize,
    };
  }

  // 获取未读通知数量
  async getUnreadCount(receiverId: number): Promise<number> {
    return this.notificationRepository.count({
      where: {
        receiverId,
        notificationStatus: 0, // 0: unread
      },
    });
  }

  // 标记通知为已读
  async markAsRead(id: number, receiverId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id,
        receiverId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.notificationStatus = 1; // 1: read
    notification.readTime = new Date();
    return this.notificationRepository.save(notification);
  }

  // 批量标记通知为已读
  async markMultipleAsRead(ids: number[], receiverId: number): Promise<number> {
    const result = await this.notificationRepository.update(
      {
        id: In(ids),
        receiverId,
        notificationStatus: 0, // 0: unread
      },
      {
        notificationStatus: 1, // 1: read
        readTime: new Date(),
      },
    );

    return result.affected || 0;
  }

  // 删除通知
  async deleteNotification(id: number, receiverId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id,
        receiverId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.notificationRepository.remove(notification);
  }

  // 批量删除通知
  async deleteMultipleNotifications(ids: number[], receiverId: number): Promise<number> {
    const result = await this.notificationRepository.delete({
      id: In(ids),
      receiverId,
    });

    return result.affected || 0;
  }

  // 发送预警通知
  async sendAlertNotification(receiverId: number, alertId: string, alertContent: string, createBy: number): Promise<Notification> {
    return this.createNotification({
      notificationType: 1, // 1: alert
      notificationContent: `您有一条新的预警通知: ${alertContent}`,
      receiverId,
      receiverType: 'user',
      createBy,
    });
  }

  // 发送审批通知
  async sendApprovalNotification(receiverId: number, approvalId: string, approvalContent: string, createBy: number): Promise<Notification> {
    return this.createNotification({
      notificationType: 2, // 2: approval
      notificationContent: `您有一条新的审批任务: ${approvalContent}`,
      receiverId,
      receiverType: 'user',
      createBy,
    });
  }

  // 发送任务通知
  async sendTaskNotification(receiverId: number, taskId: string, taskContent: string, createBy: number): Promise<Notification> {
    return this.createNotification({
      notificationType: 3, // 3: task
      notificationContent: `您有一条新的任务通知: ${taskContent}`,
      receiverId,
      receiverType: 'user',
      createBy,
    });
  }

  // 获取通知统计
  async getNotificationStats(receiverId: number): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
  }> {
    const total = await this.notificationRepository.count({ where: { receiverId } });
    const unread = await this.getUnreadCount(receiverId);

    // 按类型统计
    const alerts = await this.notificationRepository.count({ where: { receiverId, notificationType: 1 } }); // 1: alert
    const approvals = await this.notificationRepository.count({ where: { receiverId, notificationType: 2 } }); // 2: approval
    const tasks = await this.notificationRepository.count({ where: { receiverId, notificationType: 3 } }); // 3: task
    const others = total - alerts - approvals - tasks;

    return {
      total,
      unread,
      byType: {
        alert: alerts,
        approval: approvals,
        task: tasks,
        other: others,
      },
    };
  }

  // 创建通知记录
  async createNotificationRecord(recordData: {
    notificationType: string;
    deliveryChannel: string;
    recipient: string;
    recipientName?: string;
    subject: string;
    content?: string;
    linkUrl?: string;
    sendStatus: string;
    errorMessage?: string;
    relatedId?: string;
    relatedType?: string;
    templateId?: number;
    sentAt?: Date;
  }): Promise<NotificationRecord> {
    const record = this.notificationRecordRepository.create({
      ...recordData,
      createTime: new Date(),
      updateTime: new Date(),
    });

    return this.notificationRecordRepository.save(record);
  }

  // 获取通知记录列表
  async getNotificationRecords(query: any) {
    const {
      page = 1,
      pageSize = 10,
      notificationType,
      deliveryChannel,
      sendStatus,
      recipient,
      relatedId,
      relatedType,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.notificationRecordRepository.createQueryBuilder('record');

    if (notificationType) {
      queryBuilder.andWhere('record.notification_type = :notificationType', { notificationType });
    }

    if (deliveryChannel) {
      queryBuilder.andWhere('record.delivery_channel = :deliveryChannel', { deliveryChannel });
    }

    if (sendStatus) {
      queryBuilder.andWhere('record.send_status = :sendStatus', { sendStatus });
    }

    if (recipient) {
      queryBuilder.andWhere('record.recipient LIKE :recipient', { recipient: `%${recipient}%` });
    }

    if (relatedId) {
      queryBuilder.andWhere('record.related_id = :relatedId', { relatedId });
    }

    if (relatedType) {
      queryBuilder.andWhere('record.related_type = :relatedType', { relatedType });
    }

    if (startDate) {
      queryBuilder.andWhere('record.create_time >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('record.create_time <= :endDate', { endDate });
    }

    const [records, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('record.create_time', 'DESC')
      .getManyAndCount();

    return {
      data: records,
      total,
      page,
      pageSize,
    };
  }

  // 更新通知记录状态
  async updateNotificationRecordStatus(id: number, status: string, errorMessage?: string): Promise<NotificationRecord> {
    const record = await this.notificationRecordRepository.findOne({ where: { id } });

    if (!record) {
      throw new Error('Notification record not found');
    }

    record.sendStatus = status;
    if (errorMessage) {
      record.errorMessage = errorMessage;
    }
    if (status === 'sent') {
      record.sentAt = new Date();
    }
    record.updateTime = new Date();

    return this.notificationRecordRepository.save(record);
  }

  // 获取通知发送统计
  async getNotificationRecordStats(query: any = {}): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byChannel: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const { startDate, endDate } = query;

    const queryBuilder = this.notificationRecordRepository.createQueryBuilder('record');

    if (startDate) {
      queryBuilder.andWhere('record.create_time >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('record.create_time <= :endDate', { endDate });
    }

    const total = await queryBuilder.getCount();

    // 按状态统计
    const sent = await queryBuilder.clone().andWhere('record.send_status = :status', { status: 'sent' }).getCount();
    const failed = await queryBuilder.clone().andWhere('record.send_status = :status', { status: 'failed' }).getCount();
    const pending = await queryBuilder.clone().andWhere('record.send_status = :status', { status: 'pending' }).getCount();

    // 按渠道统计
    const email = await queryBuilder.clone().andWhere('record.delivery_channel = :channel', { channel: 'email' }).getCount();
    const wechat = await queryBuilder.clone().andWhere('record.delivery_channel = :channel', { channel: 'wechat' }).getCount();
    const inapp = await queryBuilder.clone().andWhere('record.delivery_channel = :channel', { channel: 'inapp' }).getCount();

    // 按类型统计
    const alert = await queryBuilder.clone().andWhere('record.notification_type = :type', { type: 'alert' }).getCount();
    const approval = await queryBuilder.clone().andWhere('record.notification_type = :type', { type: 'approval' }).getCount();
    const task = await queryBuilder.clone().andWhere('record.notification_type = :type', { type: 'task' }).getCount();
    const other = total - alert - approval - task;

    return {
      total,
      byStatus: {
        sent,
        failed,
        pending,
      },
      byChannel: {
        email,
        wechat,
        inapp,
      },
      byType: {
        alert,
        approval,
        task,
        other,
      },
    };
  }

  // 获取单个通知记录
  async getNotificationRecord(id: number): Promise<NotificationRecord> {
    const record = await this.notificationRecordRepository.findOne({ where: { id } });

    if (!record) {
      throw new Error('Notification record not found');
    }

    return record;
  }
}
