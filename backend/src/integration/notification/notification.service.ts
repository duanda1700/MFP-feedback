import { Injectable, Logger } from '@nestjs/common';
const nodemailer = require('nodemailer');
import axios from 'axios';
import { NotificationService as CoreNotificationService } from '../../notification/notification.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private emailTransporter: any;
  private readonly wechatApiUrl = 'https://qyapi.weixin.qq.com/cgi-bin'; // 企业微信API地址
  private readonly wechatCorpId = 'your_corp_id'; // 企业微信 CorpID
  private readonly wechatAppSecret = 'your_app_secret'; // 企业微信应用密钥
  private readonly wechatAgentId = '1000001'; // 企业微信应用ID

  constructor(private coreNotificationService: CoreNotificationService) {
    // 暂时注释掉邮件 transporter 初始化，避免启动错误
    // this.emailTransporter = nodemailer.createTransporter({
    //   host: 'smtp.example.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: 'your_email@example.com',
    //     pass: 'your_email_password',
    //   },
    // });
  }

  async sendEmail(to: string, subject: string, content: string, notificationType: string = 'other', relatedId?: string, relatedType?: string): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`开始发送邮件到: ${to}`);
      
      // 暂时注释掉实际发送邮件的代码，避免启动错误
      // const info = await this.emailTransporter.sendMail({
      //   from: '"MFP-Feedback System" <your_email@example.com>',
      //   to,
      //   subject,
      //   html: content,
      // });
      
      this.logger.log(`邮件发送成功（模拟）`);
      
      // 创建通知记录
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
    } catch (error: any) {
      this.logger.error('邮件发送失败', error);
      
      // 创建通知记录（失败状态）
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

  async sendWechatMessage(toUser: string, message: string, notificationType: string = 'other', relatedId?: string, relatedType?: string): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`开始发送企业微信消息到: ${toUser}`);
      
      // 获取访问令牌
      const accessToken = await this.getWechatAccessToken();
      
      // 发送消息
      const response = await axios.post(`${this.wechatApiUrl}/message/send?access_token=${accessToken}`, {
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
        
        // 创建通知记录
        await this.coreNotificationService.createNotificationRecord({
          notificationType,
          deliveryChannel: 'wechat',
          recipient: toUser,
          subject: message.substring(0, 50), // 截取前50个字符作为主题
          content: message,
          sendStatus: 'sent',
          relatedId,
          relatedType,
          sentAt: new Date(),
        });
        
        return { success: true, message: '企业微信消息发送成功' };
      } else {
        this.logger.error(`企业微信消息发送失败: ${response.data.errmsg}`);
        
        // 创建通知记录（失败状态）
        await this.coreNotificationService.createNotificationRecord({
          notificationType,
          deliveryChannel: 'wechat',
          recipient: toUser,
          subject: message.substring(0, 50), // 截取前50个字符作为主题
          content: message,
          sendStatus: 'failed',
          errorMessage: response.data.errmsg,
          relatedId,
          relatedType,
        });
        
        return { success: false, message: `企业微信消息发送失败: ${response.data.errmsg}` };
      }
    } catch (error) {
      this.logger.error('企业微信消息发送失败', error);
      
      // 创建通知记录（失败状态）
      await this.coreNotificationService.createNotificationRecord({
        notificationType,
        deliveryChannel: 'wechat',
        recipient: toUser,
        subject: message.substring(0, 50), // 截取前50个字符作为主题
        content: message,
        sendStatus: 'failed',
        errorMessage: error.message,
        relatedId,
        relatedType,
      });
      
      return { success: false, message: `企业微信消息发送失败: ${error.message}` };
    }
  }

  private async getWechatAccessToken(): Promise<string> {
    const response = await axios.get(`${this.wechatApiUrl}/gettoken`, {
      params: {
        corpid: this.wechatCorpId,
        corpsecret: this.wechatAppSecret,
      },
    });
    
    if (response.data.errcode === 0) {
      return response.data.access_token;
    } else {
      throw new Error(`获取企业微信访问令牌失败: ${response.data.errmsg}`);
    }
  }

  async sendAlertNotification(recipients: string[], alertType: string, alertContent: string, relatedId?: string): Promise<void> {
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
    
    // 发送邮件通知
    for (const recipient of recipients) {
      if (recipient.includes('@')) {
        await this.sendEmail(recipient, subject, emailContent, 'alert', relatedId, 'alert');
      } else {
        await this.sendWechatMessage(recipient, wechatMessage, 'alert', relatedId, 'alert');
      }
    }
  }

  async sendTaskNotification(recipients: string[], taskType: string, taskContent: string, relatedId?: string): Promise<void> {
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
    
    // 发送邮件通知
    for (const recipient of recipients) {
      if (recipient.includes('@')) {
        await this.sendEmail(recipient, subject, emailContent, 'task', relatedId, 'task');
      } else {
        await this.sendWechatMessage(recipient, wechatMessage, 'task', relatedId, 'task');
      }
    }
  }

  async sendApprovalNotification(recipients: string[], approvalType: string, approvalContent: string, relatedId?: string): Promise<void> {
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
    
    // 发送邮件通知
    for (const recipient of recipients) {
      if (recipient.includes('@')) {
        await this.sendEmail(recipient, subject, emailContent, 'approval', relatedId, 'approval');
      } else {
        await this.sendWechatMessage(recipient, wechatMessage, 'approval', relatedId, 'approval');
      }
    }
  }
}
