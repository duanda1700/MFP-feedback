import { CamundaService } from './camunda.service';
export declare class CamundaController {
    private readonly camundaService;
    constructor(camundaService: CamundaService);
    startProcess(body: {
        processKey: string;
        variables: any;
    }): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    completeTask(taskId: string, body: {
        variables: any;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getTasksByProcessInstanceId(processInstanceId: string): Promise<any[]>;
    getProcessInstance(processInstanceId: string): Promise<any>;
    startPurchaseTaskProcess(body: {
        orderId: string;
        supplierId: string;
    }): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    startProductionPlanProcess(body: {
        planId: string;
        plannerId: string;
    }): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    startProductionPlanChangeProcess(body: {
        planId: string;
        changeReason: string;
    }): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    startAlertProcess(body: {
        alertId: string;
        alertType: string;
    }): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
}
