import { Repository, DataSource } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
export declare class OrderTrackingService {
    private orderRepository;
    private productionPlanRepository;
    private feedbackMainRepository;
    private feedbackVersionRepository;
    private purchaseDetailsRepository;
    private dataSource;
    constructor(orderRepository: Repository<PurchaseOrder>, productionPlanRepository: Repository<ProductionPlan>, feedbackMainRepository: Repository<ManufacturePlanFeedbackMain>, feedbackVersionRepository: Repository<ManufacturePlanFeedbackVersion>, purchaseDetailsRepository: Repository<PurchaseDetails>, dataSource: DataSource);
    getOrdersByStatus(): Promise<any>;
    getOrderDetail(djbH: string): Promise<{
        order: PurchaseOrder;
        plans: any[];
        statistics: {
            totalPlans: number;
            completedPlans: number;
            inProgressPlans: number;
            delayedPlans: number;
            notStartedPlans: number;
        };
    } | null>;
    comparePlans(djbH: string): Promise<{
        djbH: string;
        totalItems: number;
        changedItems: number;
        comparison: any[];
    }>;
    getFeedbackHistory(djbH: string): Promise<{
        djbH: string;
        totalRecords: number;
        groupedByCycle: any;
        allRecords: any[];
    }>;
    getOrderStatistics(): Promise<{
        total: number;
        pending: number;
        processing: number;
        completed: number;
    }>;
    private formatDateToCycle;
}
