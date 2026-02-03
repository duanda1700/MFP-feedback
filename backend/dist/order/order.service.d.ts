import { Repository } from 'typeorm';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
export declare class OrderService {
    private orderRepository;
    private orderDetailsRepository;
    constructor(orderRepository: Repository<PurchaseOrder>, orderDetailsRepository: Repository<PurchaseDetails>);
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
}
