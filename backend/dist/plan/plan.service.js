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
exports.PlanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const operation_log_entity_1 = require("../database/entities/operation-log.entity");
const task_service_1 = require("../task/task.service");
let PlanService = class PlanService {
    planRepository;
    orderRepository;
    operationLogRepository;
    taskService;
    constructor(planRepository, orderRepository, operationLogRepository, taskService) {
        this.planRepository = planRepository;
        this.orderRepository = orderRepository;
        this.operationLogRepository = operationLogRepository;
        this.taskService = taskService;
    }
    async getPlanList(query) {
        const { page = 1, pageSize = 10, planStatus, planName, startDate, endDate, } = query;
        const queryBuilder = this.planRepository.createQueryBuilder('plan');
        if (planStatus) {
            queryBuilder.andWhere('plan.plan_status = :planStatus', { planStatus });
        }
        if (planName) {
            queryBuilder.andWhere('plan.plan_name LIKE :planName', { planName: `%${planName}%` });
        }
        if (startDate) {
            queryBuilder.andWhere('plan.plan_date >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('plan.plan_date <= :endDate', { endDate });
        }
        const [plans, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('plan.plan_date', 'DESC')
            .getManyAndCount();
        return {
            data: plans,
            total,
            page,
            pageSize,
        };
    }
    async getPlanDetail(id) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return plan;
    }
    async createPlan(planData) {
        const plan = this.planRepository.create(planData);
        return this.planRepository.save(plan);
    }
    async updatePlan(id, planData) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        Object.assign(plan, planData);
        return this.planRepository.save(plan);
    }
    async importPlan(planDataList, createdBy, createdName, orderId) {
        let savedCount = 0;
        if (planDataList.length === 0) {
            return {
                success: false,
                count: 0,
                message: '没有计划数据需要导入',
            };
        }
        const djbH = planDataList[0].djbH;
        const maxVersionResult = await this.planRepository
            .createQueryBuilder('plan')
            .select('MAX(plan.version)', 'maxVersion')
            .where('plan.djbH = :djbH', { djbH })
            .getRawOne();
        const nextVersion = (maxVersionResult.maxVersion || 0) + 1;
        console.log(`Importing plans for order ${djbH}, next version: ${nextVersion}`);
        for (const planData of planDataList) {
            const timestamp = Date.now().toString().slice(-10);
            const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const id = `PP${timestamp}_${randomStr}`.slice(0, 16);
            const plan = this.planRepository.create({
                id: id,
                ...planData,
                version: nextVersion,
                sortOrder: planData.sortOrder || 0
            });
            await this.planRepository.save(plan);
            savedCount++;
        }
        if (orderId) {
            const order = await this.orderRepository.findOne({ where: { id: orderId } });
            if (order) {
                order.orderStatus = '已确认';
                await this.orderRepository.save(order);
                console.log(`Updated order ${orderId} status to "已确认"`);
                const operationLog = this.operationLogRepository.create({
                    operationType: '生产计划确认',
                    operationDesc: `订单 ${order.djbH} 确认提交，版本号: ${nextVersion}，计划数量: ${savedCount}`,
                    operator: createdName,
                    operatedAt: new Date(),
                    relatedId: orderId.toString()
                });
                await this.operationLogRepository.save(operationLog);
                console.log(`Recorded operation log for order ${orderId}`);
            }
        }
        return {
            success: true,
            count: savedCount,
            version: nextVersion,
            message: `成功导入 ${savedCount} 条生产计划，版本号: ${nextVersion}`,
        };
    }
    async submitApproval(id) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        const validationError = this.validatePlan(plan);
        if (validationError) {
            throw new Error(validationError);
        }
        plan.planStatus = '待审批';
        return this.planRepository.save(plan);
    }
    validatePlan(plan) {
        if (plan.plannedDate && plan.deliveryDate) {
            if (new Date(plan.plannedDate) > new Date(plan.deliveryDate)) {
                return '计划完成时间不能大于订单交货期';
            }
        }
        if (!plan.planMaker) {
            return '责任人不能为空';
        }
        return null;
    }
    async deletePlan(id) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return this.planRepository.remove(plan);
    }
    async executePlan(id) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        plan.planStatus = '执行中';
        return this.planRepository.save(plan);
    }
    async completePlan(id) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        plan.planStatus = '已完成';
        return this.planRepository.save(plan);
    }
    async closePlan(id) {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        plan.planStatus = '已闭环';
        return this.planRepository.save(plan);
    }
};
exports.PlanService = PlanService;
exports.PlanService = PlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(2, (0, typeorm_1.InjectRepository)(operation_log_entity_1.OperationLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        task_service_1.TaskService])
], PlanService);
//# sourceMappingURL=plan.service.js.map