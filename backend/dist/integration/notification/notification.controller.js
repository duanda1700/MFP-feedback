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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async sendEmail(body) {
        return this.notificationService.sendEmail(body.to, body.subject, body.content);
    }
    async sendWechatMessage(body) {
        return this.notificationService.sendWechatMessage(body.toUser, body.message);
    }
    async sendAlertNotification(body) {
        await this.notificationService.sendAlertNotification(body.recipients, body.alertType, body.alertContent);
        return { success: true, message: '预警通知发送成功' };
    }
    async sendTaskNotification(body) {
        await this.notificationService.sendTaskNotification(body.recipients, body.taskType, body.taskContent);
        return { success: true, message: '任务通知发送成功' };
    }
    async sendApprovalNotification(body) {
        await this.notificationService.sendApprovalNotification(body.recipients, body.approvalType, body.approvalContent);
        return { success: true, message: '审批通知发送成功' };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)('email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)('wechat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendWechatMessage", null);
__decorate([
    (0, common_1.Post)('alert'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendAlertNotification", null);
__decorate([
    (0, common_1.Post)('task'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendTaskNotification", null);
__decorate([
    (0, common_1.Post)('approval'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendApprovalNotification", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('api/integration/notification'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map