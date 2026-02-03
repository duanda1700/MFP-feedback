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
var ScheduleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const erp_service_1 = require("../erp/erp.service");
const alert_service_1 = require("../../alert/alert.service");
const typeorm_1 = require("typeorm");
let ScheduleService = ScheduleService_1 = class ScheduleService {
    erpService;
    alertService;
    dataSource;
    logger = new common_1.Logger(ScheduleService_1.name);
    constructor(erpService, alertService, dataSource) {
        this.erpService = erpService;
        this.alertService = alertService;
        this.dataSource = dataSource;
    }
    async handleCronSyncErpData() {
        this.logger.log('开始执行定时同步ERP数据任务');
        try {
            const result = await this.erpService.syncErpData();
            if (result.success) {
                this.logger.log('定时同步ERP数据任务执行成功');
            }
            else {
                this.logger.error(`定时同步ERP数据任务执行失败: ${result.message}`);
            }
        }
        catch (error) {
            this.logger.error('定时同步ERP数据任务执行异常', error);
        }
    }
    async handleCronCheckAlerts() {
        this.logger.log('开始执行定时检测预警规则任务');
        try {
            await this.alertService.checkAlertRules();
            this.logger.log('定时检测预警规则任务执行成功');
        }
        catch (error) {
            this.logger.error('定时检测预警规则任务执行异常', error);
        }
    }
    async handleCronArchiveData() {
        this.logger.log('开始执行定时归档历史数据任务');
        try {
            await this.archiveHistoricalData();
            this.logger.log('定时归档历史数据任务执行成功');
        }
        catch (error) {
            this.logger.error('定时归档历史数据任务执行异常', error);
        }
    }
    async archiveHistoricalData() {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        this.logger.log(`归档${oneYearAgo.toISOString()}之前的历史数据`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            await queryRunner.query('UPDATE purchase_order SET status = ? WHERE created_at < ? AND status = ?', ['ARCHIVED', oneYearAgo, 'COMPLETED']);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.ScheduleService = ScheduleService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleService.prototype, "handleCronSyncErpData", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleService.prototype, "handleCronCheckAlerts", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleService.prototype, "handleCronArchiveData", null);
exports.ScheduleService = ScheduleService = ScheduleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [erp_service_1.ErpService,
        alert_service_1.AlertService,
        typeorm_1.DataSource])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map