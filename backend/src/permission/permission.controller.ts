import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionService } from './permission.service';

@Controller('api/permission')
@UseGuards(AuthGuard('jwt'))
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('roles')
  async getRoleList() {
    return this.permissionService.getRoleList();
  }

  @Get('roles/:id')
  async getRoleById(@Param('id') id: number) {
    return this.permissionService.getRoleById(id);
  }

  @Get('roles/:id/with-permissions')
  async getRoleWithPermissions(@Param('id') id: number) {
    return this.permissionService.getRoleWithPermissions(id);
  }

  @Post('roles')
  async createRole(@Body() body: { name: string; displayName: string; description?: string }) {
    return this.permissionService.createRole(body);
  }

  @Put('roles/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() body: { displayName?: string; description?: string; status?: number }
  ) {
    return this.permissionService.updateRole(id, body);
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id') id: number) {
    return this.permissionService.deleteRole(id);
  }

  @Get('permissions')
  async getPermissionList() {
    return this.permissionService.getPermissionList();
  }

  @Get('permissions/by-module')
  async getPermissionsByModule() {
    return this.permissionService.getPermissionsByModule();
  }

  @Get('roles/:roleId/permissions')
  async getRolePermissions(@Param('roleId') roleId: number) {
    return this.permissionService.getRolePermissions(roleId);
  }

  @Post('roles/:roleId/permissions')
  async assignPermissions(
    @Param('roleId') roleId: number,
    @Body() body: { permissionIds: number[] },
    @Request() req: any
  ) {
    const createdBy = req.user?.userId;
    return this.permissionService.assignPermissions(roleId, body.permissionIds, createdBy);
  }

  @Get('users/:userId/roles')
  async getUserRoles(@Param('userId') userId: number) {
    return this.permissionService.getUserRoles(userId);
  }

  @Get('users/:userId/permissions')
  async getUserPermissions(@Param('userId') userId: number) {
    return this.permissionService.getUserPermissions(userId);
  }

  @Post('users/:userId/roles')
  async assignUserRoles(
    @Param('userId') userId: number,
    @Body() body: { roleIds: number[] },
    @Request() req: any
  ) {
    const createdBy = req.user?.userId;
    return this.permissionService.assignUserRoles(userId, body.roleIds, createdBy);
  }

  @Post('check')
  async checkPermission(@Body() body: { userId: number; permissionCode: string }) {
    const hasPermission = await this.permissionService.checkPermission(body.userId, body.permissionCode);
    return { hasPermission };
  }

  @Get('me/permissions')
  async getMyPermissions(@Request() req: any) {
    const userId = req.user?.userId;
    return this.permissionService.getUserPermissions(userId);
  }

  @Get('me/roles')
  async getMyRoles(@Request() req: any) {
    const userId = req.user?.userId;
    return this.permissionService.getUserRoles(userId);
  }
}
