"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BackupController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const backup_service_1 = require("./backup.service");
let BackupController = BackupController_1 = class BackupController {
    backupService;
    logger = new common_1.Logger(BackupController_1.name);
    constructor(backupService) {
        this.backupService = backupService;
    }
    async fullBackup() {
        this.logger.log('接收到全量备份请求');
        await this.backupService.fullBackup();
        return { message: '全量备份执行成功' };
    }
    async incrementalBackup() {
        this.logger.log('接收到增量备份请求');
        await this.backupService.incrementalBackup();
        return { message: '增量备份执行成功' };
    }
    async restore(backupFile) {
        this.logger.log(`接收到数据恢复请求，备份文件: ${backupFile}`);
        await this.backupService.restore(backupFile);
        return { message: '数据恢复执行成功' };
    }
    async archiveOldData(days = 90) {
        this.logger.log(`接收到历史数据归档请求，归档${days}天前的数据`);
        await this.backupService.archiveOldData(days);
        return { message: '历史数据归档执行成功' };
    }
    async getBackupStatus() {
        this.logger.log('接收到获取备份状态请求');
        const status = await this.backupService.getBackupStatus();
        return status;
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Post)('full'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "fullBackup", null);
__decorate([
    (0, common_1.Post)('incremental'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "incrementalBackup", null);
__decorate([
    (0, common_1.Post)('restore'),
    __param(0, (0, common_1.Body)('backupFile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)('archive'),
    __param(0, (0, common_1.Body)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "archiveOldData", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "getBackupStatus", null);
exports.BackupController = BackupController = BackupController_1 = __decorate([
    (0, common_1.Controller)('api/backup'),
    __metadata("design:paramtypes", [backup_service_1.BackupService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map