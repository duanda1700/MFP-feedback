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
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manufacture_plan_feedback_main_entity_1 = require("../database/entities/manufacture-plan-feedback-main.entity");
const manufacture_plan_feedback_version_entity_1 = require("../database/entities/manufacture-plan-feedback-version.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
let FeedbackService = class FeedbackService {
    feedbackMainRepository;
    feedbackVersionRepository;
    productionPlanRepository;
    purchaseOrderRepository;
    dataSource;
    constructor(feedbackMainRepository, feedbackVersionRepository, productionPlanRepository, purchaseOrderRepository, dataSource) {
        this.feedbackMainRepository = feedbackMainRepository;
        this.feedbackVersionRepository = feedbackVersionRepository;
        this.productionPlanRepository = productionPlanRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.dataSource = dataSource;
    }
    async getFeedbackList(query) {
        const { page = 1, pageSize = 10, djbH, materialCode, feedbackStatus, feedbackCycle, supplierCode, } = query;
        const queryBuilder = this.feedbackMainRepository
            .createQueryBuilder('main')
            .leftJoinAndSelect('main.versions', 'version', 'version.version = main.latestVersion');
        if (djbH) {
            queryBuilder.andWhere('main.djbH LIKE :djbH', { djbH: `%${djbH}%` });
        }
        if (materialCode) {
            queryBuilder.andWhere('main.material_code LIKE :materialCode', {
                materialCode: `%${materialCode}%`,
            });
        }
        if (feedbackStatus) {
            queryBuilder.andWhere('main.feedback_status = :feedbackStatus', { feedbackStatus });
        }
        if (feedbackCycle) {
            queryBuilder.andWhere('main.feedback_cycle = :feedbackCycle', { feedbackCycle });
        }
        if (supplierCode) {
            queryBuilder.andWhere('main.supplier_code = :supplierCode', { supplierCode });
        }
        const [data, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('main.createTime', 'DESC')
            .getManyAndCount();
        await this.updateExpiredStatus();
        return { data, total, page, pageSize };
    }
    async updateExpiredStatus() {
        const now = new Date();
        const expiredRecords = await this.feedbackMainRepository
            .createQueryBuilder('main')
            .where('main.progress_status NOT IN (:...statuses)', { statuses: ['已完成', '已取消'] })
            .andWhere('main.planned_date < :now', { now })
            .getMany();
        for (const record of expiredRecords) {
            if (record.progressStatus !== '已延期') {
                record.progressStatus = '已延期';
                await this.feedbackMainRepository.save(record);
                console.log(`Updated expired record ${record.id} to 已延期`);
            }
        }
    }
    async getFeedbackDetail(mainId) {
        const main = await this.feedbackMainRepository.findOne({
            where: { id: mainId },
            relations: ['versions'],
        });
        if (!main) {
            throw new Error('反馈主记录不存在');
        }
        main.versions.sort((a, b) => b.version - a.version);
        return main;
    }
    async submitFeedback(feedbackData) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { purchaseDetailsId, feedbackCycle, feedbackItems, creator } = feedbackData;
            const djbHSet = new Set();
            const mainRecordMap = new Map();
            for (const item of feedbackItems) {
                const productionPlan = await this.productionPlanRepository.findOne({
                    where: { id: item.productionPlanId },
                });
                if (!productionPlan) {
                    continue;
                }
                if (productionPlan.djbH) {
                    djbHSet.add(productionPlan.djbH);
                }
                const purchaseDetailsIdStr = productionPlan.purchaseDetailsId.toString();
                const materialCode = productionPlan.materialCode;
                const planClass = productionPlan.planClass;
                const uniqueKey = `${purchaseDetailsIdStr}_${materialCode}_${planClass}`;
                if (mainRecordMap.has(uniqueKey)) {
                    continue;
                }
                let mainRecord = await queryRunner.manager.findOne(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain, {
                    where: {
                        purchaseDetailsId: purchaseDetailsIdStr,
                        materialCode: materialCode,
                        planClass: planClass,
                        feedbackCycle,
                    },
                });
                if (!mainRecord) {
                    mainRecord = queryRunner.manager.create(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain, {
                        id: this.generateId(),
                        purchaseDetailsId: purchaseDetailsIdStr,
                        setCount: productionPlan.setCount,
                        drawingNo: productionPlan.drawingNo,
                        sfzz: productionPlan.sfzz,
                        progressStatus: '未开始',
                        djbH: productionPlan.djbH,
                        planName: productionPlan.planName,
                        planType: productionPlan.planType,
                        materialCode: materialCode,
                        materialDesc: productionPlan.materialDesc,
                        planQuantity: productionPlan.quantity,
                        unit: productionPlan.unit,
                        plannedDate: productionPlan.plannedDate,
                        isKeyMaterial: productionPlan.isKeyMaterial,
                        productionLine: productionPlan.productionLine,
                        planClass: planClass,
                        supplierCode: item.supplierCode || 'SUPPLIER001',
                        feedbackCycleType: '周度',
                        feedbackCycle,
                        latestVersion: 1,
                        feedbackStatus: '正常',
                        creator,
                    });
                    await queryRunner.manager.save(mainRecord);
                }
                const newVersion = mainRecord.latestVersion + 1;
                mainRecordMap.set(uniqueKey, {
                    mainRecord,
                    newVersion,
                    finishedQuantity: item.finishedQuantity || 0,
                    planQuantity: productionPlan.quantity,
                    plannedDate: productionPlan.plannedDate,
                    progressStatus: item.progressStatus || ''
                });
            }
            for (const item of feedbackItems) {
                const productionPlan = await this.productionPlanRepository.findOne({
                    where: { id: item.productionPlanId },
                });
                if (!productionPlan) {
                    continue;
                }
                const purchaseDetailsIdStr = productionPlan.purchaseDetailsId.toString();
                const materialCode = productionPlan.materialCode;
                const planClass = productionPlan.planClass;
                const uniqueKey = `${purchaseDetailsIdStr}_${materialCode}_${planClass}`;
                const recordData = mainRecordMap.get(uniqueKey);
                if (!recordData) {
                    continue;
                }
                const { mainRecord, newVersion } = recordData;
                const finishedQty = item.finishedQuantity || 0;
                const planQty = productionPlan.quantity || 0;
                const now = new Date();
                const planned = productionPlan.plannedDate ? new Date(productionPlan.plannedDate) : null;
                let versionProgressStatus = item.progressStatus || '未开始';
                if (item.progressStatus && item.progressStatus !== '已完成' && item.progressStatus !== '已取消') {
                    if (planned && now > planned) {
                        versionProgressStatus = '已延期';
                    }
                }
                else if (!item.progressStatus) {
                    if (finishedQty > 0) {
                        if (finishedQty >= planQty) {
                            versionProgressStatus = '已完成';
                        }
                        else if (planned && now > planned) {
                            versionProgressStatus = '已延期';
                        }
                        else {
                            versionProgressStatus = '进行中';
                        }
                    }
                    else if (planned && now > planned) {
                        versionProgressStatus = '已延期';
                    }
                }
                const versionRecord = queryRunner.manager.create(manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion, {
                    id: this.generateId(),
                    mainId: mainRecord.id,
                    purchaseDetailsId: purchaseDetailsIdStr,
                    setCount: productionPlan.setCount,
                    drawingNo: productionPlan.drawingNo,
                    sfzz: productionPlan.sfzz,
                    progressStatus: versionProgressStatus,
                    materialCode: productionPlan.materialCode,
                    version: newVersion,
                    feedbackTime: new Date(),
                    finishedQuantity: finishedQty,
                    planQuantity: productionPlan.quantity,
                    defectQuantity: item.defectQuantity || 0,
                    actualDeliveryDate: item.actualDeliveryDate,
                    adjustedPlannedDate: item.adjustedPlannedDate,
                    remarks: item.remarks,
                    creator,
                });
                await queryRunner.manager.save(versionRecord);
            }
            for (const [purchaseDetailsIdStr, { mainRecord, newVersion, finishedQuantity, planQuantity, plannedDate, progressStatus }] of mainRecordMap) {
                mainRecord.latestVersion = newVersion;
                mainRecord.updateTime = new Date();
                const now = new Date();
                const planned = plannedDate ? new Date(plannedDate) : null;
                if (progressStatus) {
                    if (progressStatus !== '已完成' && progressStatus !== '已取消' && planned && now > planned) {
                        mainRecord.progressStatus = '已延期';
                    }
                    else {
                        mainRecord.progressStatus = progressStatus;
                    }
                }
                else {
                    const finishedQty = finishedQuantity || 0;
                    const planQty = planQuantity || 0;
                    if (finishedQty === 0) {
                        if (planned && now > planned) {
                            mainRecord.progressStatus = '已延期';
                        }
                        else {
                            mainRecord.progressStatus = '未开始';
                        }
                    }
                    else if (finishedQty >= planQty) {
                        mainRecord.progressStatus = '已完成';
                    }
                    else if (planned && now > planned) {
                        mainRecord.progressStatus = '已延期';
                    }
                    else {
                        mainRecord.progressStatus = '进行中';
                    }
                }
                await queryRunner.manager.save(mainRecord);
            }
            for (const djbH of djbHSet) {
                const feedbackMains = await queryRunner.manager.find(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain, {
                    where: { djbH },
                });
                if (feedbackMains.length === 0)
                    continue;
                const allStatuses = feedbackMains.map((m) => m.progressStatus);
                let orderFeedbackStatus = '进行中';
                if (allStatuses.every((s) => s === '已完成')) {
                    orderFeedbackStatus = '已完成';
                }
                else if (allStatuses.some((s) => s === '已延期')) {
                    orderFeedbackStatus = '已延期';
                }
                await queryRunner.manager.update(purchase_order_entity_1.PurchaseOrder, { djbH }, { feedbackStatus: orderFeedbackStatus });
                console.log(`Updated order ${djbH} feedback status to ${orderFeedbackStatus}`);
            }
            await queryRunner.commitTransaction();
            return { success: true, message: '反馈提交成功' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getFeedbackStatistics(_query) {
        const orderRepo = this.dataSource.getRepository('PurchaseOrder');
        const total = await orderRepo
            .createQueryBuilder('order')
            .where('order.orderStatus = :status', { status: '已确认' })
            .getCount();
        const completed = await orderRepo
            .createQueryBuilder('order')
            .where('order.orderStatus = :status', { status: '已确认' })
            .andWhere('order.feedback_status = :feedbackStatus', { feedbackStatus: '已完成' })
            .getCount();
        const inProgress = await orderRepo
            .createQueryBuilder('order')
            .where('order.orderStatus = :status', { status: '已确认' })
            .andWhere('order.feedback_status = :feedbackStatus', { feedbackStatus: '进行中' })
            .getCount();
        const delayed = await orderRepo
            .createQueryBuilder('order')
            .where('order.orderStatus = :status', { status: '已确认' })
            .andWhere('order.feedback_status = :feedbackStatus', { feedbackStatus: '已延期' })
            .getCount();
        return { total, completed, inProgress, delayed };
    }
    async getConfirmedPlans(query) {
        const { page = 1, pageSize = 10, djbH, materialCode, } = query;
        const queryBuilder = this.productionPlanRepository
            .createQueryBuilder('plan')
            .where('plan.planStatus = :status', { status: '已确认' });
        if (djbH) {
            queryBuilder.andWhere('plan.djbH LIKE :djbH', { djbH: `%${djbH}%` });
        }
        if (materialCode) {
            queryBuilder.andWhere('plan.materialCode LIKE :materialCode', {
                materialCode: `%${materialCode}%`,
            });
        }
        const [data, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('plan.createTime', 'DESC')
            .getManyAndCount();
        return { data, total, page, pageSize };
    }
    async getConfirmedOrdersWithPlans(query) {
        const { page = 1, pageSize = 10, djbH, statusFilter, } = query;
        const orderRepo = this.dataSource.getRepository('PurchaseOrder');
        const queryBuilder = orderRepo
            .createQueryBuilder('order')
            .where('order.orderStatus = :status', { status: '已确认' });
        if (djbH) {
            queryBuilder.andWhere('order.djbH LIKE :djbH', { djbH: `%${djbH}%` });
        }
        if (statusFilter) {
            const statusList = statusFilter.split(',').map((s) => s.trim());
            queryBuilder.andWhere('order.feedback_status IN (:...statusList)', { statusList });
        }
        const [orders, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('order.createTime', 'DESC')
            .getManyAndCount();
        const now = new Date();
        const ordersWithPlans = await Promise.all(orders.map(async (order) => {
            const plans = await this.productionPlanRepository
                .createQueryBuilder('plan')
                .where('plan.djbH = :djbH', { djbH: order.djbH })
                .andWhere('plan.planStatus = :status', { status: '已确认' })
                .orderBy('plan.sortOrder', 'ASC')
                .addOrderBy('plan.createTime', 'DESC')
                .getMany();
            const latestVersions = new Map();
            plans.forEach((plan) => {
                const key = `${plan.purchaseDetailsId}_${plan.planClass}`;
                if (!latestVersions.has(key) || plan.version > latestVersions.get(key).version) {
                    latestVersions.set(key, plan);
                }
            });
            const latestPlans = Array.from(latestVersions.values());
            const plansWithStatus = await Promise.all(latestPlans.map(async (plan) => {
                const feedbackMain = await this.feedbackMainRepository.findOne({
                    where: {
                        purchaseDetailsId: plan.purchaseDetailsId?.toString(),
                        materialCode: plan.materialCode,
                        planClass: plan.planClass,
                    },
                    order: { createTime: 'DESC' },
                    relations: ['versions'],
                });
                let progressStatus = '未开始';
                let finishedQuantity = 0;
                let defectQuantity = 0;
                let actualDeliveryDate = null;
                let remarks = '';
                if (feedbackMain) {
                    progressStatus = feedbackMain.progressStatus || '未开始';
                    if (feedbackMain.versions && feedbackMain.versions.length > 0) {
                        const latestVersion = feedbackMain.versions.sort((a, b) => b.version - a.version)[0];
                        finishedQuantity = latestVersion.finishedQuantity || 0;
                        defectQuantity = latestVersion.defectQuantity || 0;
                        actualDeliveryDate = latestVersion.actualDeliveryDate;
                        remarks = latestVersion.remarks || '';
                    }
                }
                else {
                    const plannedDate = plan.plannedDate ? new Date(plan.plannedDate) : null;
                    if (plannedDate && now > plannedDate) {
                        progressStatus = '已延期';
                    }
                }
                return {
                    ...plan,
                    progressStatus,
                    finishedQuantity,
                    defectQuantity,
                    actualDeliveryDate,
                    remarks,
                };
            }));
            return {
                ...order,
                plans: plansWithStatus,
                planCount: plansWithStatus.length,
            };
        }));
        return { data: ordersWithPlans, total, page, pageSize };
    }
    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        return (timestamp + random).padEnd(16, '0').substring(0, 16);
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain)),
    __param(1, (0, typeorm_1.InjectRepository)(manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion)),
    __param(2, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __param(3, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map