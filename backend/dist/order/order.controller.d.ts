import { OrderService } from './order.service';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    getOrderList(query: any): Promise<{
        data: import("../database/entities/purchase-order.entity").PurchaseOrder[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getOrderDetail(id: number): Promise<{
        order: import("../database/entities/purchase-order.entity").PurchaseOrder;
        details: import("../database/entities/purchase-details.entity").PurchaseDetails[];
    }>;
    markKeyMaterial(body: {
        orderDetailId: string;
        isKeyMaterial: boolean;
    }): Promise<import("../database/entities/purchase-details.entity").PurchaseDetails>;
    issueTask(body: {
        orderId: number;
        supplierId: number;
    }): Promise<import("../database/entities/purchase-order.entity").PurchaseOrder>;
    syncErpData(): Promise<{
        message: string;
        synchronizedCount: number;
    }>;
    createOrder(orderData: any): Promise<import("../database/entities/purchase-order.entity").PurchaseOrder[]>;
    updateOrder(id: number, orderData: any): Promise<import("../database/entities/purchase-order.entity").PurchaseOrder>;
    deleteOrder(id: number): Promise<import("../database/entities/purchase-order.entity").PurchaseOrder>;
    getWideTableData(id: number): Promise<{
        data: {
            materialCode: string;
            materialDesc: string;
            quantity: number;
            drawingNo: string;
            purchasePlanDate: Date;
            productionPlanDate: Date;
            planStatus: string;
            remarks: string;
        }[];
        total: number;
    }>;
    updatePlanStatus(body: {
        materialCode: string;
        planStatus: string;
    }): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
    updateRemarks(body: {
        materialCode: string;
        remarks: string;
    }): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
}
