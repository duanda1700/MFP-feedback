import { OrderTrackingService } from './order-tracking.service';
export declare class OrderTrackingController {
    private readonly orderTrackingService;
    constructor(orderTrackingService: OrderTrackingService);
    getOrdersByStatus(): Promise<any>;
    getStatistics(): Promise<{
        total: number;
        pending: number;
        processing: number;
        completed: number;
    }>;
    getOrderDetail(djbH: string): Promise<{
        order: import("../database/entities/purchase-order.entity").PurchaseOrder;
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
}
