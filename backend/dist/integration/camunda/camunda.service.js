"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CamundaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamundaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let CamundaService = CamundaService_1 = class CamundaService {
    logger = new common_1.Logger(CamundaService_1.name);
    camundaApiUrl = 'http://localhost:8080/engine-rest';
    async startProcess(processKey, variables) {
        try {
            this.logger.log(`开始启动Camunda流程: ${processKey}`);
            const response = await axios_1.default.post(`${this.camundaApiUrl}/process-definition/key/${processKey}/start`, {
                variables: this.convertVariables(variables),
            });
            this.logger.log(`Camunda流程启动成功: ${response.data.id}`);
            return {
                success: true,
                processInstanceId: response.data.id,
                message: '流程启动成功',
            };
        }
        catch (error) {
            this.logger.error('Camunda流程启动失败', error);
            return {
                success: false,
                message: `流程启动失败: ${error.message}`,
            };
        }
    }
    async completeTask(taskId, variables) {
        try {
            this.logger.log(`开始完成Camunda任务: ${taskId}`);
            await axios_1.default.post(`${this.camundaApiUrl}/task/${taskId}/complete`, {
                variables: this.convertVariables(variables),
            });
            this.logger.log(`Camunda任务完成成功: ${taskId}`);
            return {
                success: true,
                message: '任务完成成功',
            };
        }
        catch (error) {
            this.logger.error('Camunda任务完成失败', error);
            return {
                success: false,
                message: `任务完成失败: ${error.message}`,
            };
        }
    }
    async getTasksByProcessInstanceId(processInstanceId) {
        try {
            const response = await axios_1.default.get(`${this.camundaApiUrl}/task`, {
                params: {
                    processInstanceId,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('获取Camunda任务失败', error);
            return [];
        }
    }
    async getProcessInstance(processInstanceId) {
        try {
            const response = await axios_1.default.get(`${this.camundaApiUrl}/process-instance/${processInstanceId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error('获取Camunda流程实例失败', error);
            return null;
        }
    }
    convertVariables(variables) {
        const converted = {};
        for (const key in variables) {
            if (variables.hasOwnProperty(key)) {
                converted[key] = {
                    value: variables[key],
                    type: typeof variables[key],
                };
            }
        }
        return converted;
    }
    async startPurchaseTaskProcess(orderId, supplierId) {
        return this.startProcess('purchaseTaskProcess', {
            orderId,
            supplierId,
            startTime: new Date().toISOString(),
        });
    }
    async startProductionPlanProcess(planId, plannerId) {
        return this.startProcess('productionPlanProcess', {
            planId,
            plannerId,
            startTime: new Date().toISOString(),
        });
    }
    async startProductionPlanChangeProcess(planId, changeReason) {
        return this.startProcess('productionPlanChangeProcess', {
            planId,
            changeReason,
            startTime: new Date().toISOString(),
        });
    }
    async startAlertProcess(alertId, alertType) {
        return this.startProcess('alertProcess', {
            alertId,
            alertType,
            startTime: new Date().toISOString(),
        });
    }
};
exports.CamundaService = CamundaService;
exports.CamundaService = CamundaService = CamundaService_1 = __decorate([
    (0, common_1.Injectable)()
], CamundaService);
//# sourceMappingURL=camunda.service.js.map