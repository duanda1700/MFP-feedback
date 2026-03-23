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
exports.OrderTrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const manufacture_plan_feedback_main_entity_1 = require("../database/entities/manufacture-plan-feedback-main.entity");
const manufacture_plan_feedback_version_entity_1 = require("../database/entities/manufacture-plan-feedback-version.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
let OrderTrackingService = class OrderTrackingService {
    orderRepository;
    productionPlanRepository;
    feedbackMainRepository;
    feedbackVersionRepository;
    purchaseDetailsRepository;
    dataSource;
    constructor(orderRepository, productionPlanRepository, feedbackMainRepository, feedbackVersionRepository, purchaseDetailsRepository, dataSource) {
        this.orderRepository = orderRepository;
        this.productionPlanRepository = productionPlanRepository;
        this.feedbackMainRepository = feedbackMainRepository;
        this.feedbackVersionRepository = feedbackVersionRepository;
        this.purchaseDetailsRepository = purchaseDetailsRepository;
        this.dataSource = dataSource;
    }
    async getOrdersByStatus() {
        const orders = await this.orderRepository
            .createQueryBuilder('order')
            .orderBy('order.createTime', 'DESC')
            .getMany();
        const result = {
            pending: [],
            processing: [],
            completed: [],
        };
        for (const order of orders) {
            const orderWithDetails = {
                ...order,
                planCount: 0,
                feedbackCount: 0,
                feedbackProgress: 0,
            };
            const planCount = await this.productionPlanRepository.count({
                where: { djbH: order.djbH, planStatus: '已确认' },
            });
            const feedbackCount = await this.feedbackMainRepository.count({
                where: { djbH: order.djbH },
            });
            orderWithDetails.planCount = planCount;
            orderWithDetails.feedbackCount = feedbackCount;
            orderWithDetails.feedbackProgress = planCount > 0 ? Math.round((feedbackCount / planCount) * 100) : 0;
            switch (order.orderStatus) {
                case '待下发':
                    result.pending.push(orderWithDetails);
                    break;
                case '已下发':
                    result.pending.push(orderWithDetails);
                    break;
                case '已确认':
                    result.processing.push(orderWithDetails);
                    break;
                case '已完成':
                    result.completed.push(orderWithDetails);
                    break;
                default:
                    result.pending.push(orderWithDetails);
            }
        }
        return result;
    }
    async getOrderDetail(djbH) {
        const order = await this.orderRepository.findOne({
            where: { djbH },
        });
        if (!order) {
            return null;
        }
        const originalPlans = await this.productionPlanRepository
            .createQueryBuilder('plan')
            .where('plan.djbH = :djbH', { djbH })
            .andWhere('plan.planStatus = :status', { status: '已确认' })
            .orderBy('plan.sortOrder', 'ASC')
            .getMany();
        const latestVersions = new Map();
        originalPlans.forEach((plan) => {
            const key = `${plan.purchaseDetailsId}_${plan.planClass}`;
            if (!latestVersions.has(key) || plan.version > latestVersions.get(key).version) {
                latestVersions.set(key, plan);
            }
        });
        const plans = Array.from(latestVersions.values());
        const plansWithFeedback = await Promise.all(plans.map(async (plan) => {
            const feedbackMain = await this.feedbackMainRepository.findOne({
                where: {
                    purchaseDetailsId: plan.purchaseDetailsId?.toString(),
                    materialCode: plan.materialCode,
                    planClass: plan.planClass,
                },
                order: { createTime: 'DESC' },
                relations: ['versions'],
            });
            let feedbackStatus = '未反馈';
            let latestFeedback = null;
            let feedbackHistory = [];
            if (feedbackMain) {
                feedbackStatus = feedbackMain.progressStatus || '未开始';
                if (feedbackMain.versions && feedbackMain.versions.length > 0) {
                    const sortedVersions = feedbackMain.versions.sort((a, b) => b.version - a.version);
                    latestFeedback = sortedVersions[0];
                    feedbackHistory = sortedVersions.map((v) => ({
                        version: v.version,
                        feedbackTime: v.feedbackTime,
                        progressStatus: v.progressStatus,
                        finishedQuantity: v.finishedQuantity,
                        actualDeliveryDate: v.actualDeliveryDate,
                        remarks: v.remarks,
                    }));
                }
            }
            return {
                ...plan,
                feedbackStatus,
                latestFeedback,
                feedbackHistory,
            };
        }));
        const statistics = {
            totalPlans: plans.length,
            completedPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '已完成').length,
            inProgressPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '进行中').length,
            delayedPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '已延期').length,
            notStartedPlans: plansWithFeedback.filter((p) => p.feedbackStatus === '未开始').length,
        };
        return {
            order,
            plans: plansWithFeedback,
            statistics,
        };
    }
    async comparePlans(djbH) {
        const originalPlans = await this.productionPlanRepository
            .createQueryBuilder('plan')
            .where('plan.djbH = :djbH', { djbH })
            .orderBy('plan.version', 'ASC')
            .addOrderBy('plan.sortOrder', 'ASC')
            .getMany();
        const groupedByDetails = new Map();
        originalPlans.forEach((plan) => {
            const key = `${plan.purchaseDetailsId}_${plan.planClass}`;
            if (!groupedByDetails.has(key)) {
                groupedByDetails.set(key, []);
            }
            groupedByDetails.get(key).push(plan);
        });
        const comparison = [];
        groupedByDetails.forEach((versions, key) => {
            if (versions.length > 1) {
                const sortedVersions = versions.sort((a, b) => a.version - b.version);
                const original = sortedVersions[0];
                const latest = sortedVersions[sortedVersions.length - 1];
                const changes = {
                    hasChanges: false,
                    fields: [],
                };
                const compareFields = ['quantity', 'plannedDate', 'materialDesc', 'remarks'];
                compareFields.forEach((field) => {
                    const originalValue = original[field];
                    const latestValue = latest[field];
                    if (originalValue !== latestValue) {
                        changes.hasChanges = true;
                        changes.fields.push({
                            field,
                            original: originalValue,
                            latest: latestValue,
                        });
                    }
                });
                comparison.push({
                    key,
                    purchaseDetailsId: original.purchaseDetailsId,
                    materialCode: original.materialCode,
                    materialDesc: original.materialDesc,
                    planClass: original.planClass,
                    originalVersion: original.version,
                    latestVersion: latest.version,
                    original,
                    latest,
                    changes,
                });
            }
        });
        return {
            djbH,
            totalItems: groupedByDetails.size,
            changedItems: comparison.filter((c) => c.changes.hasChanges).length,
            comparison,
        };
    }
    async getFeedbackHistory(djbH) {
        const feedbackMains = await this.feedbackMainRepository.find({
            where: { djbH },
            order: { createTime: 'DESC' },
            relations: ['versions'],
        });
        const history = [];
        for (const main of feedbackMains) {
            if (main.versions && main.versions.length > 0) {
                const sortedVersions = main.versions.sort((a, b) => b.version - a.version);
                for (const version of sortedVersions) {
                    history.push({
                        id: version.id,
                        materialCode: main.materialCode,
                        materialDesc: main.materialDesc,
                        planClass: main.planClass,
                        version: version.version,
                        feedbackTime: version.feedbackTime,
                        progressStatus: version.progressStatus,
                        finishedQuantity: version.finishedQuantity,
                        planQuantity: version.planQuantity,
                        actualDeliveryDate: version.actualDeliveryDate,
                        remarks: version.remarks,
                        creator: version.creator,
                    });
                }
            }
        }
        const groupedByCycle = {};
        history.forEach((item) => {
            const cycle = item.feedbackTime ? this.formatDateToCycle(item.feedbackTime) : '未知周期';
            if (!groupedByCycle[cycle]) {
                groupedByCycle[cycle] = [];
            }
            groupedByCycle[cycle].push(item);
        });
        return {
            djbH,
            totalRecords: history.length,
            groupedByCycle,
            allRecords: history,
        };
    }
    async getOrderStatistics() {
        const total = await this.orderRepository.count();
        const pending = await this.orderRepository.count({
            where: [{ orderStatus: '待下发' }, { orderStatus: '已下发' }],
        });
        const processing = await this.orderRepository.count({
            where: { orderStatus: '已确认' },
        });
        const completed = await this.orderRepository.count({
            where: { orderStatus: '已完成' },
        });
        return { total, pending, processing, completed };
    }
    formatDateToCycle(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        return `${year}W${weekNumber.toString().padStart(2, '0')}`;
    }
};
exports.OrderTrackingService = OrderTrackingService;
exports.OrderTrackingService = OrderTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __param(2, (0, typeorm_1.InjectRepository)(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain)),
    __param(3, (0, typeorm_1.InjectRepository)(manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion)),
    __param(4, (0, typeorm_1.InjectRepository)(purchase_details_entity_1.PurchaseDetails)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], OrderTrackingService);
//# sourceMappingURL=order-tracking.service.js.map