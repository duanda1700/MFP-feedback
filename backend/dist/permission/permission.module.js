"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const permission_service_1 = require("./permission.service");
const permission_controller_1 = require("./permission.controller");
const permission_guard_1 = require("./guards/permission.guard");
const role_entity_1 = require("../database/entities/role.entity");
const permission_entity_1 = require("../database/entities/permission.entity");
const role_permission_entity_1 = require("../database/entities/role-permission.entity");
const user_role_entity_1 = require("../database/entities/user-role.entity");
let PermissionModule = class PermissionModule {
};
exports.PermissionModule = PermissionModule;
exports.PermissionModule = PermissionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role, permission_entity_1.Permission, role_permission_entity_1.RolePermission, user_role_entity_1.UserRole])],
        providers: [permission_service_1.PermissionService, permission_guard_1.PermissionGuard, permission_guard_1.PermissionsGuard],
        controllers: [permission_controller_1.PermissionController],
        exports: [permission_service_1.PermissionService, permission_guard_1.PermissionGuard, permission_guard_1.PermissionsGuard],
    })
], PermissionModule);
//# sourceMappingURL=permission.module.js.map