import { Repository } from 'typeorm';
import { Role } from '../database/entities/role.entity';
import { Permission } from '../database/entities/permission.entity';
import { RolePermission } from '../database/entities/role-permission.entity';
import { UserRole } from '../database/entities/user-role.entity';
export declare class PermissionService {
    private roleRepository;
    private permissionRepository;
    private rolePermissionRepository;
    private userRoleRepository;
    constructor(roleRepository: Repository<Role>, permissionRepository: Repository<Permission>, rolePermissionRepository: Repository<RolePermission>, userRoleRepository: Repository<UserRole>);
    getRoleList(): Promise<Role[]>;
    getRoleById(id: number): Promise<Role>;
    createRole(data: {
        name: string;
        displayName: string;
        description?: string;
    }): Promise<Role>;
    updateRole(id: number, data: {
        displayName?: string;
        description?: string;
        status?: number;
    }): Promise<Role>;
    deleteRole(id: number): Promise<{
        message: string;
    }>;
    getPermissionList(): Promise<Permission[]>;
    getPermissionsByModule(): Promise<Record<string, Permission[]>>;
    getRolePermissions(roleId: number): Promise<number[]>;
    assignPermissions(roleId: number, permissionIds: number[], createdBy?: number): Promise<{
        roleId: number;
        assignedCount: number;
        message: string;
    }>;
    getUserRoles(userId: number): Promise<Role[]>;
    getUserPermissions(userId: number): Promise<string[]>;
    checkPermission(userId: number, permissionCode: string): Promise<boolean>;
    assignUserRoles(userId: number, roleIds: number[], createdBy?: number): Promise<{
        message: string;
        userId?: undefined;
        assignedRoles?: undefined;
    } | {
        userId: number;
        assignedRoles: string[];
        message: string;
    }>;
    getRoleWithPermissions(roleId: number): Promise<{
        permissions: Permission[];
        id: number;
        name: string;
        displayName: string;
        description: string;
        status: number;
        sortOrder: number;
        createTime: Date;
        updateTime: Date;
    }>;
}
