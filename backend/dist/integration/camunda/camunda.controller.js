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
exports.CamundaController = void 0;
const common_1 = require("@nestjs/common");
const camunda_service_1 = require("./camunda.service");
let CamundaController = class CamundaController {
    camundaService;
    constructor(camundaService) {
        this.camundaService = camundaService;
    }
    async startProcess(body) {
        return this.camundaService.startProcess(body.processKey, body.variables);
    }
    async completeTask(taskId, body) {
        return this.camundaService.completeTask(taskId, body.variables);
    }
    async getTasksByProcessInstanceId(processInstanceId) {
        return this.camundaService.getTasksByProcessInstanceId(processInstanceId);
    }
    async getProcessInstance(processInstanceId) {
        return this.camundaService.getProcessInstance(processInstanceId);
    }
    async startPurchaseTaskProcess(body) {
        return this.camundaService.startPurchaseTaskProcess(body.orderId, body.supplierId);
    }
    async startProductionPlanProcess(body) {
        return this.camundaService.startProductionPlanProcess(body.planId, body.plannerId);
    }
    async startProductionPlanChangeProcess(body) {
        return this.camundaService.startProductionPlanChangeProcess(body.planId, body.changeReason);
    }
    async startAlertProcess(body) {
        return this.camundaService.startAlertProcess(body.alertId, body.alertType);
    }
};
exports.CamundaController = CamundaController;
__decorate([
    (0, common_1.Post)('process/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "startProcess", null);
__decorate([
    (0, common_1.Post)('task/:taskId/complete'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "completeTask", null);
__decorate([
    (0, common_1.Get)('process/:processInstanceId/tasks'),
    __param(0, (0, common_1.Param)('processInstanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "getTasksByProcessInstanceId", null);
__decorate([
    (0, common_1.Get)('process/:processInstanceId'),
    __param(0, (0, common_1.Param)('processInstanceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "getProcessInstance", null);
__decorate([
    (0, common_1.Post)('process/purchase-task/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "startPurchaseTaskProcess", null);
__decorate([
    (0, common_1.Post)('process/production-plan/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "startProductionPlanProcess", null);
__decorate([
    (0, common_1.Post)('process/production-plan-change/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "startProductionPlanChangeProcess", null);
__decorate([
    (0, common_1.Post)('process/alert/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CamundaController.prototype, "startAlertProcess", null);
exports.CamundaController = CamundaController = __decorate([
    (0, common_1.Controller)('api/integration/camunda'),
    __metadata("design:paramtypes", [camunda_service_1.CamundaService])
], CamundaController);
//# sourceMappingURL=camunda.controller.js.map