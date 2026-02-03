import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotificationList(receiverId: number, query: any): Promise<{
        data: import("../database/entities/notification.entity").Notification[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getUnreadCount(receiverId: number): Promise<number>;
    markAsRead(id: number, receiverId: number): Promise<import("../database/entities/notification.entity").Notification>;
    markMultipleAsRead(body: {
        ids: number[];
        receiverId: number;
    }): Promise<number>;
    deleteNotification(id: number, receiverId: number): Promise<import("../database/entities/notification.entity").Notification>;
    deleteMultipleNotifications(body: {
        ids: number[];
        receiverId: number;
    }): Promise<number>;
    createNotification(body: {
        notificationType: number;
        notificationContent: string;
        receiverId: number;
        receiverType: string;
        createBy: number;
    }): Promise<import("../database/entities/notification.entity").Notification>;
    getNotificationStats(receiverId: number): Promise<{
        total: number;
        unread: number;
        byType: Record<string, number>;
    }>;
    sendAlertNotification(body: {
        receiverId: number;
        alertId: string;
        alertContent: string;
        createBy: number;
    }): Promise<import("../database/entities/notification.entity").Notification>;
    sendApprovalNotification(body: {
        receiverId: number;
        approvalId: string;
        approvalContent: string;
        createBy: number;
    }): Promise<import("../database/entities/notification.entity").Notification>;
    sendTaskNotification(body: {
        receiverId: number;
        taskId: string;
        taskContent: string;
        createBy: number;
    }): Promise<import("../database/entities/notification.entity").Notification>;
    getNotificationRecords(query: any): Promise<{
        data: import("../database/entities/notification-record.entity").NotificationRecord[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getNotificationRecord(id: number): Promise<import("../database/entities/notification-record.entity").NotificationRecord>;
    createNotificationRecord(body: {
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
    }): Promise<import("../database/entities/notification-record.entity").NotificationRecord>;
    updateNotificationRecordStatus(id: number, body: {
        status: string;
        errorMessage?: string;
    }): Promise<import("../database/entities/notification-record.entity").NotificationRecord>;
    getNotificationRecordStats(query: any): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byChannel: Record<string, number>;
        byType: Record<string, number>;
    }>;
}
