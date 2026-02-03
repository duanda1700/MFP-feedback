import { NotificationService as CoreNotificationService } from '../../notification/notification.service';
export declare class NotificationService {
    private coreNotificationService;
    private readonly logger;
    private emailTransporter;
    private readonly wechatApiUrl;
    private readonly wechatCorpId;
    private readonly wechatAppSecret;
    private readonly wechatAgentId;
    constructor(coreNotificationService: CoreNotificationService);
    sendEmail(to: string, subject: string, content: string, notificationType?: string, relatedId?: string, relatedType?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendWechatMessage(toUser: string, message: string, notificationType?: string, relatedId?: string, relatedType?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private getWechatAccessToken;
    sendAlertNotification(recipients: string[], alertType: string, alertContent: string, relatedId?: string): Promise<void>;
    sendTaskNotification(recipients: string[], taskType: string, taskContent: string, relatedId?: string): Promise<void>;
    sendApprovalNotification(recipients: string[], approvalType: string, approvalContent: string, relatedId?: string): Promise<void>;
}
