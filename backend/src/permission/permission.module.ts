import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { RolePermission } from '../database/entities/role-permission.entity';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  providers: [PermissionService, PermissionGuard],
  controllers: [PermissionController],
  exports: [PermissionService, PermissionGuard],
})
export class PermissionModule {}
