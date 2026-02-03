export declare class BackupService {
    private readonly logger;
    private readonly backupDir;
    private readonly config;
    constructor();
    fullBackup(): Promise<void>;
    incrementalBackup(): Promise<void>;
    restore(backupFile: string): Promise<void>;
    private cleanupOldBackups;
    archiveOldData(days?: number): Promise<void>;
    getBackupStatus(): Promise<{
        lastFullBackup?: string;
        lastIncrementalBackup?: string;
        backupDirSize?: string;
    }>;
}
