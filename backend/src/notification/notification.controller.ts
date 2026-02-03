import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { RequirePermission } from '../permission/guards/permission.guard';

@Controller('api/notification')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('list')
  @RequirePermission('notification:read')
  async getNotificationList(
    @Query('receiverId') receiverId: number,
    @Query() query: any,
  ) {
    return this.notificationService.getNotificationList(receiverId, query);
  }

  @Get('unread-count')
  @RequirePermission('notification:read')
  async getUnreadCount(@Query('receiverId') receiverId: number) {
    return this.notificationService.getUnreadCount(receiverId);
  }

  @Post('mark-as-read/:id')
  @RequirePermission('notification:update')
  async markAsRead(
    @Param('id') id: number,
    @Body('receiverId') receiverId: number,
  ) {
    return this.notificationService.markAsRead(id, receiverId);
  }

  @Post('mark-multiple-as-read')
  @RequirePermission('notification:update')
  async markMultipleAsRead(@Body() body: { ids: number[]; receiverId: number }) {
    return this.notificationService.markMultipleAsRead(body.ids, body.receiverId);
  }

  @Post('delete/:id')
  @RequirePermission('notification:delete')
  async deleteNotification(
    @Param('id') id: number,
    @Body('receiverId') receiverId: number,
  ) {
    return this.notificationService.deleteNotification(id, receiverId);
  }

  @Post('delete-multiple')
  @RequirePermission('notification:delete')
  async deleteMultipleNotifications(@Body() body: { ids: number[]; receiverId: number }) {
    return this.notificationService.deleteMultipleNotifications(body.ids, body.receiverId);
  }

  @Post('create')
  @RequirePermission('notification:create')
  async createNotification(@Body() body: {
    notificationType: number;
    notificationContent: string;
    receiverId: number;
    receiverType: string;
    createBy: number;
  }) {
    return this.notificationService.createNotification(body);
  }

  @Get('stats')
  @RequirePermission('notification:read')
  async getNotificationStats(@Query('receiverId') receiverId: number) {
    return this.notificationService.getNotificationStats(receiverId);
  }

  @Post('send-alert')
  @RequirePermission('notification:create')
  async sendAlertNotification(@Body() body: {
    receiverId: number;
    alertId: string;
    alertContent: string;
    createBy: number;
  }) {
    return this.notificationService.sendAlertNotification(
      body.receiverId,
      body.alertId,
      body.alertContent,
      body.createBy,
    );
  }

  @Post('send-approval')
  @RequirePermission('notification:create')
  async sendApprovalNotification(@Body() body: {
    receiverId: number;
    approvalId: string;
    approvalContent: string;
    createBy: number;
  }) {
    return this.notificationService.sendApprovalNotification(
      body.receiverId,
      body.approvalId,
      body.approvalContent,
      body.createBy,
    );
  }

  @Post('send-task')
  @RequirePermission('notification:create')
  async sendTaskNotification(@Body() body: {
    receiverId: number;
    taskId: string;
    taskContent: string;
    createBy: number;
  }) {
    return this.notificationService.sendTaskNotification(
      body.receiverId,
      body.taskId,
      body.taskContent,
      body.createBy,
    );
  }

  // 通知记录相关接口
  @Get('records')
  @RequirePermission('notification:read')
  async getNotificationRecords(@Query() query: any) {
    return this.notificationService.getNotificationRecords(query);
  }

  @Get('records/:id')
  @RequirePermission('notification:read')
  async getNotificationRecord(@Param('id') id: number) {
    return this.notificationService.getNotificationRecord(id);
  }

  @Post('records/create')
  @RequirePermission('notification:create')
  async createNotificationRecord(@Body() body: {
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
  }) {
    return this.notificationService.createNotificationRecord(body);
  }

  @Post('records/:id/update-status')
  @RequirePermission('notification:update')
  async updateNotificationRecordStatus(@Param('id') id: number, @Body() body: {
    status: string;
    errorMessage?: string;
  }) {
    return this.notificationService.updateNotificationRecordStatus(id, body.status, body.errorMessage);
  }

  @Get('records/stats')
  @RequirePermission('notification:read')
  async getNotificationRecordStats(@Query() query: any) {
    return this.notificationService.getNotificationRecordStats(query);
  }
}
