import { Repository } from 'typeorm';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseDetails } from '../entities/purchase-details.entity';
import { ProductionPlan } from '../entities/production-plan.entity';
import { FeedbackData } from '../entities/feedback-data.entity';
import { Alert } from '../entities/alert.entity';
import { ChangeRecord } from '../entities/change-record.entity';
import { Notification } from '../entities/notification.entity';
import { RolePermission } from '../entities/role-permission.entity';
export declare class PerformanceService {
    private readonly purchaseOrderRepo;
    private readonly purchaseDetailsRepo;
    private readonly productionPlanRepo;
    private readonly feedbackDataRepo;
    private readonly alertRepo;
    private readonly changeRecordRepo;
    private readonly notificationRepo;
    private readonly rolePermissionRepo;
    private readonly logger;
    constructor(purchaseOrderRepo: Repository<PurchaseOrder>, purchaseDetailsRepo: Repository<PurchaseDetails>, productionPlanRepo: Repository<ProductionPlan>, feedbackDataRepo: Repository<FeedbackData>, alertRepo: Repository<Alert>, changeRecordRepo: Repository<ChangeRecord>, notificationRepo: Repository<Notification>, rolePermissionRepo: Repository<RolePermission>);
    getPerformanceStatus(): Promise<{
        connectionPoolStatus?: any;
        tableStats?: any[];
        indexStats?: any[];
        slowQueries?: any[];
    }>;
    optimizeTables(): Promise<void>;
    analyzeQuery(query: string): Promise<{
        executionPlan?: any;
        estimatedCost?: number;
        suggestions?: string[];
    }>;
    getServerParams(): Promise<{
        [key: string]: any;
    }>;
    optimizeServerParams(params: {
        [key: string]: any;
    }): Promise<void>;
    generateOptimizationSuggestions(): Promise<string[]>;
}
