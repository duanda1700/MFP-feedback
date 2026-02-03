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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_template_entity_1 = require("../database/entities/notification-template.entity");
let NotificationTemplateService = NotificationTemplateService_1 = class NotificationTemplateService {
    templateRepository;
    logger = new common_1.Logger(NotificationTemplateService_1.name);
    constructor(templateRepository) {
        this.templateRepository = templateRepository;
    }
    async createTemplate(templateData) {
        if (templateData.isDefault) {
            await this.templateRepository.update({ templateType: templateData.templateType, isDefault: true }, { isDefault: false });
        }
        const template = this.templateRepository.create({
            ...templateData,
            status: 'active',
        });
        return this.templateRepository.save(template);
    }
    async getTemplateList(query) {
        const { page = 1, pageSize = 10, templateType, status, isDefault, } = query;
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
    async getTemplateDetail(id) {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) {
            throw new Error('Template not found');
        }
        return template;
    }
    async getDefaultTemplate(templateType) {
        return this.templateRepository.findOne({
            where: { templateType, isDefault: true, status: 'active' },
        });
    }
    async updateTemplate(id, templateData) {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) {
            throw new Error('Template not found');
        }
        if (templateData.isDefault) {
            await this.templateRepository.update({ templateType: template.templateType, isDefault: true }, { isDefault: false });
        }
        Object.assign(template, {
            ...templateData,
            updatedBy: templateData.updatedBy,
            updatedName: templateData.updatedName,
        });
        return this.templateRepository.save(template);
    }
    async deleteTemplate(id) {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) {
            throw new Error('Template not found');
        }
        return this.templateRepository.remove(template);
    }
    async renderTemplate(templateId, variables) {
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
    render(template, variables) {
        return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
            const value = variables[key.trim()];
            return value !== undefined ? value : match;
        });
    }
    async toggleTemplateStatus(id, status) {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) {
            throw new Error('Template not found');
        }
        template.status = status;
        return this.templateRepository.save(template);
    }
    async initializeDefaultTemplates() {
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
};
exports.NotificationTemplateService = NotificationTemplateService;
exports.NotificationTemplateService = NotificationTemplateService = NotificationTemplateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_template_entity_1.NotificationTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationTemplateService);
function Not(value) {
    return { $ne: value };
}
//# sourceMappingURL=notification-template.service.js.map