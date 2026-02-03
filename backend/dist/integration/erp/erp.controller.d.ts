import { ErpService } from './erp.service';
export declare class ErpController {
    private readonly erpService;
    constructor(erpService: ErpService);
    syncErpData(): Promise<{
        success: boolean;
        message: string;
    }>;
    manuallySyncErpData(): Promise<{
        success: boolean;
        message: string;
    }>;
}
