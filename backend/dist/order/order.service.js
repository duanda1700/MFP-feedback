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
let OrderService = class OrderService {
    orderRepository;
    orderDetailsRepository;
    constructor(orderRepository, orderDetailsRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailsRepository = orderDetailsRepository;
    }
    async getOrderList(query) {
        const { page = 1, pageSize = 10, orderStatus, supplierName, startDate, endDate, } = query;
        const queryBuilder = this.orderRepository.createQueryBuilder('order');
        if (orderStatus) {
            queryBuilder.andWhere('order.order_status = :orderStatus', { orderStatus });
        }
        if (supplierName) {
            queryBuilder.andWhere('order.supplier_name LIKE :supplierName', { supplierName: `%${supplierName}%` });
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_details_entity_1.PurchaseDetails)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map