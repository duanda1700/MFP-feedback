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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const feedback_data_entity_1 = require("../database/entities/feedback-data.entity");
const alert_entity_1 = require("../database/entities/alert.entity");
const task_service_1 = require("../task/task.service");
let AnalyticsService = class AnalyticsService {
    orderRepository;
    orderDetailsRepository;
    planRepository;
    feedbackRepository;
    alertRepository;
    taskService;
    constructor(orderRepository, orderDetailsRepository, planRepository, feedbackRepository, alertRepository, taskService) {
        this.orderRepository = orderRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.planRepository = planRepository;
        this.feedbackRepository = feedbackRepository;
        this.alertRepository = alertRepository;
        this.taskService = taskService;
    }
    async getStatistics() {
        const totalOrders = await this.orderRepository.count();
        const pendingOrders = await this.orderRepository.count({ where: { orderStatus: '待处理' } });
        const completedOrders = await this.orderRepository.count({ where: { orderStatus: '已完成' } });
        const totalPlans = await this.planRepository.count();
        const pendingPlans = await this.planRepository.count({ where: { planStatus: '待审批' } });
        const completedPlans = await this.planRepository.count({ where: { planStatus: '已闭环' } });
        const totalFeedbacks = await this.feedbackRepository.count();
        const pendingFeedbacks = await this.feedbackRepository.count({ where: { feedbackStatus: 1 } });
        const totalAlerts = await this.alertRepository.count();
        const pendingAlerts = await this.alertRepository.count({ where: { alertStatus: 1 } });
        const highLevelAlerts = await this.alertRepository.count({ where: { alertLevel: 3 } });
        return {
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                completed: completedOrders,
            },
            plans: {
                total: totalPlans,
                pending: pendingPlans,
                completed: completedPlans,
            },
            feedbacks: {
                total: totalFeedbacks,
                pending: pendingFeedbacks,
            },
            alerts: {
                total: totalAlerts,
                pending: pendingAlerts,
                highLevel: highLevelAlerts,
            },
        };
    }
    async getTrendData(type, period) {
        const now = new Date();
        const data = [];
        if (period === 'week') {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                data.push({
                    date: date.toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 100) + 50,
                });
            }
        }
        else if (period === 'month') {
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                data.push({
                    date: date.toISOString().split('T')[0],
                    value: Math.floor(Math.random() * 200) + 100,
                });
            }
        }
        else if (period === 'year') {
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(date.getMonth() - i);
                data.push({
                    date: date.toISOString().substring(0, 7),
                    value: Math.floor(Math.random() * 500) + 200,
                });
            }
        }
        return {
            type,
            period,
            data,
        };
    }
    async exportReport(reportType, filters, createdBy, createdName) {
        const task = await this.taskService.createTask('export-report', { reportType, filters }, createdBy, createdName);
        return {
            taskId: task.id,
            taskStatus: task.taskStatus,
            message: '报表导出任务已创建，正在处理中',
        };
    }
    async exportOrderReport(workbook, filters) {
        const worksheet = workbook.addWorksheet('订单报表');
        worksheet.columns = [
            { header: '订单ID', key: 'id', width: 10 },
            { header: '订单编号', key: 'djbH', width: 20 },
            { header: '供应商', key: 'supplierName', width: 20 },
            { header: '订单状态', key: 'orderStatus', width: 15 },
            { header: '创建时间', key: 'createTime', width: 20 },
            { header: '更新时间', key: 'updateTime', width: 20 },
        ];
        const orders = await this.orderRepository.find();
        orders.forEach(order => {
            worksheet.addRow({
                id: order.id,
                djbH: order.djbH,
                supplierName: order.supplierName,
                orderStatus: order.orderStatus,
                createTime: order.createTime,
                updateTime: order.updateTime,
            });
        });
        worksheet.getRow(1).font = { bold: true };
    }
    async exportPlanReport(workbook, filters) {
        const worksheet = workbook.addWorksheet('计划报表');
        worksheet.columns = [
            { header: '计划ID', key: 'id', width: 20 },
            { header: '计划名称', key: 'planName', width: 30 },
            { header: '计划状态', key: 'planStatus', width: 15 },
            { header: '计划日期', key: 'planDate', width: 20 },
            { header: '创建时间', key: 'createTime', width: 20 },
        ];
        const plans = await this.planRepository.find();
        plans.forEach(plan => {
            worksheet.addRow({
                id: plan.id,
                planName: plan.planName,
                planStatus: plan.planStatus,
                planDate: plan.planDate,
                createTime: plan.createTime,
            });
        });
        worksheet.getRow(1).font = { bold: true };
    }
    async exportFeedbackReport(workbook, filters) {
        const worksheet = workbook.addWorksheet('反馈报表');
        worksheet.columns = [
            { header: '反馈ID', key: 'id', width: 10 },
            { header: '订单ID', key: 'orderId', width: 10 },
            { header: '计划ID', key: 'planId', width: 10 },
            { header: '反馈状态', key: 'feedbackStatus', width: 15 },
            { header: '反馈时间', key: 'feedbackTime', width: 20 },
            { header: '操作人', key: 'operatorName', width: 15 },
        ];
        const feedbacks = await this.feedbackRepository.find();
        feedbacks.forEach(feedback => {
            worksheet.addRow({
                id: feedback.id,
                orderId: feedback.orderId,
                planId: feedback.planId,
                feedbackStatus: feedback.feedbackStatus,
                feedbackTime: feedback.feedbackTime,
                operatorName: feedback.operatorName,
            });
        });
        worksheet.getRow(1).font = { bold: true };
    }
    async exportAlertReport(workbook, filters) {
        const worksheet = workbook.addWorksheet('预警报表');
        worksheet.columns = [
            { header: '预警ID', key: 'id', width: 10 },
            { header: '预警类型', key: 'alertType', width: 15 },
            { header: '预警级别', key: 'alertLevel', width: 10 },
            { header: '预警状态', key: 'alertStatus', width: 10 },
            { header: '创建时间', key: 'createTime', width: 20 },
            { header: '处理时间', key: 'processTime', width: 20 },
            { header: '关闭时间', key: 'closeTime', width: 20 },
        ];
        const alerts = await this.alertRepository.find();
        alerts.forEach(alert => {
            worksheet.addRow({
                id: alert.id,
                alertType: alert.alertType,
                alertLevel: alert.alertLevel,
                alertStatus: alert.alertStatus,
                createTime: alert.createTime,
                processTime: alert.processTime,
                closeTime: alert.closeTime,
            });
        });
        worksheet.getRow(1).font = { bold: true };
    }
    async exportOrderChangeReport(workbook, filters) {
        const worksheet = workbook.addWorksheet('订单变更报表');
        worksheet.columns = [
            { header: '订单ID', key: 'id', width: 10 },
            { header: '订单编号', key: 'djbH', width: 20 },
            { header: '供应商', key: 'supplierName', width: 20 },
            { header: '变更类型', key: 'changeType', width: 15 },
            { header: '变更时间', key: 'updateTime', width: 20 },
            { header: '处理效率', key: 'processEfficiency', width: 15 },
        ];
        const orders = await this.orderRepository.find();
        orders.forEach(order => {
            worksheet.addRow({
                id: order.id,
                djbH: order.djbH,
                supplierName: order.supplierName,
                changeType: '计划变更',
                updateTime: order.updateTime,
                processEfficiency: '高',
            });
        });
        worksheet.getRow(1).font = { bold: true };
    }
    async getOrderChangeStatistics(filters) {
        return {
            byTime: [
                { period: '2026-01-01', count: 10 },
                { period: '2026-01-02', count: 15 },
                { period: '2026-01-03', count: 12 },
                { period: '2026-01-04', count: 18 },
                { period: '2026-01-05', count: 20 },
            ],
            bySupplier: [
                { supplier: '供应商A', count: 30 },
                { supplier: '供应商B', count: 25 },
                { supplier: '供应商C', count: 20 },
            ],
            byChangeType: [
                { type: '计划变更', count: 40 },
                { type: '数量变更', count: 20 },
                { type: '日期变更', count: 15 },
            ],
            byProcessEfficiency: [
                { efficiency: '高', count: 45 },
                { efficiency: '中', count: 20 },
                { efficiency: '低', count: 10 },
            ],
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_details_entity_1.PurchaseDetails)),
    __param(2, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __param(3, (0, typeorm_1.InjectRepository)(feedback_data_entity_1.FeedbackData)),
    __param(4, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        task_service_1.TaskService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map