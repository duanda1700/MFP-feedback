import { Repository, DataSource } from 'typeorm';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
export declare class ExcelService {
    private productionPlanRepository;
    private feedbackMainRepository;
    private feedbackVersionRepository;
    private purchaseOrderRepository;
    private dataSource;
    constructor(productionPlanRepository: Repository<ProductionPlan>, feedbackMainRepository: Repository<ManufacturePlanFeedbackMain>, feedbackVersionRepository: Repository<ManufacturePlanFeedbackVersion>, purchaseOrderRepository: Repository<PurchaseOrder>, dataSource: DataSource);
    exportBatchOrders(djbHList: string[]): Promise<Buffer>;
    importFeedbackData(fileBuffer: Buffer, creator: string): Promise<any>;
    private formatDate;
    private getCurrentCycle;
    private generateId;
}
