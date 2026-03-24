import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoTaskService } from './todo-task.service';
import type { QueryTodoTaskDto } from './todo-task.service';
import { TodoTaskStatus, TodoTaskPriority, TodoTaskType } from '../database/entities/todo-task.entity';
import { RequirePermission } from '../permission/guards/permission.guard';

@Controller('api/todo')
@UseGuards(AuthGuard('jwt'))
export class TodoTaskController {
  constructor(private readonly todoTaskService: TodoTaskService) {}

  @Get('list')
  @RequirePermission('todo:read')
  async getTaskList(@Query() query: QueryTodoTaskDto) {
    return this.todoTaskService.getTaskList(query);
  }

  @Get('my')
  @RequirePermission('todo:read')
  async getMyTasks(@Request() req: any, @Query() query: QueryTodoTaskDto) {
    const userId = req.user?.userId;
    return this.todoTaskService.getMyTasks(userId, query);
  }

  @Get('statistics')
  @RequirePermission('todo:read')
  async getStatistics(@Request() req: any, @Query('userId') userId?: number) {
    const currentUserId = req.user?.userId;
    return this.todoTaskService.getTaskStatistics(userId || currentUserId);
  }

  @Get('overdue')
  @RequirePermission('todo:read')
  async getOverdueTasks(@Request() req: any, @Query('userId') userId?: number) {
    const currentUserId = req.user?.userId;
    return this.todoTaskService.getOverdueTasks(userId || currentUserId);
  }

  @Get(':id')
  @RequirePermission('todo:read')
  async getTaskById(@Param('id') id: number) {
    return this.todoTaskService.getTaskById(id);
  }

  @Get('related/:type/:id')
  @RequirePermission('todo:read')
  async getTasksByRelatedId(
    @Param('type') relatedType: string,
    @Param('id') relatedId: string,
  ) {
    return this.todoTaskService.getTasksByRelatedId(relatedType, relatedId);
  }

  @Post('create')
  @RequirePermission('todo:handle')
  async createTask(@Body() body: {
    taskType: TodoTaskType;
    title: string;
    content?: string;
    priority?: TodoTaskPriority;
    assigneeId: number;
    assigneeName: string;
    relatedType?: string;
    relatedId?: string;
    relatedData?: any;
    dueDate?: string;
  }, @Request() req: any) {
    const userId = req.user?.userId;
    const userName = req.user?.name || req.user?.username;

    return this.todoTaskService.createTask({
      ...body,
      creatorId: userId,
      creatorName: userName,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    });
  }

  @Put(':id/start')
  @RequirePermission('todo:handle')
  async startTask(@Param('id') id: number) {
    return this.todoTaskService.startTask(id);
  }

  @Put(':id/complete')
  @RequirePermission('todo:handle')
  async completeTask(
    @Param('id') id: number,
    @Body() body: { remark?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    return this.todoTaskService.completeTask(id, userId, body.remark);
  }

  @Put(':id/cancel')
  @RequirePermission('todo:handle')
  async cancelTask(
    @Param('id') id: number,
    @Body() body: { remark?: string },
  ) {
    return this.todoTaskService.cancelTask(id, body.remark);
  }

  @Put(':id/status')
  @RequirePermission('todo:handle')
  async updateStatus(
    @Param('id') id: number,
    @Body() body: { status: TodoTaskStatus; remark?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    return this.todoTaskService.updateTaskStatus(id, body.status, userId, body.remark);
  }

  @Post('batch/complete')
  @RequirePermission('todo:handle')
  async batchComplete(
    @Body() body: { ids: number[]; remark?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    return this.todoTaskService.batchComplete(body.ids, userId, body.remark);
  }
}
