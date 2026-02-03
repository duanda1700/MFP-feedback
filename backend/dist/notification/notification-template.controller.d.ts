import { NotificationTemplateService } from './notification-template.service';
export declare class NotificationTemplateController {
    private readonly templateService;
    constructor(templateService: NotificationTemplateService);
    getTemplateList(query: any): Promise<{
        data: import("../database/entities/notification-template.entity").NotificationTemplate[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getTemplateDetail(id: number): Promise<import("../database/entities/notification-template.entity").NotificationTemplate>;
    getDefaultTemplate(templateType: string): Promise<import("../database/entities/notification-template.entity").NotificationTemplate | null>;
    createTemplate(body: {
        templateName: string;
        templateType: string;
        subjectTemplate: string;
        contentTemplate: string;
        linkTemplate?: string;
        isDefault?: boolean;
        createdBy: number;
        createdName: string;
    }): Promise<import("../database/entities/notification-template.entity").NotificationTemplate>;
    updateTemplate(id: number, body: {
        templateName?: string;
        subjectTemplate?: string;
        contentTemplate?: string;
        linkTemplate?: string;
        isDefault?: boolean;
        status?: string;
        updatedBy: number;
        updatedName: string;
    }): Promise<import("../database/entities/notification-template.entity").NotificationTemplate>;
    deleteTemplate(id: number): Promise<import("../database/entities/notification-template.entity").NotificationTemplate>;
    toggleTemplateStatus(id: number, status: string): Promise<import("../database/entities/notification-template.entity").NotificationTemplate>;
    renderTemplate(id: number, variables: Record<string, any>): Promise<{
        subject: string;
        content: string;
        link?: string;
    }>;
    initializeDefaultTemplates(): Promise<{
        message: string;
    }>;
}
