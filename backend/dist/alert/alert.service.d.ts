import { Repository } from 'typeorm';
import { Alert } from '../database/entities/alert.entity';
export declare class AlertService {
    private alertRepository;
    constructor(alertRepository: Repository<Alert>);
    getAlertList(query: any): Promise<{
        data: Alert[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getAlertDetail(id: number): Promise<Alert>;
    handleAlert(id: number, handleData: any): Promise<Alert>;
    updateAlertStatus(id: number, status: number): Promise<Alert>;
    createAlert(alertData: any): Promise<Alert[]>;
    checkAlertTriggerType(taskId: number, taskType: string): Promise<{
        taskId: number;
        taskType: string;
        alertType: string;
        alertLevel: string;
        shouldTrigger: boolean;
    }>;
    pushAlertNotification(alert: any): Promise<{
        message: string;
        alertId: any;
    }>;
    escalateAlert(id: number): Promise<Alert>;
    closeAlert(id: number, closeData: any): Promise<Alert>;
    checkAlertThresholds(): Promise<{
        checkedTasks: number;
        triggeredAlerts: number;
        message: string;
    }>;
    deleteAlert(id: number): Promise<Alert>;
    checkAlertRules(): Promise<{
        checkedTasks: number;
        triggeredAlerts: number;
        message: string;
    }>;
}
