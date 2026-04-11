import { OrderTrackingService } from './order-tracking.service';
export declare class OrderTrackingController {
    private readonly orderTrackingService;
    constructor(orderTrackingService: OrderTrackingService);
    getOrdersByStatus(): Promise<any>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        inProgress: number;
        completed: number;
        delayed: number;
    }>;
    getOrderDetail(djbH: string): Promise<{
        order: import("../database/entities/purchase-order.entity").PurchaseOrder;
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
}
