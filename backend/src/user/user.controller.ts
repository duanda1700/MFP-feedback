import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('api/user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserList(
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ) {
    return this.userService.getUserList({
      keyword,
      status: status ? parseInt(status) : undefined,
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
    });
  }

  @Get('me')
  async getCurrentUser(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.userService.getUserById(userId);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(
    @Body()
    body: {
      username: string;
      password: string;
      name: string;
      email?: string;
      phone?: string;
      department?: string;
      supplierId?: number;
      roleIds?: number[];
    }
  ) {
    return this.userService.createUser(body);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body()
    body: {
      name?: string;
      email?: string;
      phone?: string;
      department?: string;
      supplierId?: number;
      status?: number;
    }
  ) {
    return this.userService.updateUser(id, body);
  }

  @Put(':id/password')
  async updatePassword(
    @Param('id') id: number,
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    return this.userService.updatePassword(id, body.oldPassword, body.newPassword);
  }

  @Put(':id/reset-password')
  async resetPassword(@Param('id') id: number, @Body() body: { newPassword: string }) {
    return this.userService.resetPassword(id, body.newPassword);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Post(':id/roles')
  async assignUserRoles(@Param('id') id: number, @Body() body: { roleIds: number[] }) {
    return this.userService.assignUserRoles(id, body.roleIds);
  }
}
