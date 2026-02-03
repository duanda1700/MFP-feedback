import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('api/integration/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email')
  async sendEmail(@Body() body: { to: string; subject: string; content: string }) {
    return this.notificationService.sendEmail(body.to, body.subject, body.content);
  }

  @Post('wechat')
  async sendWechatMessage(@Body() body: { toUser: string; message: string }) {
    return this.notificationService.sendWechatMessage(body.toUser, body.message);
  }

  @Post('alert')
  async sendAlertNotification(@Body() body: { recipients: string[]; alertType: string; alertContent: string }) {
    await this.notificationService.sendAlertNotification(body.recipients, body.alertType, body.alertContent);
    return { success: true, message: '预警通知发送成功' };
  }

  @Post('task')
  async sendTaskNotification(@Body() body: { recipients: string[]; taskType: string; taskContent: string }) {
    await this.notificationService.sendTaskNotification(body.recipients, body.taskType, body.taskContent);
    return { success: true, message: '任务通知发送成功' };
  }

  @Post('approval')
  async sendApprovalNotification(@Body() body: { recipients: string[]; approvalType: string; approvalContent: string }) {
    await this.notificationService.sendApprovalNotification(body.recipients, body.approvalType, body.approvalContent);
    return { success: true, message: '审批通知发送成功' };
  }
}
