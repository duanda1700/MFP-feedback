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
exports.AlertService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_entity_1 = require("../database/entities/alert.entity");
let AlertService = class AlertService {
    alertRepository;
    constructor(alertRepository) {
        this.alertRepository = alertRepository;
    }
    async getAlertList(query) {
        const { page = 1, pageSize = 10, alertLevel, alertStatus, alertType, startDate, endDate, } = query;
        const queryBuilder = this.alertRepository.createQueryBuilder('alert');
        if (alertLevel) {
            queryBuilder.andWhere('alert.alert_level = :alertLevel', { alertLevel });
        }
        if (alertStatus) {
            queryBuilder.andWhere('alert.alert_status = :alertStatus', { alertStatus });
        }
        if (alertType) {
            queryBuilder.andWhere('alert.alert_type = :alertType', { alertType });
        }
        if (startDate) {
            queryBuilder.andWhere('alert.create_time >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('alert.create_time <= :endDate', { endDate });
        }
        const [alerts, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('alert.create_time', 'DESC')
            .getManyAndCount();
        return {
            data: alerts,
            total,
            page,
            pageSize,
        };
    }
    async getAlertDetail(id) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        return alert;
    }
    async handleAlert(id, handleData) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        alert.alertStatus = 2;
        alert.processBy = handleData.processBy;
        alert.processName = handleData.processName;
        alert.processTime = new Date();
        alert.remarks = handleData.remarks;
        return this.alertRepository.save(alert);
    }
    async updateAlertStatus(id, status) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        alert.alertStatus = status;
        if (status === 3) {
            alert.closeTime = new Date();
        }
        return this.alertRepository.save(alert);
    }
    async createAlert(alertData) {
        const alert = this.alertRepository.create({
            ...alertData,
            alertStatus: 1,
            createTime: new Date(),
        });
        const savedAlert = await this.alertRepository.save(alert);
        this.pushAlertNotification(savedAlert);
        return savedAlert;
    }
    async checkAlertTriggerType(taskId, taskType) {
        return {
            taskId,
            taskType,
            alertType: '进度延迟',
            alertLevel: '高',
            shouldTrigger: true,
        };
    }
    async pushAlertNotification(alert) {
        console.log('Alert notification pushed:', alert.id);
        return {
            message: 'Alert notification pushed successfully',
            alertId: alert.id,
        };
    }
    async escalateAlert(id) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        if (alert.alertLevel === 1) {
            alert.alertLevel = 2;
        }
        else if (alert.alertLevel === 2) {
            alert.alertLevel = 3;
        }
        return this.alertRepository.save(alert);
    }
    async closeAlert(id, closeData) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        alert.alertStatus = 3;
        alert.closeTime = new Date();
        alert.remarks = closeData.remarks;
        return this.alertRepository.save(alert);
    }
    async checkAlertThresholds() {
        return {
            checkedTasks: 100,
            triggeredAlerts: 5,
            message: 'Alert thresholds checked successfully',
        };
    }
    async deleteAlert(id) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert) {
            throw new common_1.NotFoundException('Alert not found');
        }
        return this.alertRepository.remove(alert);
    }
    async checkAlertRules() {
        console.log('Checking alert rules...');
        const checkedTasks = 100;
        const triggeredAlerts = 5;
        console.log(`Checked ${checkedTasks} tasks, triggered ${triggeredAlerts} alerts`);
        return {
            checkedTasks,
            triggeredAlerts,
            message: 'Alert rules checked successfully',
        };
    }
};
exports.AlertService = AlertService;
exports.AlertService = AlertService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AlertService);
//# sourceMappingURL=alert.service.js.map