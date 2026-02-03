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
exports.PermissionGuard = void 0;
exports.RequirePermission = RequirePermission;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("../permission.service");
let PermissionGuard = class PermissionGuard {
    permissionService;
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const permission = context.getHandler()['permission'];
        if (!permission) {
            return true;
        }
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        return this.permissionService.checkPermission(user.id, permission);
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permission_service_1.PermissionService])
], PermissionGuard);
function RequirePermission(permission) {
    return function (target, propertyKey, descriptor) {
        descriptor.value['permission'] = permission;
        return descriptor;
    };
}
//# sourceMappingURL=permission.guard.js.map