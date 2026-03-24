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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = exports.PermissionGuard = exports.PERMISSION_KEY = void 0;
exports.RequirePermission = RequirePermission;
exports.RequirePermissions = RequirePermissions;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permission_service_1 = require("../permission.service");
exports.PERMISSION_KEY = 'permission';
function RequirePermission(permission) {
    return (0, common_1.SetMetadata)(exports.PERMISSION_KEY, permission);
}
let PermissionGuard = class PermissionGuard {
    reflector;
    permissionService;
    constructor(reflector, permissionService) {
        this.reflector = reflector;
        this.permissionService = permissionService;
    }
    async canActivate(context) {
        const requiredPermission = this.reflector.getAllAndOverride(exports.PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermission) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('用户未认证');
        }
        const userId = user.userId || user.sub || user.id;
        if (!userId) {
            throw new common_1.ForbiddenException('用户信息无效');
        }
        const hasPermission = await this.permissionService.checkPermission(userId, requiredPermission);
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`您没有权限执行此操作: ${requiredPermission}`);
        }
        return true;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        permission_service_1.PermissionService])
], PermissionGuard);
function RequirePermissions(...permissions) {
    return (0, common_1.SetMetadata)(exports.PERMISSION_KEY, permissions);
}
let PermissionsGuard = class PermissionsGuard {
    reflector;
    permissionService;
    constructor(reflector, permissionService) {
        this.reflector = reflector;
        this.permissionService = permissionService;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(exports.PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('用户未认证');
        }
        const userId = user.userId || user.sub || user.id;
        if (!userId) {
            throw new common_1.ForbiddenException('用户信息无效');
        }
        const userPermissions = await this.permissionService.getUserPermissions(userId);
        const hasAllPermissions = requiredPermissions.every((p) => userPermissions.includes(p));
        if (!hasAllPermissions) {
            throw new common_1.ForbiddenException('您没有足够的权限执行此操作');
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        permission_service_1.PermissionService])
], PermissionsGuard);
//# sourceMappingURL=permission.guard.js.map