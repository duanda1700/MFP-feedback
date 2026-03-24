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
exports.PermissionController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const permission_service_1 = require("./permission.service");
let PermissionController = class PermissionController {
    permissionService;
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    async getRoleList() {
        return this.permissionService.getRoleList();
    }
    async getRoleById(id) {
        return this.permissionService.getRoleById(id);
    }
    async getRoleWithPermissions(id) {
        return this.permissionService.getRoleWithPermissions(id);
    }
    async createRole(body) {
        return this.permissionService.createRole(body);
    }
    async updateRole(id, body) {
        return this.permissionService.updateRole(id, body);
    }
    async deleteRole(id) {
        return this.permissionService.deleteRole(id);
    }
    async getPermissionList() {
        return this.permissionService.getPermissionList();
    }
    async getPermissionsByModule() {
        return this.permissionService.getPermissionsByModule();
    }
    async getRolePermissions(roleId) {
        return this.permissionService.getRolePermissions(roleId);
    }
    async assignPermissions(roleId, body, req) {
        const createdBy = req.user?.userId;
        return this.permissionService.assignPermissions(roleId, body.permissionIds, createdBy);
    }
    async getUserRoles(userId) {
        return this.permissionService.getUserRoles(userId);
    }
    async getUserPermissions(userId) {
        return this.permissionService.getUserPermissions(userId);
    }
    async assignUserRoles(userId, body, req) {
        const createdBy = req.user?.userId;
        return this.permissionService.assignUserRoles(userId, body.roleIds, createdBy);
    }
    async checkPermission(body) {
        const hasPermission = await this.permissionService.checkPermission(body.userId, body.permissionCode);
        return { hasPermission };
    }
    async getMyPermissions(req) {
        const userId = req.user?.userId;
        return this.permissionService.getUserPermissions(userId);
    }
    async getMyRoles(req) {
        const userId = req.user?.userId;
        return this.permissionService.getUserRoles(userId);
    }
};
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getRoleList", null);
__decorate([
    (0, common_1.Get)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getRoleById", null);
__decorate([
    (0, common_1.Get)('roles/:id/with-permissions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getRoleWithPermissions", null);
__decorate([
    (0, common_1.Post)('roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "createRole", null);
__decorate([
    (0, common_1.Put)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Get)('permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getPermissionList", null);
__decorate([
    (0, common_1.Get)('permissions/by-module'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getPermissionsByModule", null);
__decorate([
    (0, common_1.Get)('roles/:roleId/permissions'),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Post)('roles/:roleId/permissions'),
    __param(0, (0, common_1.Param)('roleId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Get)('users/:userId/roles'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getUserRoles", null);
__decorate([
    (0, common_1.Get)('users/:userId/permissions'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Post)('users/:userId/roles'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "assignUserRoles", null);
__decorate([
    (0, common_1.Post)('check'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.Get)('me/permissions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getMyPermissions", null);
__decorate([
    (0, common_1.Get)('me/roles'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getMyRoles", null);
exports.PermissionController = PermissionController = __decorate([
    (0, common_1.Controller)('api/permission'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [permission_service_1.PermissionService])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map