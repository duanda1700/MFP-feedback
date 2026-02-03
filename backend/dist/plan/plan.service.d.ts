import { Repository } from 'typeorm';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { TaskService } from '../task/task.service';
export declare class PlanService {
    private planRepository;
    private taskService;
    constructor(planRepository: Repository<ProductionPlan>, taskService: TaskService);
    getPlanList(query: any): Promise<{
        data: ProductionPlan[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getPlanDetail(id: string): Promise<ProductionPlan>;
    createPlan(planData: any): Promise<ProductionPlan[]>;
    updatePlan(id: string, planData: any): Promise<ProductionPlan>;
    importPlan(planDataList: any[], createdBy: number, createdName: string): Promise<{
        taskId: string;
        taskStatus: string;
        message: string;
    }>;
    submitApproval(id: string): Promise<ProductionPlan>;
    validatePlan(plan: any): "计划完成时间不能大于订单交货期" | "责任人不能为空" | null;
    deletePlan(id: string): Promise<ProductionPlan>;
    executePlan(id: string): Promise<ProductionPlan>;
    completePlan(id: string): Promise<ProductionPlan>;
    closePlan(id: string): Promise<ProductionPlan>;
}
