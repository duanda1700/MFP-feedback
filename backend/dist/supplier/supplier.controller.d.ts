import { SupplierService } from './supplier.service';
export declare class SupplierController {
    private supplierService;
    constructor(supplierService: SupplierService);
    getSupplierOrders(req: any, query: any): Promise<{
        data: import("../database/entities/purchase-order.entity").PurchaseOrder[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getOrderDetail(req: any, orderId: number): Promise<{
        order: import("../database/entities/purchase-order.entity").PurchaseOrder;
        details: import("../database/entities/purchase-details.entity").PurchaseDetails[];
    }>;
    getSupplierProductionPlans(req: any, query: any): Promise<{
        data: import("../database/entities/production-plan.entity").ProductionPlan[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    updatePlanStatus(req: any, planId: string, body: {
        status: string;
    }): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
}
