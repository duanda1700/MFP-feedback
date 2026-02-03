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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_permission_entity_1 = require("../database/entities/role-permission.entity");
let PermissionService = class PermissionService {
    rolePermissionRepository;
    constructor(rolePermissionRepository) {
        this.rolePermissionRepository = rolePermissionRepository;
    }
    predefinedPermissions = [
        { id: 1, name: 'user:read', description: '查看用户' },
        { id: 2, name: 'user:create', description: '创建用户' },
        { id: 3, name: 'user:update', description: '更新用户' },
        { id: 4, name: 'user:delete', description: '删除用户' },
        { id: 5, name: 'order:read', description: '查看订单' },
        { id: 6, name: 'order:create', description: '创建订单' },
        { id: 7, name: 'order:update', description: '更新订单' },
        { id: 8, name: 'order:delete', description: '删除订单' },
        { id: 9, name: 'plan:read', description: '查看计划' },
        { id: 10, name: 'plan:create', description: '创建计划' },
        { id: 11, name: 'plan:update', description: '更新计划' },
        { id: 12, name: 'plan:delete', description: '删除计划' },
        { id: 13, name: 'feedback:read', description: '查看反馈' },
        { id: 14, name: 'feedback:create', description: '创建反馈' },
        { id: 15, name: 'feedback:update', description: '更新反馈' },
        { id: 16, name: 'feedback:delete', description: '删除反馈' },
        { id: 17, name: 'role:read', description: '查看角色' },
        { id: 18, name: 'role:create', description: '创建角色' },
        { id: 19, name: 'role:update', description: '更新角色' },
        { id: 20, name: 'role:delete', description: '删除角色' },
        { id: 21, name: 'permission:read', description: '查看权限' },
        { id: 22, name: 'permission:assign', description: '分配权限' },
        { id: 23, name: 'backup:manage', description: '管理备份' },
        { id: 24, name: 'performance:manage', description: '管理性能' },
    ];
    predefinedRoles = [
        { id: 1, name: 'admin', description: '管理员' },
        { id: 2, name: 'purchase', description: '采购主管' },
        { id: 3, name: 'supplier', description: '供应商' },
        { id: 4, name: 'production', description: '生产计划员' },
        { id: 5, name: 'quality', description: '质量检查员' },
    ];
    async getRoleList() {
        return this.predefinedRoles;
    }
    async getPermissionList() {
        return this.predefinedPermissions;
    }
    async createOrUpdateRole(roleData) {
        if (roleData.id) {
            const existingRole = this.predefinedRoles.find(role => role.id === roleData.id);
            if (existingRole) {
                Object.assign(existingRole, roleData);
                return existingRole;
            }
            throw new common_1.NotFoundException('Role not found');
        }
        else {
            const newRole = {
                id: this.predefinedRoles.length + 1,
                ...roleData,
            };
            this.predefinedRoles.push(newRole);
            return newRole;
        }
    }
    async assignPermissions(roleId, permissionIds) {
        const role = this.predefinedRoles.find(r => r.id === roleId);
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const assignedPermissions = this.predefinedPermissions.filter(p => permissionIds.includes(p.id));
        return {
            roleId,
            roleName: role.name,
            assignedPermissions,
            message: 'Permissions assigned successfully',
        };
    }
    async checkPermission(userId, permissionName) {
        if (userId === 1) {
            return true;
        }
        const userRoles = [1];
        const rolePermissions = {
            1: ['*'],
            2: ['order:read', 'order:create', 'order:update'],
            3: ['feedback:read', 'feedback:create'],
            4: ['plan:read', 'plan:create', 'plan:update'],
            5: ['quality:read', 'quality:update'],
        };
        for (const roleId of userRoles) {
            const permissions = rolePermissions[roleId];
            if (permissions && (permissions.includes('*') || permissions.includes(permissionName))) {
                return true;
            }
        }
        return false;
    }
    async getUserRoles(userId) {
        return [
            { id: 1, name: 'admin', description: '管理员' },
        ];
    }
    async getRolePermissions(roleId) {
        const role = this.predefinedRoles.find(r => r.id === roleId);
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const rolePermissionsMap = {
            1: this.predefinedPermissions,
            2: this.predefinedPermissions.filter(p => p.name.startsWith('order:')),
            3: this.predefinedPermissions.filter(p => p.name.startsWith('feedback:')),
            4: this.predefinedPermissions.filter(p => p.name.startsWith('plan:')),
            5: this.predefinedPermissions.filter(p => p.name.startsWith('quality:')),
        };
        return rolePermissionsMap[roleId] || [];
    }
    async deleteRole(roleId) {
        const roleIndex = this.predefinedRoles.findIndex(role => role.id === roleId);
        if (roleIndex === -1) {
            throw new common_1.NotFoundException('Role not found');
        }
        this.predefinedRoles.splice(roleIndex, 1);
        return { message: 'Role deleted successfully' };
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionService);
//# sourceMappingURL=permission.service.js.map