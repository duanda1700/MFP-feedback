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
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const feedback_service_1 = require("./feedback.service");
let FeedbackController = class FeedbackController {
    feedbackService;
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async getFeedbackList(query) {
        return this.feedbackService.getFeedbackList(query);
    }
    async getFeedbackDetail(id) {
        return this.feedbackService.getFeedbackDetail(id);
    }
    async submitFeedback(feedbackData) {
        return this.feedbackService.submitFeedback(feedbackData);
    }
    async updateFeedbackStatus(id, body) {
        return this.feedbackService.updateFeedbackStatus(id, body.status);
    }
    async updateFeedback(id, feedbackData) {
        return this.feedbackService.updateFeedback(id, feedbackData);
    }
    async checkOrderStatus(orderId) {
        return this.feedbackService.checkOrderStatus(orderId);
    }
    async checkEditableRange(feedbackId, userId) {
        return this.feedbackService.checkEditableRange(feedbackId, userId);
    }
    async getPurchaseMonitoring() {
        return this.feedbackService.getPurchaseMonitoring();
    }
    async deleteFeedback(id) {
        return this.feedbackService.deleteFeedback(id);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbackList", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbackDetail", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "submitFeedback", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('update-status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateFeedbackStatus", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateFeedback", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('order-status/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "checkOrderStatus", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('editable-range/:feedbackId'),
    __param(0, (0, common_1.Param)('feedbackId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "checkEditableRange", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('purchase-monitoring'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getPurchaseMonitoring", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "deleteFeedback", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('api/feedback'),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map