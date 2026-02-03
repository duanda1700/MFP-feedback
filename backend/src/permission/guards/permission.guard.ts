import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PermissionService } from '../permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const permission = context.getHandler()['permission'];

    if (!permission) {
      return true;
    }

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    return this.permissionService.checkPermission(user.id, permission);
  }
}

// 权限装饰器
export function RequirePermission(permission: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value['permission'] = permission;
    return descriptor;
  };
}
