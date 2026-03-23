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
const feedback_service_1 = require("./feedback.service");
let FeedbackController = class FeedbackController {
    feedbackService;
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async getFeedbackList(query) {
        return await this.feedbackService.getFeedbackList(query);
    }
    async getFeedbackDetail(id) {
        return await this.feedbackService.getFeedbackDetail(id);
    }
    async submitFeedback(feedbackData) {
        return await this.feedbackService.submitFeedback(feedbackData);
    }
    async getFeedbackStatistics(query) {
        return await this.feedbackService.getFeedbackStatistics(query);
    }
    async getConfirmedPlans(query) {
        return await this.feedbackService.getConfirmedPlans(query);
    }
    async getConfirmedOrdersWithPlans(query) {
        return await this.feedbackService.getConfirmedOrdersWithPlans(query);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbackList", null);
__decorate([
    (0, common_1.Get)('detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbackDetail", null);
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "submitFeedback", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbackStatistics", null);
__decorate([
    (0, common_1.Get)('confirmed-plans'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getConfirmedPlans", null);
__decorate([
    (0, common_1.Get)('orders-with-plans'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getConfirmedOrdersWithPlans", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('api/feedback'),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map