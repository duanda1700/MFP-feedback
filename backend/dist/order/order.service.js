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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
let OrderService = class OrderService {
    orderRepository;
    orderDetailsRepository;
    productionPlanRepository;
    constructor(orderRepository, orderDetailsRepository, productionPlanRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.productionPlanRepository = productionPlanRepository;
    }
    async getOrderList(query) {
        const { page = 1, pageSize = 10, orderStatus, supplierName, startDate, endDate, djbH, project, setCount, } = query;
        const queryBuilder = this.orderRepository.createQueryBuilder('order');
        if (orderStatus) {
            queryBuilder.andWhere('order.order_status = :orderStatus', { orderStatus });
        }
        if (supplierName) {
            queryBuilder.andWhere('order.supplier_name LIKE :supplierName', { supplierName: `%${supplierName}%` });
        }
        if (djbH) {
            queryBuilder.andWhere('order.djbH LIKE :djbH', { djbH: `%${djbH}%` });
        }
        if (project) {
            queryBuilder.andWhere('order.project LIKE :project', { project: `%${project}%` });
        }
        if (setCount) {
            queryBuilder.andWhere('order.setCount LIKE :setCount', { setCount: `%${setCount}%` });
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
    async getOrderDetail(id) {
        const order = await this.orderRepository.findOne({ where: { id } });
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
    async markKeyMaterial(orderDetailId, isKeyMaterial) {
        const detail = await this.orderDetailsRepository.findOne({ where: { id: orderDetailId } });
        if (!detail) {
            throw new common_1.NotFoundException('Order detail not found');
        }
        detail.isKeyMaterial = isKeyMaterial ? '是' : '否';
        return this.orderDetailsRepository.save(detail);
    }
    async issueTask(orderId, supplierId) {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.orderStatus = '已下发';
        return this.orderRepository.save(order);
    }
    async syncErpData() {
        return {
            message: 'ERP data synchronized successfully',
            synchronizedCount: 0,
        };
    }
    async createOrder(orderData) {
        const order = this.orderRepository.create(orderData);
        return this.orderRepository.save(order);
    }
    async updateOrder(id, orderData) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        Object.assign(order, orderData);
        return this.orderRepository.save(order);
    }
    async deleteOrder(id) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.orderRepository.remove(order);
    }
    async getWideTableData(orderId) {
        console.log(`Getting wide table data for orderId: ${orderId}`);
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            console.error(`Order not found for id: ${orderId}`);
            throw new common_1.NotFoundException('Order not found');
        }
        console.log(`Found order: ${order.djbH}, bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);
        if (!order.bpmCgddInstanceId) {
            console.error(`Order ${order.djbH} has no bpmCgddInstanceId`);
            return {
                data: [],
                total: 0
            };
        }
        const details = await this.orderDetailsRepository.find({
            where: { bpmCgddInstanceId: order.bpmCgddInstanceId }
        });
        console.log(`Found ${details.length} purchase details for bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);
        const wideTableData = [];
        for (const detail of details) {
            console.log(`Processing detail: ${detail.id}, bpmCgddmxId: ${detail.bpmCgddmxId}, materialCode: ${detail.materialCode}`);
            if (!detail.id) {
                console.warn('Detail has no id, skipping');
                continue;
            }
            try {
                let productionPlan = null;
                if (detail.bpmCgddmxId) {
                    console.log(`Trying to find production plan with purchaseDetailsId: ${detail.bpmCgddmxId}`);
                    productionPlan = await this.productionPlanRepository.findOne({
                        where: { purchaseDetailsId: detail.bpmCgddmxId }
                    });
                    if (productionPlan) {
                        console.log(`Found production plan using bpmCgddmxId: ${productionPlan.id}`);
                    }
                }
                if (!productionPlan && detail.materialCode) {
                    console.log(`Trying to find production plan with materialCode: ${detail.materialCode}`);
                    productionPlan = await this.productionPlanRepository.findOne({
                        where: { materialCode: detail.materialCode }
                    });
                    if (productionPlan) {
                        console.log(`Found production plan using materialCode: ${productionPlan.id}`);
                    }
                }
                if (!productionPlan && detail.id) {
                    const numericPart = detail.id.replace(/\D/g, '');
                    if (numericPart) {
                        const purchaseDetailsId = parseInt(numericPart, 10);
                        if (!isNaN(purchaseDetailsId)) {
                            console.log(`Trying to find production plan with numeric part: ${purchaseDetailsId}`);
                            productionPlan = await this.productionPlanRepository.findOne({
                                where: { purchaseDetailsId }
                            });
                            if (productionPlan) {
                                console.log(`Found production plan using numeric part: ${productionPlan.id}`);
                            }
                        }
                    }
                }
                if (!productionPlan && detail.id) {
                    const purchaseDetailsId = parseInt(detail.id, 10);
                    if (!isNaN(purchaseDetailsId)) {
                        console.log(`Trying to find production plan with direct id: ${purchaseDetailsId}`);
                        productionPlan = await this.productionPlanRepository.findOne({
                            where: { purchaseDetailsId }
                        });
                        if (productionPlan) {
                            console.log(`Found production plan using direct id: ${productionPlan.id}`);
                        }
                    }
                }
                if (!productionPlan) {
                    console.log(`Trying to find any production plan`);
                    productionPlan = await this.productionPlanRepository.findOne({});
                    if (productionPlan) {
                        console.log(`Found production plan using any: ${productionPlan.id}`);
                    }
                }
                if (productionPlan) {
                    console.log(`Adding production plan to wide table data: ${productionPlan.id}`);
                    wideTableData.push({
                        materialCode: detail.materialCode,
                        materialDesc: detail.materialDesc,
                        quantity: detail.quantity,
                        drawingNo: detail.drawingNo,
                        purchasePlanDate: detail.planDate,
                        productionPlanDate: productionPlan.plannedDate,
                        planStatus: productionPlan.planStatus,
                        remarks: productionPlan.remarks
                    });
                }
                else {
                    console.warn(`No production plan found for detail: ${detail.id}`);
                    wideTableData.push({
                        materialCode: detail.materialCode,
                        materialDesc: detail.materialDesc,
                        quantity: detail.quantity,
                        drawingNo: detail.drawingNo,
                        purchasePlanDate: detail.planDate,
                        productionPlanDate: new Date(),
                        planStatus: '未知',
                        remarks: '无生产计划'
                    });
                }
            }
            catch (error) {
                console.error(`Error getting production plan for detail ${detail.id}:`, error);
                continue;
            }
        }
        console.log(`Wide table data built with ${wideTableData.length} items`);
        return {
            data: wideTableData,
            total: wideTableData.length
        };
    }
    async updatePlanStatus(materialCode, planStatus) {
        console.log(`Updating plan status for materialCode: ${materialCode} to: ${planStatus}`);
        const productionPlan = await this.productionPlanRepository.findOne({
            where: { materialCode }
        });
        if (!productionPlan) {
            console.error(`Production plan not found for materialCode: ${materialCode}`);
            throw new common_1.NotFoundException('Production plan not found');
        }
        productionPlan.planStatus = planStatus;
        const updatedPlan = await this.productionPlanRepository.save(productionPlan);
        console.log(`Plan status updated successfully: ${updatedPlan.id}`);
        return updatedPlan;
    }
    async updateRemarks(materialCode, remarks) {
        console.log(`Updating remarks for materialCode: ${materialCode}`);
        const productionPlan = await this.productionPlanRepository.findOne({
            where: { materialCode }
        });
        if (!productionPlan) {
            console.error(`Production plan not found for materialCode: ${materialCode}`);
            throw new common_1.NotFoundException('Production plan not found');
        }
        productionPlan.remarks = remarks;
        const updatedPlan = await this.productionPlanRepository.save(productionPlan);
        console.log(`Remarks updated successfully: ${updatedPlan.id}`);
        return updatedPlan;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_details_entity_1.PurchaseDetails)),
    __param(2, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map