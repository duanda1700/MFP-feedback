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
const role_entity_1 = require("../database/entities/role.entity");
const permission_entity_1 = require("../database/entities/permission.entity");
const role_permission_entity_1 = require("../database/entities/role-permission.entity");
const user_role_entity_1 = require("../database/entities/user-role.entity");
let PermissionService = class PermissionService {
    roleRepository;
    permissionRepository;
    rolePermissionRepository;
    userRoleRepository;
    constructor(roleRepository, permissionRepository, rolePermissionRepository, userRoleRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.userRoleRepository = userRoleRepository;
    }
    async getRoleList() {
        return this.roleRepository.find({
            order: { sortOrder: 'ASC', id: 'ASC' },
        });
    }
    async getRoleById(id) {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException('角色不存在');
        }
        return role;
    }
    async createRole(data) {
        const existingRole = await this.roleRepository.findOne({ where: { name: data.name } });
        if (existingRole) {
            throw new common_1.BadRequestException('角色名称已存在');
        }
        const role = this.roleRepository.create({
            name: data.name,
            displayName: data.displayName,
            description: data.description,
            status: 1,
            sortOrder: 0,
        });
        return this.roleRepository.save(role);
    }
    async updateRole(id, data) {
        const role = await this.getRoleById(id);
        if (data.displayName)
            role.displayName = data.displayName;
        if (data.description !== undefined)
            role.description = data.description;
        if (data.status !== undefined)
            role.status = data.status;
        return this.roleRepository.save(role);
    }
    async deleteRole(id) {
        const role = await this.getRoleById(id);
        if (role.name === 'admin') {
            throw new common_1.BadRequestException('不能删除管理员角色');
        }
        await this.rolePermissionRepository.delete({ roleId: id });
        await this.userRoleRepository.delete({ roleId: id });
        await this.roleRepository.remove(role);
        return { message: '角色删除成功' };
    }
    async getPermissionList() {
        return this.permissionRepository.find({
            order: { module: 'ASC', sortOrder: 'ASC', id: 'ASC' },
        });
    }
    async getPermissionsByModule() {
        const permissions = await this.getPermissionList();
        const moduleMap = {};
        for (const permission of permissions) {
            if (!moduleMap[permission.module]) {
                moduleMap[permission.module] = [];
            }
            moduleMap[permission.module].push(permission);
        }
        return moduleMap;
    }
    async getRolePermissions(roleId) {
        const rolePermissions = await this.rolePermissionRepository.find({
            where: { roleId },
            relations: ['permission'],
        });
        return rolePermissions.map(rp => rp.permissionId);
    }
    async assignPermissions(roleId, permissionIds, createdBy) {
        await this.getRoleById(roleId);
        const permissions = await this.permissionRepository.find({
            where: { id: (0, typeorm_2.In)(permissionIds) },
        });
        if (permissions.length !== permissionIds.length) {
            throw new common_1.BadRequestException('部分权限不存在');
        }
        await this.rolePermissionRepository.delete({ roleId });
        const rolePermissions = permissionIds.map(permissionId => ({
            roleId,
            permissionId,
            createdBy,
        }));
        await this.rolePermissionRepository.insert(rolePermissions);
        return {
            roleId,
            assignedCount: permissionIds.length,
            message: '权限分配成功',
        };
    }
    async getUserRoles(userId) {
        const userRoles = await this.userRoleRepository.find({
            where: { userId },
            relations: ['role'],
        });
        return userRoles.map(ur => ur.role);
    }
    async getUserPermissions(userId) {
        const userRoles = await this.userRoleRepository.find({
            where: { userId },
        });
        if (userRoles.length === 0) {
            return [];
        }
        const roleIds = userRoles.map(ur => ur.roleId);
        const rolePermissions = await this.rolePermissionRepository.find({
            where: { roleId: (0, typeorm_2.In)(roleIds) },
            relations: ['permission'],
        });
        const permissionCodes = new Set();
        for (const rp of rolePermissions) {
            if (rp.permission) {
                permissionCodes.add(rp.permission.code);
            }
        }
        return Array.from(permissionCodes);
    }
    async checkPermission(userId, permissionCode) {
        const permissions = await this.getUserPermissions(userId);
        if (permissions.includes('*')) {
            return true;
        }
        return permissions.includes(permissionCode);
    }
    async assignUserRoles(userId, roleIds, createdBy) {
        await this.userRoleRepository.delete({ userId });
        if (roleIds.length === 0) {
            return { message: '用户角色已清空' };
        }
        const roles = await this.roleRepository.find({
            where: { id: (0, typeorm_2.In)(roleIds) },
        });
        if (roles.length !== roleIds.length) {
            throw new common_1.BadRequestException('部分角色不存在');
        }
        const userRoles = roleIds.map(roleId => ({
            userId,
            roleId,
            createdBy,
        }));
        await this.userRoleRepository.insert(userRoles);
        return {
            userId,
            assignedRoles: roles.map(r => r.displayName),
            message: '用户角色分配成功',
        };
    }
    async getRoleWithPermissions(roleId) {
        const role = await this.getRoleById(roleId);
        const permissionIds = await this.getRolePermissions(roleId);
        const permissions = await this.permissionRepository.find({
            where: { id: (0, typeorm_2.In)(permissionIds) },
        });
        return {
            ...role,
            permissions,
        };
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(2, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __param(3, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionService);
//# sourceMappingURL=permission.service.js.map