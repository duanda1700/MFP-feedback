import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { RequirePermission } from '../permission/guards/permission.guard';

@Controller('api/task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('list')
  @RequirePermission('task:read')
  async getTaskList(@Query() query: any) {
    return this.taskService.getTaskList(query);
  }

  @Get('count')
  @RequirePermission('task:read')
  async getTaskCount(@Query() query: any) {
    return this.taskService.getTaskCount(query);
  }

  @Get('detail/:id')
  @RequirePermission('task:read')
  async getTaskDetail(@Param('id') id: string) {
    return this.taskService.getTaskDetail(id);
  }

  @Post('cancel/:id')
  @RequirePermission('task:cancel')
  async cancelTask(@Param('id') id: string) {
    return this.taskService.cancelTask(id);
  }

  @Post('create')
  @RequirePermission('task:create')
  async createTask(@Body() body: {
    taskType: string;
    taskData: any;
    createdBy: number;
    createdName: string;
  }) {
    return this.taskService.createTask(
      body.taskType,
      body.taskData,
      body.createdBy,
      body.createdName,
    );
  }
}
