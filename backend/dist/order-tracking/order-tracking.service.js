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
            .where('order.orderStatus != :status', { status: '已拆分' })
            .andWhere('order.orderType = :type', { type: 'ORIGINAL' })
            .orderBy('order.createTime', 'DESC')
            .getMany();
        const result = {
            pending: [],
            confirmed: [],
            inProgress: [],
            completed: [],
            delayed: [],
        };
        for (const order of orders) {
            const orderWithDetails = {
                ...order,
                planCount: 0,
                feedbackCount: 0,
                feedbackProgress: 0,
            };
            const allPlans = await this.productionPlanRepository.find({
                where: { djbH: order.djbH },
            });
            const maxVersion = allPlans.length > 0
                ? Math.max(...allPlans.map((p) => p.version || 1))
                : 1;
            const planCount = allPlans.filter((p) => (p.version || 1) === maxVersion).length;
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
                    result.confirmed.push(orderWithDetails);
                    break;
                case '进行中':
                    result.inProgress.push(orderWithDetails);
                    break;
                case '已完成':
                    result.completed.push(orderWithDetails);
                    break;
                case '已延期':
                    result.delayed.push(orderWithDetails);
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
        const allPlans = await this.productionPlanRepository
            .createQueryBuilder('plan')
            .where('plan.djbH = :djbH', { djbH })
            .orderBy('plan.sortOrder', 'ASC')
            .getMany();
        const maxVersion = Math.max(...allPlans.map((p) => p.version || 1));
        const plans = allPlans.filter((p) => (p.version || 1) === maxVersion);
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
        const allPlans = await this.productionPlanRepository
            .createQueryBuilder('plan')
            .where('plan.djbH = :djbH', { djbH })
            .orderBy('plan.version', 'ASC')
            .addOrderBy('plan.sortOrder', 'ASC')
            .getMany();
        if (allPlans.length === 0) {
            return {
                djbH,
                versions: [],
                totalItems: 0,
                changedItems: 0,
                comparison: [],
            };
        }
        const versionSet = new Set();
        allPlans.forEach((plan) => {
            versionSet.add(plan.version || 1);
        });
        const versions = Array.from(versionSet).sort((a, b) => a - b);
        const groupedByKey = new Map();
        allPlans.forEach((plan) => {
            const key = `${plan.purchaseDetailsId || 0}_${plan.planClass || '生产计划'}`;
            if (!groupedByKey.has(key)) {
                groupedByKey.set(key, []);
            }
            groupedByKey.get(key).push(plan);
        });
        const comparison = [];
        const compareFields = [
            'quantity',
            'plannedDate',
            'materialDesc',
            'materialCode',
            'unit',
            'sfzz',
            'remarks',
            'planType',
            'changeType',
        ];
        groupedByKey.forEach((planVersions, key) => {
            const versionMap = new Map();
            planVersions.forEach((plan) => {
                versionMap.set(plan.version || 1, plan);
            });
            const firstPlan = planVersions[0];
            const itemComparison = {
                key,
                purchaseDetailsId: firstPlan.purchaseDetailsId,
                materialCode: firstPlan.materialCode,
                materialDesc: firstPlan.materialDesc,
                planClass: firstPlan.planClass,
                versions: {},
                changes: {
                    hasChanges: false,
                    fields: [],
                },
            };
            versions.forEach((v) => {
                const plan = versionMap.get(v);
                if (plan) {
                    itemComparison.versions[v] = {
                        id: plan.id,
                        quantity: plan.quantity,
                        plannedDate: plan.plannedDate,
                        materialDesc: plan.materialDesc,
                        materialCode: plan.materialCode,
                        unit: plan.unit,
                        sfzz: plan.sfzz,
                        remarks: plan.remarks,
                        planType: plan.planType,
                        changeType: plan.changeType,
                        sortOrder: plan.sortOrder,
                    };
                }
                else {
                    itemComparison.versions[v] = null;
                }
            });
            if (versions.length > 1) {
                const firstVersion = versions[0];
                const lastVersion = versions[versions.length - 1];
                const firstPlanData = versionMap.get(firstVersion);
                const lastPlanData = versionMap.get(lastVersion);
                if (firstPlanData && lastPlanData) {
                    compareFields.forEach((field) => {
                        const originalValue = firstPlanData[field];
                        const latestValue = lastPlanData[field];
                        if (originalValue !== latestValue) {
                            itemComparison.changes.hasChanges = true;
                            itemComparison.changes.fields.push({
                                field,
                                original: originalValue,
                                latest: latestValue,
                                fieldName: this.getFieldDisplayName(field),
                            });
                        }
                    });
                }
            }
            comparison.push(itemComparison);
        });
        comparison.sort((a, b) => {
            const aSort = a.versions[versions[0]]?.sortOrder || 0;
            const bSort = b.versions[versions[0]]?.sortOrder || 0;
            return aSort - bSort;
        });
        return {
            djbH,
            versions,
            totalItems: groupedByKey.size,
            changedItems: comparison.filter((c) => c.changes.hasChanges).length,
            comparison,
        };
    }
    getFieldDisplayName(field) {
        const fieldNames = {
            quantity: '数量',
            plannedDate: '计划日期',
            materialDesc: '物料描述',
            materialCode: '物料编码',
            unit: '单位',
            sfzz: '是否自制',
            remarks: '备注',
            planType: '计划类型',
            changeType: '变更类型',
        };
        return fieldNames[field] || field;
    }
    async getOrderStatistics() {
        const total = await this.orderRepository.count();
        const pending = await this.orderRepository.count({
            where: [{ orderStatus: '待下发' }, { orderStatus: '已下发' }],
        });
        const confirmed = await this.orderRepository.count({
            where: { orderStatus: '已确认' },
        });
        const inProgress = await this.orderRepository.count({
            where: { orderStatus: '进行中' },
        });
        const completed = await this.orderRepository.count({
            where: { orderStatus: '已完成' },
        });
        const delayed = await this.orderRepository.count({
            where: { orderStatus: '已延期' },
        });
        return { total, pending, confirmed, inProgress, completed, delayed };
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