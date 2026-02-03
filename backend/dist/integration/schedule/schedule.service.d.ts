import { ErpService } from '../erp/erp.service';
import { AlertService } from '../../alert/alert.service';
import { DataSource } from 'typeorm';
export declare class ScheduleService {
    private readonly erpService;
    private readonly alertService;
    private readonly dataSource;
    private readonly logger;
    constructor(erpService: ErpService, alertService: AlertService, dataSource: DataSource);
    handleCronSyncErpData(): Promise<void>;
    handleCronCheckAlerts(): Promise<void>;
    handleCronArchiveData(): Promise<void>;
    private archiveHistoricalData;
}
