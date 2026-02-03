import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionService } from './permission.service';
import { RequirePermission } from './guards/permission.guard';

@Controller('api/permission')
@UseGuards(AuthGuard('jwt'))
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('roles')
  @RequirePermission('role:read')
  async getRoleList() {
    return this.permissionService.getRoleList();
  }

  @Get('permissions')
  @RequirePermission('permission:read')
  async getPermissionList() {
    return this.permissionService.getPermissionList();
  }

  @Post('role')
  @RequirePermission('role:create')
  async createOrUpdateRole(@Body() roleData: any) {
    return this.permissionService.createOrUpdateRole(roleData);
  }

  @Put('role/:id')
  @RequirePermission('role:update')
  async updateRole(@Param('id') id: number, @Body() roleData: any) {
    return this.permissionService.createOrUpdateRole({ ...roleData, id });
  }

  @Post('assign-permissions')
  @RequirePermission('permission:assign')
  async assignPermissions(@Body() body: { roleId: number; permissionIds: number[] }) {
    return this.permissionService.assignPermissions(body.roleId, body.permissionIds);
  }

  @Get('user-roles/:userId')
  async getUserRoles(@Param('userId') userId: number) {
    return this.permissionService.getUserRoles(userId);
  }

  @Get('role-permissions/:roleId')
  async getRolePermissions(@Param('roleId') roleId: number) {
    return this.permissionService.getRolePermissions(roleId);
  }

  @Delete('role/:id')
  @RequirePermission('role:delete')
  async deleteRole(@Param('id') id: number) {
    return this.permissionService.deleteRole(id);
  }

  @Post('check')
  async checkPermission(@Body() body: { userId: number; permissionName: string }) {
    const hasPermission = await this.permissionService.checkPermission(body.userId, body.permissionName);
    return {
      hasPermission,
    };
  }
}
