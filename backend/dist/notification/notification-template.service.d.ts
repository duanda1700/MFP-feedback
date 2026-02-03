import { Repository } from 'typeorm';
import { NotificationTemplate } from '../database/entities/notification-template.entity';
export declare class NotificationTemplateService {
    private templateRepository;
    private readonly logger;
    constructor(templateRepository: Repository<NotificationTemplate>);
    createTemplate(templateData: {
        templateName: string;
        templateType: string;
        subjectTemplate: string;
        contentTemplate: string;
        linkTemplate?: string;
        isDefault?: boolean;
        createdBy: number;
        createdName: string;
    }): Promise<NotificationTemplate>;
    getTemplateList(query: any): Promise<{
        data: NotificationTemplate[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getTemplateDetail(id: number): Promise<NotificationTemplate>;
    getDefaultTemplate(templateType: string): Promise<NotificationTemplate | null>;
    updateTemplate(id: number, templateData: {
        templateName?: string;
        subjectTemplate?: string;
        contentTemplate?: string;
        linkTemplate?: string;
        isDefault?: boolean;
        status?: string;
        updatedBy: number;
        updatedName: string;
    }): Promise<NotificationTemplate>;
    deleteTemplate(id: number): Promise<NotificationTemplate>;
    renderTemplate(templateId: number, variables: Record<string, any>): Promise<{
        subject: string;
        content: string;
        link?: string;
    }>;
    private render;
    toggleTemplateStatus(id: number, status: string): Promise<NotificationTemplate>;
    initializeDefaultTemplates(): Promise<void>;
}
