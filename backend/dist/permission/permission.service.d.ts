import { Repository } from 'typeorm';
import { RolePermission } from '../database/entities/role-permission.entity';
export declare class PermissionService {
    private rolePermissionRepository;
    constructor(rolePermissionRepository: Repository<RolePermission>);
    private predefinedPermissions;
    private predefinedRoles;
    getRoleList(): Promise<{
        id: number;
        name: string;
        description: string;
    }[]>;
    getPermissionList(): Promise<{
        id: number;
        name: string;
        description: string;
    }[]>;
    createOrUpdateRole(roleData: any): Promise<any>;
    assignPermissions(roleId: number, permissionIds: number[]): Promise<{
        roleId: number;
        roleName: string;
        assignedPermissions: {
            id: number;
            name: string;
            description: string;
        }[];
        message: string;
    }>;
    checkPermission(userId: number, permissionName: string): Promise<boolean>;
    getUserRoles(userId: number): Promise<{
        id: number;
        name: string;
        description: string;
    }[]>;
    getRolePermissions(roleId: number): Promise<any>;
    deleteRole(roleId: number): Promise<{
        message: string;
    }>;
}
