import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission.service';
export declare const PERMISSION_KEY = "permission";
export declare function RequirePermission(permission: string): import("@nestjs/common").CustomDecorator<string>;
export declare class PermissionGuard implements CanActivate {
    private reflector;
    private permissionService;
    constructor(reflector: Reflector, permissionService: PermissionService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare function RequirePermissions(...permissions: string[]): import("@nestjs/common").CustomDecorator<string>;
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private permissionService;
    constructor(reflector: Reflector, permissionService: PermissionService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
