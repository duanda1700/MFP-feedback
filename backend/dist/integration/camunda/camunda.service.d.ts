export declare class CamundaService {
    private readonly logger;
    private readonly camundaApiUrl;
    startProcess(processKey: string, variables: any): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    completeTask(taskId: string, variables: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getTasksByProcessInstanceId(processInstanceId: string): Promise<any[]>;
    getProcessInstance(processInstanceId: string): Promise<any>;
    private convertVariables;
    startPurchaseTaskProcess(orderId: string, supplierId: string): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    startProductionPlanProcess(planId: string, plannerId: string): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    startProductionPlanChangeProcess(planId: string, changeReason: string): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
    startAlertProcess(alertId: string, alertType: string): Promise<{
        success: boolean;
        processInstanceId?: string;
        message: string;
    }>;
}
