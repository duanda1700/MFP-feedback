import { DataSource } from 'typeorm';
export declare class ErpService {
    private dataSource;
    private readonly logger;
    private readonly erpApiUrl;
    constructor(dataSource: DataSource);
    syncErpData(): Promise<{
        success: boolean;
        message: string;
    }>;
    private fetchPurchaseOrders;
    private fetchPurchaseDetails;
    private fetchEmployees;
    private fetchSuppliers;
    private savePurchaseOrders;
    private savePurchaseDetails;
    private saveEmployees;
    private saveSuppliers;
    manuallySyncErpData(): Promise<{
        success: boolean;
        message: string;
    }>;
}
