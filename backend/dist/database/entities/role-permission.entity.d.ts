import { Permission } from './permission.entity';
import { Role } from './role.entity';
export declare class RolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    createdBy: number;
    createTime: Date;
    updateTime: Date;
    role: Role;
    permission: Permission;
}
