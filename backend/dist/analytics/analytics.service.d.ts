import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { FeedbackData } from '../database/entities/feedback-data.entity';
import { Alert } from '../database/entities/alert.entity';
import { TaskService } from '../task/task.service';
export declare class AnalyticsService {
    private orderRepository;
    private orderDetailsRepository;
    private planRepository;
    private feedbackRepository;
    private alertRepository;
    private taskService;
    constructor(orderRepository: Repository<PurchaseOrder>, orderDetailsRepository: Repository<PurchaseDetails>, planRepository: Repository<ProductionPlan>, feedbackRepository: Repository<FeedbackData>, alertRepository: Repository<Alert>, taskService: TaskService);
    getStatistics(): Promise<{
        orders: {
            total: number;
            pending: number;
            completed: number;
        };
        plans: {
            total: number;
            pending: number;
            completed: number;
        };
        feedbacks: {
            total: number;
            pending: number;
        };
        alerts: {
            total: number;
            pending: number;
            highLevel: number;
        };
    }>;
    getTrendData(type: string, period: string): Promise<{
        type: string;
        period: string;
        data: {
            date: string;
            value: number;
        }[];
    }>;
    exportReport(reportType: string, filters: any, createdBy: number, createdName: string): Promise<{
        taskId: string;
        taskStatus: string;
        message: string;
    }>;
    private exportOrderReport;
    private exportPlanReport;
    private exportFeedbackReport;
    private exportAlertReport;
    private exportOrderChangeReport;
    getOrderChangeStatistics(filters: any): Promise<{
        byTime: {
            period: string;
            count: number;
        }[];
        bySupplier: {
            supplier: string;
            count: number;
        }[];
        byChangeType: {
            type: string;
            count: number;
        }[];
        byProcessEfficiency: {
            efficiency: string;
            count: number;
        }[];
    }>;
}
