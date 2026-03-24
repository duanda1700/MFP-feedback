import { PermissionService } from './permission.service';
export declare class PermissionController {
    private permissionService;
    constructor(permissionService: PermissionService);
    getRoleList(): Promise<import("../database/entities/role.entity").Role[]>;
    getRoleById(id: number): Promise<import("../database/entities/role.entity").Role>;
    getRoleWithPermissions(id: number): Promise<{
        permissions: import("../database/entities/permission.entity").Permission[];
        id: number;
        name: string;
        displayName: string;
        description: string;
        status: number;
        sortOrder: number;
        createTime: Date;
        updateTime: Date;
    }>;
    createRole(body: {
        name: string;
        displayName: string;
        description?: string;
    }): Promise<import("../database/entities/role.entity").Role>;
    updateRole(id: number, body: {
        displayName?: string;
        description?: string;
        status?: number;
    }): Promise<import("../database/entities/role.entity").Role>;
    deleteRole(id: number): Promise<{
        message: string;
    }>;
    getPermissionList(): Promise<import("../database/entities/permission.entity").Permission[]>;
    getPermissionsByModule(): Promise<Record<string, import("../database/entities/permission.entity").Permission[]>>;
    getRolePermissions(roleId: number): Promise<number[]>;
    assignPermissions(roleId: number, body: {
        permissionIds: number[];
    }, req: any): Promise<{
        roleId: number;
        assignedCount: number;
        message: string;
    }>;
    getUserRoles(userId: number): Promise<import("../database/entities/role.entity").Role[]>;
    getUserPermissions(userId: number): Promise<string[]>;
    assignUserRoles(userId: number, body: {
        roleIds: number[];
    }, req: any): Promise<{
        message: string;
        userId?: undefined;
        assignedRoles?: undefined;
    } | {
        userId: number;
        assignedRoles: string[];
        message: string;
    }>;
    checkPermission(body: {
        userId: number;
        permissionCode: string;
    }): Promise<{
        hasPermission: boolean;
    }>;
    getMyPermissions(req: any): Promise<string[]>;
    getMyRoles(req: any): Promise<import("../database/entities/role.entity").Role[]>;
}
