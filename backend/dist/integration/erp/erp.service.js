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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ErpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const purchase_order_entity_1 = require("../../database/entities/purchase-order.entity");
const purchase_details_entity_1 = require("../../database/entities/purchase-details.entity");
const typeorm_1 = require("typeorm");
let ErpService = ErpService_1 = class ErpService {
    dataSource;
    logger = new common_1.Logger(ErpService_1.name);
    erpApiUrl = 'http://localhost:8080/erp-api';
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async syncErpData() {
        try {
            this.logger.log('开始同步ERP数据');
            const orders = await this.fetchPurchaseOrders();
            await this.savePurchaseOrders(orders);
            const details = await this.fetchPurchaseDetails();
            await this.savePurchaseDetails(details);
            const employees = await this.fetchEmployees();
            await this.saveEmployees(employees);
            const suppliers = await this.fetchSuppliers();
            await this.saveSuppliers(suppliers);
            this.logger.log('ERP数据同步完成');
            return { success: true, message: 'ERP数据同步成功' };
        }
        catch (error) {
            this.logger.error('ERP数据同步失败', error);
            return { success: false, message: `ERP数据同步失败: ${error.message}` };
        }
    }
    async fetchPurchaseOrders() {
        const response = await axios_1.default.get(`${this.erpApiUrl}/purchase-orders`);
        return response.data;
    }
    async fetchPurchaseDetails() {
        const response = await axios_1.default.get(`${this.erpApiUrl}/purchase-details`);
        return response.data;
    }
    async fetchEmployees() {
        const response = await axios_1.default.get(`${this.erpApiUrl}/employees`);
        return response.data;
    }
    async fetchSuppliers() {
        const response = await axios_1.default.get(`${this.erpApiUrl}/suppliers`);
        return response.data;
    }
    async savePurchaseOrders(orders) {
        const orderRepository = this.dataSource.getRepository(purchase_order_entity_1.PurchaseOrder);
        for (const order of orders) {
            const existingOrder = await orderRepository.findOne({ where: { djbH: order.djbH } });
            if (existingOrder) {
                orderRepository.merge(existingOrder, order);
                await orderRepository.save(existingOrder);
            }
            else {
                const newOrder = orderRepository.create(order);
                await orderRepository.save(newOrder);
            }
        }
    }
    async savePurchaseDetails(details) {
        const detailRepository = this.dataSource.getRepository(purchase_details_entity_1.PurchaseDetails);
        for (const detail of details) {
            const existingDetail = await detailRepository.findOne({ where: { id: detail.id } });
            if (existingDetail) {
                detailRepository.merge(existingDetail, detail);
                await detailRepository.save(existingDetail);
            }
            else {
                const newDetail = detailRepository.create(detail);
                await detailRepository.save(newDetail);
            }
        }
    }
    async saveEmployees(employees) {
        this.logger.log(`同步人员信息 ${employees.length} 条`);
    }
    async saveSuppliers(suppliers) {
        this.logger.log(`同步供应商信息 ${suppliers.length} 条`);
    }
    async manuallySyncErpData() {
        return this.syncErpData();
    }
};
exports.ErpService = ErpService;
exports.ErpService = ErpService = ErpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ErpService);
//# sourceMappingURL=erp.service.js.map