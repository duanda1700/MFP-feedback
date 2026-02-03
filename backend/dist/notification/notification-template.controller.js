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
exports.NotificationTemplateController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const notification_template_service_1 = require("./notification-template.service");
const permission_guard_1 = require("../permission/guards/permission.guard");
let NotificationTemplateController = class NotificationTemplateController {
    templateService;
    constructor(templateService) {
        this.templateService = templateService;
    }
    async getTemplateList(query) {
        return this.templateService.getTemplateList(query);
    }
    async getTemplateDetail(id) {
        return this.templateService.getTemplateDetail(id);
    }
    async getDefaultTemplate(templateType) {
        return this.templateService.getDefaultTemplate(templateType);
    }
    async createTemplate(body) {
        return this.templateService.createTemplate(body);
    }
    async updateTemplate(id, body) {
        return this.templateService.updateTemplate(id, body);
    }
    async deleteTemplate(id) {
        return this.templateService.deleteTemplate(id);
    }
    async toggleTemplateStatus(id, status) {
        return this.templateService.toggleTemplateStatus(id, status);
    }
    async renderTemplate(id, variables) {
        return this.templateService.renderTemplate(id, variables);
    }
    async initializeDefaultTemplates() {
        await this.templateService.initializeDefaultTemplates();
        return { message: 'Default templates initialized successfully' };
    }
};
exports.NotificationTemplateController = NotificationTemplateController;
__decorate([
    (0, common_1.Get)('list'),
    (0, permission_guard_1.RequirePermission)('notification:template:read'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "getTemplateList", null);
__decorate([
    (0, common_1.Get)('detail/:id'),
    (0, permission_guard_1.RequirePermission)('notification:template:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "getTemplateDetail", null);
__decorate([
    (0, common_1.Get)('default/:type'),
    (0, permission_guard_1.RequirePermission)('notification:template:read'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "getDefaultTemplate", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, permission_guard_1.RequirePermission)('notification:template:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Post)('update/:id'),
    (0, permission_guard_1.RequirePermission)('notification:template:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Post)('delete/:id'),
    (0, permission_guard_1.RequirePermission)('notification:template:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('toggle-status/:id'),
    (0, permission_guard_1.RequirePermission)('notification:template:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "toggleTemplateStatus", null);
__decorate([
    (0, common_1.Post)('render/:id'),
    (0, permission_guard_1.RequirePermission)('notification:template:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('variables')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "renderTemplate", null);
__decorate([
    (0, common_1.Post)('initialize-defaults'),
    (0, permission_guard_1.RequirePermission)('notification:template:create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationTemplateController.prototype, "initializeDefaultTemplates", null);
exports.NotificationTemplateController = NotificationTemplateController = __decorate([
    (0, common_1.Controller)('api/notification/template'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [notification_template_service_1.NotificationTemplateService])
], NotificationTemplateController);
//# sourceMappingURL=notification-template.controller.js.map