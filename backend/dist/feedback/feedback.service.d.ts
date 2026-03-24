import { Repository, DataSource } from 'typeorm';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { TodoTaskService } from '../todo/todo-task.service';
export declare class FeedbackService {
    private feedbackMainRepository;
    private feedbackVersionRepository;
    private productionPlanRepository;
    private purchaseOrderRepository;
    private dataSource;
    private todoTaskService;
    constructor(feedbackMainRepository: Repository<ManufacturePlanFeedbackMain>, feedbackVersionRepository: Repository<ManufacturePlanFeedbackVersion>, productionPlanRepository: Repository<ProductionPlan>, purchaseOrderRepository: Repository<PurchaseOrder>, dataSource: DataSource, todoTaskService: TodoTaskService);
    getFeedbackList(query: any): Promise<{
        data: ManufacturePlanFeedbackMain[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    updateExpiredStatus(): Promise<void>;
    getFeedbackDetail(mainId: string): Promise<ManufacturePlanFeedbackMain>;
    submitFeedback(feedbackData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getFeedbackStatistics(_query: any): Promise<{
        total: number;
        completed: number;
        inProgress: number;
        delayed: number;
    }>;
    getConfirmedPlans(query: any): Promise<{
        data: ProductionPlan[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getConfirmedOrdersWithPlans(query: any): Promise<{
        data: any[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    private generateId;
}
