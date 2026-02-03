"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require('nodemailer');
const axios_1 = __importDefault(require("axios"));
const notification_service_1 = require("../../notification/notification.service");
let NotificationService = NotificationService_1 = class NotificationService {
    coreNotificationService;
    logger = new common_1.Logger(NotificationService_1.name);
    emailTransporter;
    wechatApiUrl = 'https://qyapi.weixin.qq.com/cgi-bin';
    wechatCorpId = 'your_corp_id';
    wechatAppSecret = 'your_app_secret';
    wechatAgentId = '1000001';
    constructor(coreNotificationService) {
        this.coreNotificationService = coreNotificationService;
    }
    async sendEmail(to, subject, content, notificationType = 'other', relatedId, relatedType) {
        try {
            this.logger.log(`开始发送邮件到: ${to}`);
            this.logger.log(`邮件发送成功（模拟）`);
            await this.coreNotificationService.createNotificationRecord({
                notificationType,
                deliveryChannel: 'email',
                recipient: to,
                subject,
                content,
                sendStatus: 'sent',
                relatedId,
                relatedType,
                sentAt: new Date(),
            });
            return { success: true, message: '邮件发送成功' };
        }
        catch (error) {
            this.logger.error('邮件发送失败', error);
            await this.coreNotificationService.createNotificationRecord({
                notificationType,
                deliveryChannel: 'email',
                recipient: to,
                subject,
                content,
                sendStatus: 'failed',
                errorMessage: error.message,
                relatedId,
                relatedType,
            });
            return { success: false, message: `邮件发送失败: ${error.message}` };
        }
    }
    async sendWechatMessage(toUser, message, notificationType = 'other', relatedId, relatedType) {
        try {
            this.logger.log(`开始发送企业微信消息到: ${toUser}`);
            const accessToken = await this.getWechatAccessToken();
            const response = await axios_1.default.post(`${this.wechatApiUrl}/message/send?access_token=${accessToken}`, {
                touser: toUser,
                agentid: this.wechatAgentId,
                msgtype: 'text',
                text: {
                    content: message,
                },
                safe: 0,
            });
            if (response.data.errcode === 0) {
                this.logger.log('企业微信消息发送成功');
                await this.coreNotificationService.createNotificationRecord({
                    notificationType,
                    deliveryChannel: 'wechat',
                    recipient: toUser,
                    subject: message.substring(0, 50),
                    content: message,
                    sendStatus: 'sent',
                    relatedId,
                    relatedType,
                    sentAt: new Date(),
                });
                return { success: true, message: '企业微信消息发送成功' };
            }
            else {
                this.logger.error(`企业微信消息发送失败: ${response.data.errmsg}`);
                await this.coreNotificationService.createNotificationRecord({
                    notificationType,
                    deliveryChannel: 'wechat',
                    recipient: toUser,
                    subject: message.substring(0, 50),
                    content: message,
                    sendStatus: 'failed',
                    errorMessage: response.data.errmsg,
                    relatedId,
                    relatedType,
                });
                return { success: false, message: `企业微信消息发送失败: ${response.data.errmsg}` };
            }
        }
        catch (error) {
            this.logger.error('企业微信消息发送失败', error);
            await this.coreNotificationService.createNotificationRecord({
                notificationType,
                deliveryChannel: 'wechat',
                recipient: toUser,
                subject: message.substring(0, 50),
                content: message,
                sendStatus: 'failed',
                errorMessage: error.message,
                relatedId,
                relatedType,
            });
            return { success: false, message: `企业微信消息发送失败: ${error.message}` };
        }
    }
    async getWechatAccessToken() {
        const response = await axios_1.default.get(`${this.wechatApiUrl}/gettoken`, {
            params: {
                corpid: this.wechatCorpId,
                corpsecret: this.wechatAppSecret,
            },
        });
        if (response.data.errcode === 0) {
            return response.data.access_token;
        }
        else {
            throw new Error(`获取企业微信访问令牌失败: ${response.data.errmsg}`);
        }
    }
    async sendAlertNotification(recipients, alertType, alertContent, relatedId) {
        const subject = `【预警通知】${alertType}`;
        const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${subject}</h2>
        <p>预警内容：</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #ffc107;">
          ${alertContent}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">此邮件由 MFP-Feedback 系统自动发送，请勿直接回复。</p>
      </div>
    `;
        const wechatMessage = `${subject}\n\n预警内容：\n${alertContent}\n\n此消息由 MFP-Feedback 系统自动发送`;
        for (const recipient of recipients) {
            if (recipient.includes('@')) {
                await this.sendEmail(recipient, subject, emailContent, 'alert', relatedId, 'alert');
            }
            else {
                await this.sendWechatMessage(recipient, wechatMessage, 'alert', relatedId, 'alert');
            }
        }
    }
    async sendTaskNotification(recipients, taskType, taskContent, relatedId) {
        const subject = `【任务通知】${taskType}`;
        const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${subject}</h2>
        <p>任务内容：</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #17a2b8;">
          ${taskContent}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">此邮件由 MFP-Feedback 系统自动发送，请勿直接回复。</p>
      </div>
    `;
        const wechatMessage = `${subject}\n\n任务内容：\n${taskContent}\n\n此消息由 MFP-Feedback 系统自动发送`;
        for (const recipient of recipients) {
            if (recipient.includes('@')) {
                await this.sendEmail(recipient, subject, emailContent, 'task', relatedId, 'task');
            }
            else {
                await this.sendWechatMessage(recipient, wechatMessage, 'task', relatedId, 'task');
            }
        }
    }
    async sendApprovalNotification(recipients, approvalType, approvalContent, relatedId) {
        const subject = `【审批通知】${approvalType}`;
        const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${subject}</h2>
        <p>审批内容：</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745;">
          ${approvalContent}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">此邮件由 MFP-Feedback 系统自动发送，请勿直接回复。</p>
      </div>
    `;
        const wechatMessage = `${subject}\n\n审批内容：\n${approvalContent}\n\n此消息由 MFP-Feedback 系统自动发送`;
        for (const recipient of recipients) {
            if (recipient.includes('@')) {
                await this.sendEmail(recipient, subject, emailContent, 'approval', relatedId, 'approval');
            }
            else {
                await this.sendWechatMessage(recipient, wechatMessage, 'approval', relatedId, 'approval');
            }
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map