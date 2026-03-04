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
exports.SupplierService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("../database/entities/supplier.entity");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
let SupplierService = class SupplierService {
    supplierRepository;
    orderRepository;
    orderDetailsRepository;
    productionPlanRepository;
    constructor(supplierRepository, orderRepository, orderDetailsRepository, productionPlanRepository) {
        this.supplierRepository = supplierRepository;
        this.orderRepository = orderRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.productionPlanRepository = productionPlanRepository;
    }
    async getSupplierOrders(supplierId, query) {
        const { page = 1, pageSize = 10, orderStatus, startDate, endDate, } = query;
        const queryBuilder = this.orderRepository.createQueryBuilder('order');
        if (supplierId) {
            queryBuilder.where('order.supplier_id = :supplierId', { supplierId });
        }
        if (orderStatus) {
            queryBuilder.andWhere('order.order_status = :orderStatus', { orderStatus });
        }
        if (startDate) {
            queryBuilder.andWhere('order.create_time >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('order.create_time <= :endDate', { endDate });
        }
        const [orders, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('order.create_time', 'DESC')
            .getManyAndCount();
        return {
            data: orders,
            total,
            page,
            pageSize,
        };
    }
    async getOrderDetail(orderId, supplierId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId, supplierId: supplierId }
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const details = await this.orderDetailsRepository.find({
            where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
        });
        return {
            order,
            details,
        };
    }
    async getSupplierProductionPlans(supplierId, query) {
        const { page = 1, pageSize = 10, planStatus, planClass, startDate, endDate, orderId, } = query;
        const queryBuilder = this.productionPlanRepository.createQueryBuilder('plan');
        if (supplierId) {
            queryBuilder
                .innerJoin('purchase_details', 'details', 'plan.purchase_details_id = details.id')
                .innerJoin('purchase_order', 'order', 'details.bpm_cgdd_instance_id = order.bpm_cgdd_instance_id')
                .where('order.supplier_id = :supplierId', { supplierId });
        }
        if (orderId) {
            queryBuilder.andWhere('order.id = :orderId', { orderId });
        }
        if (planStatus) {
            queryBuilder.andWhere('plan.plan_status = :planStatus', { planStatus });
        }
        if (planClass) {
            queryBuilder.andWhere('plan.plan_class = :planClass', { planClass });
        }
        if (startDate) {
            queryBuilder.andWhere('plan.create_time >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('plan.create_time <= :endDate', { endDate });
        }
        const [plans, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('plan.create_time', 'DESC')
            .getManyAndCount();
        return {
            data: plans,
            total,
            page,
            pageSize,
        };
    }
    async updatePlanStatus(planId, status, supplierId) {
        const plan = await this.productionPlanRepository.findOne({
            where: { id: planId }
        });
        if (!plan) {
            throw new common_1.NotFoundException('Production plan not found');
        }
        const isPlanBelongsToSupplier = await this.productionPlanRepository
            .createQueryBuilder('plan')
            .innerJoin('purchase_details', 'details', 'plan.purchase_details_id = details.id')
            .innerJoin('purchase_order', 'order', 'details.bpm_cgdd_instance_id = order.bpm_cgdd_instance_id')
            .where('plan.id = :planId AND order.supplier_id = :supplierId', { planId, supplierId })
            .getCount() > 0;
        if (!isPlanBelongsToSupplier) {
            throw new common_1.NotFoundException('Production plan not found');
        }
        plan.planStatus = status;
        return this.productionPlanRepository.save(plan);
    }
};
exports.SupplierService = SupplierService;
exports.SupplierService = SupplierService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(2, (0, typeorm_1.InjectRepository)(purchase_details_entity_1.PurchaseDetails)),
    __param(3, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SupplierService);
//# sourceMappingURL=supplier.service.js.map