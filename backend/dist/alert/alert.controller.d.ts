import { AlertService } from './alert.service';
export declare class AlertController {
    private alertService;
    constructor(alertService: AlertService);
    getAlertList(query: any): Promise<{
        data: import("../database/entities/alert.entity").Alert[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getAlertDetail(id: number): Promise<import("../database/entities/alert.entity").Alert>;
    handleAlert(id: number, handleData: any): Promise<import("../database/entities/alert.entity").Alert>;
    updateAlertStatus(id: number, body: {
        status: number;
    }): Promise<import("../database/entities/alert.entity").Alert>;
    createAlert(alertData: any): Promise<import("../database/entities/alert.entity").Alert[]>;
    checkAlertTriggerType(taskId: number, taskType: string): Promise<{
        taskId: number;
        taskType: string;
        alertType: string;
        alertLevel: string;
        shouldTrigger: boolean;
    }>;
    escalateAlert(id: number): Promise<import("../database/entities/alert.entity").Alert>;
    closeAlert(id: number, closeData: any): Promise<import("../database/entities/alert.entity").Alert>;
    checkAlertThresholds(): Promise<{
        checkedTasks: number;
        triggeredAlerts: number;
        message: string;
    }>;
    deleteAlert(id: number): Promise<import("../database/entities/alert.entity").Alert>;
}
