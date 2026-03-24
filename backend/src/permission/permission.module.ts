import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionGuard, PermissionsGuard } from './guards/permission.guard';
import { Role } from '../database/entities/role.entity';
import { Permission } from '../database/entities/permission.entity';
import { RolePermission } from '../database/entities/role-permission.entity';
import { UserRole } from '../database/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole])],
  providers: [PermissionService, PermissionGuard, PermissionsGuard],
  controllers: [PermissionController],
  exports: [PermissionService, PermissionGuard, PermissionsGuard],
})
export class PermissionModule {}
