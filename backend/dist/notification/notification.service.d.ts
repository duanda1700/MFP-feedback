import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { NotificationRecord } from '../database/entities/notification-record.entity';
export declare class NotificationService {
    private notificationRepository;
    private notificationRecordRepository;
    private readonly logger;
    constructor(notificationRepository: Repository<Notification>, notificationRecordRepository: Repository<NotificationRecord>);
    createNotification(notificationData: {
        notificationType: number;
        notificationContent: string;
        receiverId: number;
        receiverType: string;
        createBy: number;
    }): Promise<Notification>;
    getNotificationList(receiverId: number, query: any): Promise<{
        data: Notification[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getUnreadCount(receiverId: number): Promise<number>;
    markAsRead(id: number, receiverId: number): Promise<Notification>;
    markMultipleAsRead(ids: number[], receiverId: number): Promise<number>;
    deleteNotification(id: number, receiverId: number): Promise<Notification>;
    deleteMultipleNotifications(ids: number[], receiverId: number): Promise<number>;
    sendAlertNotification(receiverId: number, alertId: string, alertContent: string, createBy: number): Promise<Notification>;
    sendApprovalNotification(receiverId: number, approvalId: string, approvalContent: string, createBy: number): Promise<Notification>;
    sendTaskNotification(receiverId: number, taskId: string, taskContent: string, createBy: number): Promise<Notification>;
    getNotificationStats(receiverId: number): Promise<{
        total: number;
        unread: number;
        byType: Record<string, number>;
    }>;
    createNotificationRecord(recordData: {
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
    }): Promise<NotificationRecord>;
    getNotificationRecords(query: any): Promise<{
        data: NotificationRecord[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    updateNotificationRecordStatus(id: number, status: string, errorMessage?: string): Promise<NotificationRecord>;
    getNotificationRecordStats(query?: any): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byChannel: Record<string, number>;
        byType: Record<string, number>;
    }>;
    getNotificationRecord(id: number): Promise<NotificationRecord>;
}
