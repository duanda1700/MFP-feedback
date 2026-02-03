import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly backupService;
    private readonly logger;
    constructor(backupService: BackupService);
    fullBackup(): Promise<{
        message: string;
    }>;
    incrementalBackup(): Promise<{
        message: string;
    }>;
    restore(backupFile: string): Promise<{
        message: string;
    }>;
    archiveOldData(days?: number): Promise<{
        message: string;
    }>;
    getBackupStatus(): Promise<{
        lastFullBackup?: string;
        lastIncrementalBackup?: string;
        backupDirSize?: string;
    }>;
}
