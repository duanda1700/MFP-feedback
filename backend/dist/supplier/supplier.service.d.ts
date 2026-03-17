import { Repository } from 'typeorm';
import { Supplier } from '../database/entities/supplier.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
export declare class SupplierService {
    private supplierRepository;
    private orderRepository;
    private orderDetailsRepository;
    private productionPlanRepository;
    constructor(supplierRepository: Repository<Supplier>, orderRepository: Repository<PurchaseOrder>, orderDetailsRepository: Repository<PurchaseDetails>, productionPlanRepository: Repository<ProductionPlan>);
    getSupplierOrders(supplierId: number, query: any): Promise<{
        data: PurchaseOrder[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getOrderDetail(orderId: number, supplierId: number): Promise<{
        order: PurchaseOrder;
        details: PurchaseDetails[];
    }>;
    getSupplierProductionPlans(supplierId: number, query: any): Promise<{
        data: ProductionPlan[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    updatePlanStatus(planId: string, status: string, supplierId: number): Promise<ProductionPlan>;
    batchUpdatePlanStatus(planIds: string[], status: string, supplierId: number): Promise<{
        success: boolean;
        updatedCount: number;
        updatedPlans: ProductionPlan[];
    }>;
}
