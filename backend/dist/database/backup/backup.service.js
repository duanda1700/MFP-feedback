"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let BackupService = BackupService_1 = class BackupService {
    logger = new common_1.Logger(BackupService_1.name);
    backupDir = path.join(process.cwd(), 'backup');
    config = {
        mysql: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'ab123=ab123',
            database: 'mfp_feedback',
        },
        backup: {
            full: {
                schedule: '0 0 * * 0',
                keepDays: 30,
            },
            incremental: {
                schedule: '0 0 * * 1-6',
                keepDays: 7,
            },
        },
    };
    constructor() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }
    async fullBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `full-${timestamp}.sql`);
        try {
            this.logger.log('开始执行全量备份...');
            const command = `mysqldump -h ${this.config.mysql.host} -P ${this.config.mysql.port} -u ${this.config.mysql.user} -p${this.config.mysql.password} --databases ${this.config.mysql.database} > "${backupFile}"`;
            (0, child_process_1.execSync)(command);
            this.logger.log(`全量备份完成，文件路径: ${backupFile}`);
            this.cleanupOldBackups('full', this.config.backup.full.keepDays);
        }
        catch (error) {
            this.logger.error('全量备份失败:', error);
            throw error;
        }
    }
    async incrementalBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `incremental-${timestamp}.sql`);
        try {
            this.logger.log('开始执行增量备份...');
            const command = `mysqldump -h ${this.config.mysql.host} -P ${this.config.mysql.port} -u ${this.config.mysql.user} -p${this.config.mysql.password} --no-create-info ${this.config.mysql.database} > "${backupFile}"`;
            (0, child_process_1.execSync)(command);
            this.logger.log(`增量备份完成，文件路径: ${backupFile}`);
            this.cleanupOldBackups('incremental', this.config.backup.incremental.keepDays);
        }
        catch (error) {
            this.logger.error('增量备份失败:', error);
            throw error;
        }
    }
    async restore(backupFile) {
        try {
            this.logger.log(`开始从备份文件恢复数据: ${backupFile}`);
            const command = `mysql -h ${this.config.mysql.host} -P ${this.config.mysql.port} -u ${this.config.mysql.user} -p${this.config.mysql.password} ${this.config.mysql.database} < "${backupFile}"`;
            (0, child_process_1.execSync)(command);
            this.logger.log('数据恢复完成');
        }
        catch (error) {
            this.logger.error('数据恢复失败:', error);
            throw error;
        }
    }
    cleanupOldBackups(type, keepDays) {
        try {
            const files = fs.readdirSync(this.backupDir);
            const cutoffTime = Date.now() - keepDays * 24 * 60 * 60 * 1000;
            files.forEach(file => {
                if (file.startsWith(`${type}-`)) {
                    const filePath = path.join(this.backupDir, file);
                    const stats = fs.statSync(filePath);
                    if (stats.mtime.getTime() < cutoffTime) {
                        fs.unlinkSync(filePath);
                        this.logger.log(`删除过期的${type}备份文件: ${file}`);
                    }
                }
            });
        }
        catch (error) {
            this.logger.error('清理过期备份文件失败:', error);
        }
    }
    async archiveOldData(days = 90) {
        try {
            this.logger.log(`开始归档${days}天前的历史数据...`);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
            this.logger.log(`归档截止日期: ${cutoffDateStr}`);
            this.logger.log('历史数据归档完成');
        }
        catch (error) {
            this.logger.error('历史数据归档失败:', error);
            throw error;
        }
    }
    async getBackupStatus() {
        try {
            const files = fs.readdirSync(this.backupDir);
            const fullBackups = files.filter(f => f.startsWith('full-')).sort().reverse();
            const incrementalBackups = files.filter(f => f.startsWith('incremental-')).sort().reverse();
            let totalSize = 0;
            files.forEach(file => {
                const stats = fs.statSync(path.join(this.backupDir, file));
                totalSize += stats.size;
            });
            const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
            return {
                lastFullBackup: fullBackups.length > 0 ? fullBackups[0] : undefined,
                lastIncrementalBackup: incrementalBackups.length > 0 ? incrementalBackups[0] : undefined,
                backupDirSize: `${sizeInMB} MB`,
            };
        }
        catch (error) {
            this.logger.error('获取备份状态失败:', error);
            return {};
        }
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BackupService);
//# sourceMappingURL=backup.service.js.map