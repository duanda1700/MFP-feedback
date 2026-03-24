import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../database/entities/role.entity';
import { Permission } from '../database/entities/permission.entity';
import { RolePermission } from '../database/entities/role-permission.entity';
import { UserRole } from '../database/entities/user-role.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission) private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
  ) {}

  async getRoleList() {
    return this.roleRepository.find({
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async getRoleById(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return role;
  }

  async createRole(data: { name: string; displayName: string; description?: string }) {
    const existingRole = await this.roleRepository.findOne({ where: { name: data.name } });
    if (existingRole) {
      throw new BadRequestException('角色名称已存在');
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

  async updateRole(id: number, data: { displayName?: string; description?: string; status?: number }) {
    const role = await this.getRoleById(id);
    
    if (data.displayName) role.displayName = data.displayName;
    if (data.description !== undefined) role.description = data.description;
    if (data.status !== undefined) role.status = data.status;

    return this.roleRepository.save(role);
  }

  async deleteRole(id: number) {
    const role = await this.getRoleById(id);
    
    if (role.name === 'admin') {
      throw new BadRequestException('不能删除管理员角色');
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
    const moduleMap: Record<string, typeof permissions> = {};

    for (const permission of permissions) {
      if (!moduleMap[permission.module]) {
        moduleMap[permission.module] = [];
      }
      moduleMap[permission.module].push(permission);
    }

    return moduleMap;
  }

  async getRolePermissions(roleId: number) {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId },
      relations: ['permission'],
    });

    return rolePermissions.map(rp => rp.permissionId);
  }

  async assignPermissions(roleId: number, permissionIds: number[], createdBy?: number) {
    await this.getRoleById(roleId);

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (permissions.length !== permissionIds.length) {
      throw new BadRequestException('部分权限不存在');
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

  async getUserRoles(userId: number) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });

    return userRoles.map(ur => ur.role);
  }

  async getUserPermissions(userId: number) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
    });

    if (userRoles.length === 0) {
      return [];
    }

    const roleIds = userRoles.map(ur => ur.roleId);

    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId: In(roleIds) },
      relations: ['permission'],
    });

    const permissionCodes = new Set<string>();
    for (const rp of rolePermissions) {
      if (rp.permission) {
        permissionCodes.add(rp.permission.code);
      }
    }

    return Array.from(permissionCodes);
  }

  async checkPermission(userId: number, permissionCode: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    
    if (permissions.includes('*')) {
      return true;
    }

    return permissions.includes(permissionCode);
  }

  async assignUserRoles(userId: number, roleIds: number[], createdBy?: number) {
    await this.userRoleRepository.delete({ userId });

    if (roleIds.length === 0) {
      return { message: '用户角色已清空' };
    }

    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('部分角色不存在');
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

  async getRoleWithPermissions(roleId: number) {
    const role = await this.getRoleById(roleId);
    const permissionIds = await this.getRolePermissions(roleId);
    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    return {
      ...role,
      permissions,
    };
  }
}
