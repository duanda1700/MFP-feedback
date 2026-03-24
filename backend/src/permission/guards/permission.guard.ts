import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permission.service';

export const PERMISSION_KEY = 'permission';

export function RequirePermission(permission: string) {
  return SetMetadata(PERMISSION_KEY, permission);
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('用户未认证');
    }

    const userId = user.userId || user.sub || user.id;
    if (!userId) {
      throw new ForbiddenException('用户信息无效');
    }

    const hasPermission = await this.permissionService.checkPermission(userId, requiredPermission);

    if (!hasPermission) {
      throw new ForbiddenException(`您没有权限执行此操作: ${requiredPermission}`);
    }

    return true;
  }
}

export function RequirePermissions(...permissions: string[]) {
  return SetMetadata(PERMISSION_KEY, permissions);
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('用户未认证');
    }

    const userId = user.userId || user.sub || user.id;
    if (!userId) {
      throw new ForbiddenException('用户信息无效');
    }

    const userPermissions = await this.permissionService.getUserPermissions(userId);

    const hasAllPermissions = requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasAllPermissions) {
      throw new ForbiddenException('您没有足够的权限执行此操作');
    }

    return true;
  }
}
