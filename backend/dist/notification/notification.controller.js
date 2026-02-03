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
const passport_1 = require("@nestjs/passport");
const notification_service_1 = require("./notification.service");
const permission_guard_1 = require("../permission/guards/permission.guard");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotificationList(receiverId, query) {
        return this.notificationService.getNotificationList(receiverId, query);
    }
    async getUnreadCount(receiverId) {
        return this.notificationService.getUnreadCount(receiverId);
    }
    async markAsRead(id, receiverId) {
        return this.notificationService.markAsRead(id, receiverId);
    }
    async markMultipleAsRead(body) {
        return this.notificationService.markMultipleAsRead(body.ids, body.receiverId);
    }
    async deleteNotification(id, receiverId) {
        return this.notificationService.deleteNotification(id, receiverId);
    }
    async deleteMultipleNotifications(body) {
        return this.notificationService.deleteMultipleNotifications(body.ids, body.receiverId);
    }
    async createNotification(body) {
        return this.notificationService.createNotification(body);
    }
    async getNotificationStats(receiverId) {
        return this.notificationService.getNotificationStats(receiverId);
    }
    async sendAlertNotification(body) {
        return this.notificationService.sendAlertNotification(body.receiverId, body.alertId, body.alertContent, body.createBy);
    }
    async sendApprovalNotification(body) {
        return this.notificationService.sendApprovalNotification(body.receiverId, body.approvalId, body.approvalContent, body.createBy);
    }
    async sendTaskNotification(body) {
        return this.notificationService.sendTaskNotification(body.receiverId, body.taskId, body.taskContent, body.createBy);
    }
    async getNotificationRecords(query) {
        return this.notificationService.getNotificationRecords(query);
    }
    async getNotificationRecord(id) {
        return this.notificationService.getNotificationRecord(id);
    }
    async createNotificationRecord(body) {
        return this.notificationService.createNotificationRecord(body);
    }
    async updateNotificationRecordStatus(id, body) {
        return this.notificationService.updateNotificationRecordStatus(id, body.status, body.errorMessage);
    }
    async getNotificationRecordStats(query) {
        return this.notificationService.getNotificationRecordStats(query);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)('list'),
    (0, permission_guard_1.RequirePermission)('notification:read'),
    __param(0, (0, common_1.Query)('receiverId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationList", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, permission_guard_1.RequirePermission)('notification:read'),
    __param(0, (0, common_1.Query)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('mark-as-read/:id'),
    (0, permission_guard_1.RequirePermission)('notification:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-multiple-as-read'),
    (0, permission_guard_1.RequirePermission)('notification:update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markMultipleAsRead", null);
__decorate([
    (0, common_1.Post)('delete/:id'),
    (0, permission_guard_1.RequirePermission)('notification:delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Post)('delete-multiple'),
    (0, permission_guard_1.RequirePermission)('notification:delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteMultipleNotifications", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, permission_guard_1.RequirePermission)('notification:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, permission_guard_1.RequirePermission)('notification:read'),
    __param(0, (0, common_1.Query)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationStats", null);
__decorate([
    (0, common_1.Post)('send-alert'),
    (0, permission_guard_1.RequirePermission)('notification:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendAlertNotification", null);
__decorate([
    (0, common_1.Post)('send-approval'),
    (0, permission_guard_1.RequirePermission)('notification:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendApprovalNotification", null);
__decorate([
    (0, common_1.Post)('send-task'),
    (0, permission_guard_1.RequirePermission)('notification:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendTaskNotification", null);
__decorate([
    (0, common_1.Get)('records'),
    (0, permission_guard_1.RequirePermission)('notification:read'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationRecords", null);
__decorate([
    (0, common_1.Get)('records/:id'),
    (0, permission_guard_1.RequirePermission)('notification:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationRecord", null);
__decorate([
    (0, common_1.Post)('records/create'),
    (0, permission_guard_1.RequirePermission)('notification:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "createNotificationRecord", null);
__decorate([
    (0, common_1.Post)('records/:id/update-status'),
    (0, permission_guard_1.RequirePermission)('notification:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updateNotificationRecordStatus", null);
__decorate([
    (0, common_1.Get)('records/stats'),
    (0, permission_guard_1.RequirePermission)('notification:read'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotificationRecordStats", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('api/notification'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map