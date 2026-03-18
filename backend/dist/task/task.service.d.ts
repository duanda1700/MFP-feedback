import { Repository } from 'typeorm';
import { Task } from '../database/entities/task.entity';
import { NotificationService } from '../integration/notification/notification.service';
export declare class TaskService {
    private taskRepository;
    private notificationService;
    private readonly logger;
    private readonly taskQueue;
    private isProcessing;
    constructor(taskRepository: Repository<Task>, notificationService: NotificationService);
    createTask(taskType: string, taskData: any, createdBy: number, createdName: string): Promise<Task>;
    getTaskList(query: any): Promise<{
        data: Task[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getTaskDetail(id: string): Promise<Task>;
    getTaskCount(query: any): Promise<{
        count: number;
    }>;
    private startTaskProcessor;
    private processTask;
    private processImportPlanTask;
    private processExportReportTask;
    private sendTaskCompletionNotification;
    private getTaskTypeName;
    cancelTask(id: string): Promise<Task>;
}
