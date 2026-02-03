import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendEmail(body: {
        to: string;
        subject: string;
        content: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    sendWechatMessage(body: {
        toUser: string;
        message: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    sendAlertNotification(body: {
        recipients: string[];
        alertType: string;
        alertContent: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    sendTaskNotification(body: {
        recipients: string[];
        taskType: string;
        taskContent: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    sendApprovalNotification(body: {
        recipients: string[];
        approvalType: string;
        approvalContent: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
