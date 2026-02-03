import { PermissionService } from './permission.service';
export declare class PermissionController {
    private permissionService;
    constructor(permissionService: PermissionService);
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
    updateRole(id: number, roleData: any): Promise<any>;
    assignPermissions(body: {
        roleId: number;
        permissionIds: number[];
    }): Promise<{
        roleId: number;
        roleName: string;
        assignedPermissions: {
            id: number;
            name: string;
            description: string;
        }[];
        message: string;
    }>;
    getUserRoles(userId: number): Promise<{
        id: number;
        name: string;
        description: string;
    }[]>;
    getRolePermissions(roleId: number): Promise<any>;
    deleteRole(id: number): Promise<{
        message: string;
    }>;
    checkPermission(body: {
        userId: number;
        permissionName: string;
    }): Promise<{
        hasPermission: boolean;
    }>;
}
