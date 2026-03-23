import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrderTask } from '../database/entities/purchase-order-task.entity';
import { Supplier } from '../database/entities/supplier.entity';
import { OperationLog } from '../database/entities/operation-log.entity';
export declare class OrderService {
    private orderRepository;
    private orderDetailsRepository;
    private productionPlanRepository;
    private orderTaskRepository;
    private supplierRepository;
    private operationLogRepository;
    constructor(orderRepository: Repository<PurchaseOrder>, orderDetailsRepository: Repository<PurchaseDetails>, productionPlanRepository: Repository<ProductionPlan>, orderTaskRepository: Repository<PurchaseOrderTask>, supplierRepository: Repository<Supplier>, operationLogRepository: Repository<OperationLog>);
    getOrderList(query: any): Promise<{
        data: PurchaseOrder[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getOrderDetail(id: number): Promise<{
        order: PurchaseOrder;
        details: PurchaseDetails[];
    }>;
    markKeyMaterial(orderDetailId: string, isKeyMaterial: boolean): Promise<PurchaseDetails>;
    markComplianceMaterial(orderDetailId: string, isComplianceMaterial: boolean): Promise<PurchaseDetails>;
    syncErpData(): Promise<{
        message: string;
        synchronizedCount: number;
    }>;
    createOrder(orderData: any): Promise<PurchaseOrder[]>;
    updateOrder(id: number, orderData: any): Promise<PurchaseOrder>;
    deleteOrder(id: number): Promise<PurchaseOrder>;
    getWideTableData(orderId: number): Promise<{
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
    updatePlanStatus(materialCode: string, planStatus: string): Promise<ProductionPlan>;
    updateRemarks(materialCode: string, remarks: string): Promise<ProductionPlan>;
    updateOrderStatus(id: number, status: string): Promise<PurchaseOrder>;
    getSupplierList(): Promise<Supplier[]>;
    generatePlanFeedbackTemplate(orderId: number): Promise<{
        setCount: string;
        drawingNo: string;
        changeType: string;
        sfzz: string;
        materialCode: string;
        materialDesc: string;
        quantity: number;
        jhrq: Date;
        planDate: Date;
        isKeyMaterial: boolean;
        isComplianceMaterial: boolean;
        planStatus: string;
        supplierCode: string;
        supplierName: string;
        orderNo: string;
        remarks: string;
    }[]>;
    issueOrder(orderId: number, supplierId: number, issueDesc: string, planCompleteTime: Date, detailMarks: any[], planFeedbackTemplate: any[]): Promise<{
        success: boolean;
        message: string;
        orderId: number;
        taskId: number;
    }>;
    issueTask(data: {
        ids: number[];
        supplierId: string;
        description: string;
        dueDate: Date;
    }): Promise<{
        success: boolean;
        message: string;
        results: {
            success: boolean;
            message: string;
            orderId: number;
            taskId?: number;
        }[];
    }>;
}
