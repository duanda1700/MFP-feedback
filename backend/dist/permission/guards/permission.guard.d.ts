import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PermissionService } from '../permission.service';
export declare class PermissionGuard implements CanActivate {
    private permissionService;
    constructor(permissionService: PermissionService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export declare function RequirePermission(permission: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
