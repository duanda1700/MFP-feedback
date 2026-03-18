import { PlanService } from './plan.service';
export declare class PlanController {
    private planService;
    constructor(planService: PlanService);
    getPlanList(query: any): Promise<{
        data: import("../database/entities/production-plan.entity").ProductionPlan[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getPlanDetail(id: string): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
    createPlan(planData: any): Promise<import("../database/entities/production-plan.entity").ProductionPlan[]>;
    updatePlan(id: string, planData: any): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
    importPlan(body: {
        plans: any[];
        createdBy: number;
        createdName: string;
        orderId?: number;
    }): Promise<{
        success: boolean;
        count: number;
        message: string;
        version?: undefined;
    } | {
        success: boolean;
        count: number;
        version: any;
        message: string;
    }>;
    submitApproval(id: string): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
    executePlan(id: string): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
    completePlan(id: string): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
    closePlan(id: string): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
    deletePlan(id: string): Promise<import("../database/entities/production-plan.entity").ProductionPlan>;
}
