import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
export declare class OrderService {
    private orderRepository;
    private orderDetailsRepository;
    private productionPlanRepository;
    constructor(orderRepository: Repository<PurchaseOrder>, orderDetailsRepository: Repository<PurchaseDetails>, productionPlanRepository: Repository<ProductionPlan>);
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
    issueTask(orderId: number, supplierId: number): Promise<PurchaseOrder>;
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
}
