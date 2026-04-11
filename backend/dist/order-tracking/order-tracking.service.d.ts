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
        plans: {
            feedbackStatus: string;
            latestFeedback: any;
            feedbackHistory: any[];
            id: string;
            purchaseDetailsId: number;
            setCount: string;
            drawingNo: string;
            djbH: string;
            planName: string;
            planType: string;
            planClass: string;
            planDept: string;
            planMaker: string;
            planDate: Date;
            planStatus: string;
            materialCode: string;
            materialDesc: string;
            quantity: number;
            unit: string;
            plannedDate: Date;
            jhrq: Date;
            changeType: string;
            sfzz: string;
            finishedQuantity: number;
            isKeyMaterial: string;
            productionLine: string;
            remarks: string;
            version: number;
            sortOrder: number;
            createTime: Date;
            updateTime: Date;
        }[];
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
        versions: number[];
        totalItems: number;
        changedItems: number;
        comparison: any[];
    }>;
    private getFieldDisplayName;
    getOrderStatistics(): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        inProgress: number;
        completed: number;
        delayed: number;
    }>;
}
