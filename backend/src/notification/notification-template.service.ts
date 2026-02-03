import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTemplate } from '../database/entities/notification-template.entity';

@Injectable()
export class NotificationTemplateService {
  private readonly logger = new Logger(NotificationTemplateService.name);

  constructor(
    @InjectRepository(NotificationTemplate) private templateRepository: Repository<NotificationTemplate>,
  ) {}

  // 创建通知模板
  async createTemplate(templateData: {
    templateName: string;
    templateType: string;
    subjectTemplate: string;
    contentTemplate: string;
    linkTemplate?: string;
    isDefault?: boolean;
    createdBy: number;
    createdName: string;
  }): Promise<NotificationTemplate> {
    // 如果设置为默认模板，先将其他同类型模板设置为非默认
    if (templateData.isDefault) {
      await this.templateRepository.update(
        { templateType: templateData.templateType, isDefault: true },
        { isDefault: false },
      );
    }

    const template = this.templateRepository.create({
      ...templateData,
      status: 'active',
    });

    return this.templateRepository.save(template);
  }

  // 获取通知模板列表
  async getTemplateList(query: any) {
    const {
      page = 1,
      pageSize = 10,
      templateType,
      status,
      isDefault,
    } = query;

    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    if (templateType) {
      queryBuilder.andWhere('template.template_type = :templateType', { templateType });
    }

    if (status) {
      queryBuilder.andWhere('template.status = :status', { status });
    }

    if (isDefault !== undefined) {
      queryBuilder.andWhere('template.is_default = :isDefault', { isDefault });
    }

    const [templates, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('template.create_time', 'DESC')
      .getManyAndCount();

    return {
      data: templates,
      total,
      page,
      pageSize,
    };
  }

  // 获取通知模板详情
  async getTemplateDetail(id: number): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  // 获取默认模板
  async getDefaultTemplate(templateType: string): Promise<NotificationTemplate | null> {
    return this.templateRepository.findOne({
      where: { templateType, isDefault: true, status: 'active' },
    });
  }

  // 更新通知模板
  async updateTemplate(id: number, templateData: {
    templateName?: string;
    subjectTemplate?: string;
    contentTemplate?: string;
    linkTemplate?: string;
    isDefault?: boolean;
    status?: string;
    updatedBy: number;
    updatedName: string;
  }): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new Error('Template not found');
    }

    // 如果设置为默认模板，先将其他同类型模板设置为非默认
    if (templateData.isDefault) {
      await this.templateRepository.update(
        { templateType: template.templateType, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(template, {
      ...templateData,
      updatedBy: templateData.updatedBy,
      updatedName: templateData.updatedName,
    });

    return this.templateRepository.save(template);
  }

  // 删除通知模板
  async deleteTemplate(id: number): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new Error('Template not found');
    }

    return this.templateRepository.remove(template);
  }

  // 渲染通知模板
  async renderTemplate(templateId: number, variables: Record<string, any>): Promise<{
    subject: string;
    content: string;
    link?: string;
  }> {
    const template = await this.templateRepository.findOne({ where: { id: templateId } });
    if (!template) {
      throw new Error('Template not found');
    }

    return {
      subject: this.render(template.subjectTemplate, variables),
      content: this.render(template.contentTemplate, variables),
      link: template.linkTemplate ? this.render(template.linkTemplate, variables) : undefined,
    };
  }

  // 渲染模板字符串
  private render(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = variables[key.trim()];
      return value !== undefined ? value : match;
    });
  }

  // 激活/停用模板
  async toggleTemplateStatus(id: number, status: string): Promise<NotificationTemplate> {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) {
      throw new Error('Template not found');
    }

    template.status = status;
    return this.templateRepository.save(template);
  }

  // 初始化默认模板
  async initializeDefaultTemplates(): Promise<void> {
    const defaultTemplates = [
      {
        templateName: '默认预警通知模板',
        templateType: 'alert',
        subjectTemplate: '【预警通知】{{alertType}}',
        contentTemplate: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>【预警通知】{{alertType}}</h2>
            <p>预警内容：</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #ffc107;">
              {{alertContent}}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">此邮件由 MFP-Feedback 系统自动发送，请勿直接回复。</p>
          </div>
        `,
        linkTemplate: '/alert/detail/{{alertId}}',
        isDefault: true,
      },
      {
        templateName: '默认审批通知模板',
        templateType: 'approval',
        subjectTemplate: '【审批通知】{{approvalType}}',
        contentTemplate: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>【审批通知】{{approvalType}}</h2>
            <p>审批内容：</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745;">
              {{approvalContent}}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">此邮件由 MFP-Feedback 系统自动发送，请勿直接回复。</p>
          </div>
        `,
        linkTemplate: '/approval/detail/{{approvalId}}',
        isDefault: true,
      },
      {
        templateName: '默认任务通知模板',
        templateType: 'task',
        subjectTemplate: '【任务通知】{{taskType}}',
        contentTemplate: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>【任务通知】{{taskType}}</h2>
            <p>任务内容：</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #17a2b8;">
              {{taskContent}}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">此邮件由 MFP-Feedback 系统自动发送，请勿直接回复。</p>
          </div>
        `,
        linkTemplate: '/task/detail/{{taskId}}',
        isDefault: true,
      },
    ];

    for (const templateData of defaultTemplates) {
      const existingTemplate = await this.templateRepository.findOne({
        where: { templateType: templateData.templateType, isDefault: true },
      });

      if (!existingTemplate) {
        await this.templateRepository.create({
          ...templateData,
          status: 'active',
          createdBy: 1,
          createdName: 'System',
        });
      }
    }
  }
}

// 辅助函数：Not操作符
function Not(value: any) {
  return { $ne: value };
}
