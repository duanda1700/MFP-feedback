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
exports.SupplierController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const supplier_service_1 = require("./supplier.service");
let SupplierController = class SupplierController {
    supplierService;
    constructor(supplierService) {
        this.supplierService = supplierService;
    }
    async getSupplierOrders(req, query) {
        const supplierId = req.user.supplierId;
        return this.supplierService.getSupplierOrders(supplierId, query);
    }
    async getOrderDetail(req, orderId) {
        const supplierId = req.user.supplierId;
        return this.supplierService.getOrderDetail(orderId, supplierId);
    }
    async getSupplierProductionPlans(req, query) {
        const supplierId = req.user.supplierId || null;
        return this.supplierService.getSupplierProductionPlans(supplierId, query);
    }
    async updatePlanStatus(req, planId, body) {
        const supplierId = req.user.supplierId;
        return this.supplierService.updatePlanStatus(planId, body.status, supplierId);
    }
    async batchUpdatePlanStatus(req, body) {
        const supplierId = req.user.supplierId;
        return this.supplierService.batchUpdatePlanStatus(body.planIds, body.status, supplierId);
    }
};
exports.SupplierController = SupplierController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getSupplierOrders", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('production-plans'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "getSupplierProductionPlans", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('production-plans/:id/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "updatePlanStatus", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('production-plans/batch-status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "batchUpdatePlanStatus", null);
exports.SupplierController = SupplierController = __decorate([
    (0, common_1.Controller)('api/supplier'),
    __metadata("design:paramtypes", [supplier_service_1.SupplierService])
], SupplierController);
//# sourceMappingURL=supplier.controller.js.map