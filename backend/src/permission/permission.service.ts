import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../database/entities/role-permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(RolePermission) private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  // 预设权限列表
  private predefinedPermissions = [
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

  // 预设角色列表
  private predefinedRoles = [
    { id: 1, name: 'admin', description: '管理员' },
    { id: 2, name: 'purchase', description: '采购主管' },
    { id: 3, name: 'supplier', description: '供应商' },
    { id: 4, name: 'production', description: '生产计划员' },
    { id: 5, name: 'quality', description: '质量检查员' },
  ];

  // 获取角色列表
  async getRoleList() {
    // 这里应该从数据库获取角色列表
    // 暂时返回预设角色
    return this.predefinedRoles;
  }

  // 获取权限列表
  async getPermissionList() {
    // 这里应该从数据库获取权限列表
    // 暂时返回预设权限
    return this.predefinedPermissions;
  }

  // 创建/更新角色
  async createOrUpdateRole(roleData: any) {
    // 这里应该实现创建或更新角色的逻辑
    // 暂时返回模拟数据
    if (roleData.id) {
      const existingRole = this.predefinedRoles.find(role => role.id === roleData.id);
      if (existingRole) {
        Object.assign(existingRole, roleData);
        return existingRole;
      }
      throw new NotFoundException('Role not found');
    } else {
      const newRole = {
        id: this.predefinedRoles.length + 1,
        ...roleData,
      };
      this.predefinedRoles.push(newRole);
      return newRole;
    }
  }

  // 分配权限
  async assignPermissions(roleId: number, permissionIds: number[]) {
    // 这里应该实现分配权限的逻辑
    // 暂时返回模拟数据
    const role = this.predefinedRoles.find(r => r.id === roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const assignedPermissions = this.predefinedPermissions.filter(p => permissionIds.includes(p.id));

    // 这里应该更新数据库中的角色权限关系
    // 暂时返回模拟数据
    return {
      roleId,
      roleName: role.name,
      assignedPermissions,
      message: 'Permissions assigned successfully',
    };
  }

  // 检查用户是否有指定权限
  async checkPermission(userId: number, permissionName: string) {
    // 这里应该实现检查用户权限的逻辑
    // 暂时返回模拟数据
    // 管理员拥有所有权限
    if (userId === 1) {
      return true;
    }

    // 暂时模拟权限检查
    const userRoles = [1]; // 假设用户拥有管理员角色
    const rolePermissions = {
      1: ['*'], // 管理员拥有所有权限
      2: ['order:read', 'order:create', 'order:update'], // 采购主管权限
      3: ['feedback:read', 'feedback:create'], // 供应商权限
      4: ['plan:read', 'plan:create', 'plan:update'], // 生产计划员权限
      5: ['quality:read', 'quality:update'], // 质量检查员权限
    };

    for (const roleId of userRoles) {
      const permissions = rolePermissions[roleId];
      if (permissions && (permissions.includes('*') || permissions.includes(permissionName))) {
        return true;
      }
    }

    return false;
  }

  // 获取用户角色
  async getUserRoles(userId: number) {
    // 这里应该实现获取用户角色的逻辑
    // 暂时返回模拟数据
    return [
      { id: 1, name: 'admin', description: '管理员' },
    ];
  }

  // 获取角色权限
  async getRolePermissions(roleId: number) {
    // 这里应该实现获取角色权限的逻辑
    // 暂时返回模拟数据
    const role = this.predefinedRoles.find(r => r.id === roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const rolePermissionsMap = {
      1: this.predefinedPermissions, // 管理员拥有所有权限
      2: this.predefinedPermissions.filter(p => p.name.startsWith('order:')), // 采购主管权限
      3: this.predefinedPermissions.filter(p => p.name.startsWith('feedback:')), // 供应商权限
      4: this.predefinedPermissions.filter(p => p.name.startsWith('plan:')), // 生产计划员权限
      5: this.predefinedPermissions.filter(p => p.name.startsWith('quality:')), // 质量检查员权限
    };

    return rolePermissionsMap[roleId] || [];
  }

  // 删除角色
  async deleteRole(roleId: number) {
    // 这里应该实现删除角色的逻辑
    // 暂时返回模拟数据
    const roleIndex = this.predefinedRoles.findIndex(role => role.id === roleId);
    if (roleIndex === -1) {
      throw new NotFoundException('Role not found');
    }

    this.predefinedRoles.splice(roleIndex, 1);
    return { message: 'Role deleted successfully' };
  }
}
