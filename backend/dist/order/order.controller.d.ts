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
    markComplianceMaterial(body: {
        orderDetailId: string;
        isComplianceMaterial: boolean;
    }): Promise<import("../database/entities/purchase-details.entity").PurchaseDetails>;
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
    updateOrderStatus(id: number, body: {
        status: string;
    }): Promise<import("../database/entities/purchase-order.entity").PurchaseOrder>;
    getSuppliers(): Promise<import("../database/entities/supplier.entity").Supplier[]>;
    generateTemplate(orderId: number): Promise<{
        materialCode: string;
        materialDesc: string;
        quantity: number;
        planDate: Date;
        isKeyMaterial: boolean;
        isComplianceMaterial: boolean;
        planStatus: string;
        supplierCode: string;
        supplierName: string;
        orderNo: string;
        remarks: string;
    }[]>;
    issueOrder(body: {
        orderId: number;
        supplierId: number;
        issueDesc: string;
        planCompleteTime: Date;
        detailMarks: any[];
        planFeedbackTemplate: any[];
    }): Promise<{
        success: boolean;
        message: string;
        orderId: number;
        taskId: number;
    }>;
}
