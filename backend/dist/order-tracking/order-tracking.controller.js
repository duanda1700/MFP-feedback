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
exports.OrderTrackingController = void 0;
const common_1 = require("@nestjs/common");
const order_tracking_service_1 = require("./order-tracking.service");
let OrderTrackingController = class OrderTrackingController {
    orderTrackingService;
    constructor(orderTrackingService) {
        this.orderTrackingService = orderTrackingService;
    }
    async getOrdersByStatus() {
        return this.orderTrackingService.getOrdersByStatus();
    }
    async getStatistics() {
        return this.orderTrackingService.getOrderStatistics();
    }
    async getOrderDetail(djbH) {
        return this.orderTrackingService.getOrderDetail(djbH);
    }
    async comparePlans(djbH) {
        return this.orderTrackingService.comparePlans(djbH);
    }
    async getFeedbackHistory(djbH) {
        return this.orderTrackingService.getFeedbackHistory(djbH);
    }
};
exports.OrderTrackingController = OrderTrackingController;
__decorate([
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderTrackingController.prototype, "getOrdersByStatus", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderTrackingController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('detail/:djbH'),
    __param(0, (0, common_1.Param)('djbH')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderTrackingController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Get)('compare/:djbH'),
    __param(0, (0, common_1.Param)('djbH')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderTrackingController.prototype, "comparePlans", null);
__decorate([
    (0, common_1.Get)('history/:djbH'),
    __param(0, (0, common_1.Param)('djbH')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderTrackingController.prototype, "getFeedbackHistory", null);
exports.OrderTrackingController = OrderTrackingController = __decorate([
    (0, common_1.Controller)('api/order-tracking'),
    __metadata("design:paramtypes", [order_tracking_service_1.OrderTrackingService])
], OrderTrackingController);
//# sourceMappingURL=order-tracking.controller.js.map