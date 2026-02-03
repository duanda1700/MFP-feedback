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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const alert_service_1 = require("./alert.service");
const permission_guard_1 = require("../permission/guards/permission.guard");
let AlertController = class AlertController {
    alertService;
    constructor(alertService) {
        this.alertService = alertService;
    }
    async getAlertList(query) {
        return this.alertService.getAlertList(query);
    }
    async getAlertDetail(id) {
        return this.alertService.getAlertDetail(id);
    }
    async handleAlert(id, handleData) {
        return this.alertService.handleAlert(id, handleData);
    }
    async updateAlertStatus(id, body) {
        return this.alertService.updateAlertStatus(id, body.status);
    }
    async createAlert(alertData) {
        return this.alertService.createAlert(alertData);
    }
    async checkAlertTriggerType(taskId, taskType) {
        return this.alertService.checkAlertTriggerType(taskId, taskType);
    }
    async escalateAlert(id) {
        return this.alertService.escalateAlert(id);
    }
    async closeAlert(id, closeData) {
        return this.alertService.closeAlert(id, closeData);
    }
    async checkAlertThresholds() {
        return this.alertService.checkAlertThresholds();
    }
    async deleteAlert(id) {
        return this.alertService.deleteAlert(id);
    }
};
exports.AlertController = AlertController;
__decorate([
    (0, common_1.Get)('list'),
    (0, permission_guard_1.RequirePermission)('alert:read'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "getAlertList", null);
__decorate([
    (0, common_1.Get)('detail/:id'),
    (0, permission_guard_1.RequirePermission)('alert:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "getAlertDetail", null);
__decorate([
    (0, common_1.Post)('handle/:id'),
    (0, permission_guard_1.RequirePermission)('alert:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "handleAlert", null);
__decorate([
    (0, common_1.Put)('status/:id'),
    (0, permission_guard_1.RequirePermission)('alert:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "updateAlertStatus", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, permission_guard_1.RequirePermission)('alert:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Get)('trigger-check'),
    __param(0, (0, common_1.Query)('taskId')),
    __param(1, (0, common_1.Query)('taskType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "checkAlertTriggerType", null);
__decorate([
    (0, common_1.Post)('escalate/:id'),
    (0, permission_guard_1.RequirePermission)('alert:update'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "escalateAlert", null);
__decorate([
    (0, common_1.Post)('close/:id'),
    (0, permission_guard_1.RequirePermission)('alert:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "closeAlert", null);
__decorate([
    (0, common_1.Post)('check-thresholds'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "checkAlertThresholds", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    (0, permission_guard_1.RequirePermission)('alert:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AlertController.prototype, "deleteAlert", null);
exports.AlertController = AlertController = __decorate([
    (0, common_1.Controller)('api/alert'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [alert_service_1.AlertService])
], AlertController);
//# sourceMappingURL=alert.controller.js.map