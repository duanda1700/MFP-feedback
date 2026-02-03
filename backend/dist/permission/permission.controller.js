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
const permission_guard_1 = require("./guards/permission.guard");
let PermissionController = class PermissionController {
    permissionService;
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    async getRoleList() {
        return this.permissionService.getRoleList();
    }
    async getPermissionList() {
        return this.permissionService.getPermissionList();
    }
    async createOrUpdateRole(roleData) {
        return this.permissionService.createOrUpdateRole(roleData);
    }
    async updateRole(id, roleData) {
        return this.permissionService.createOrUpdateRole({ ...roleData, id });
    }
    async assignPermissions(body) {
        return this.permissionService.assignPermissions(body.roleId, body.permissionIds);
    }
    async getUserRoles(userId) {
        return this.permissionService.getUserRoles(userId);
    }
    async getRolePermissions(roleId) {
        return this.permissionService.getRolePermissions(roleId);
    }
    async deleteRole(id) {
        return this.permissionService.deleteRole(id);
    }
    async checkPermission(body) {
        const hasPermission = await this.permissionService.checkPermission(body.userId, body.permissionName);
        return {
            hasPermission,
        };
    }
};
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Get)('roles'),
    (0, permission_guard_1.RequirePermission)('role:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getRoleList", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, permission_guard_1.RequirePermission)('permission:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getPermissionList", null);
__decorate([
    (0, common_1.Post)('role'),
    (0, permission_guard_1.RequirePermission)('role:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "createOrUpdateRole", null);
__decorate([
    (0, common_1.Put)('role/:id'),
    (0, permission_guard_1.RequirePermission)('role:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Post)('assign-permissions'),
    (0, permission_guard_1.RequirePermission)('permission:assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Get)('user-roles/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getUserRoles", null);
__decorate([
    (0, common_1.Get)('role-permissions/:roleId'),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Delete)('role/:id'),
    (0, permission_guard_1.RequirePermission)('role:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.Post)('check'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "checkPermission", null);
exports.PermissionController = PermissionController = __decorate([
    (0, common_1.Controller)('api/permission'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [permission_service_1.PermissionService])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map