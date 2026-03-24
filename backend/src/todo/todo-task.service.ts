import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TodoTask, TodoTaskType, TodoTaskStatus, TodoTaskPriority } from '../database/entities/todo-task.entity';
import { User } from '../auth/entities/user.entity';

export interface CreateTodoTaskDto {
  taskType: TodoTaskType;
  title: string;
  content?: string;
  priority?: TodoTaskPriority;
  assigneeId: number;
  assigneeName: string;
  creatorId: number;
  creatorName: string;
  relatedType?: string;
  relatedId?: string;
  relatedData?: any;
  dueDate?: Date;
}

export interface QueryTodoTaskDto {
  page?: number;
  pageSize?: number;
  taskType?: TodoTaskType;
  status?: TodoTaskStatus;
  priority?: TodoTaskPriority;
  assigneeId?: number;
  creatorId?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class TodoTaskService {
  constructor(
    @InjectRepository(TodoTask) private todoTaskRepository: Repository<TodoTask>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createTask(dto: CreateTodoTaskDto): Promise<TodoTask> {
    const task = this.todoTaskRepository.create({
      taskType: dto.taskType,
      title: dto.title,
      content: dto.content,
      priority: dto.priority || TodoTaskPriority.MEDIUM,
      status: TodoTaskStatus.PENDING,
      assigneeId: dto.assigneeId,
      assigneeName: dto.assigneeName,
      creatorId: dto.creatorId,
      creatorName: dto.creatorName,
      relatedType: dto.relatedType,
      relatedId: dto.relatedId,
      relatedData: dto.relatedData,
      dueDate: dto.dueDate,
    });

    return this.todoTaskRepository.save(task);
  }

  async getTaskList(query: QueryTodoTaskDto) {
    const {
      page = 1,
      pageSize = 10,
      taskType,
      status,
      priority,
      assigneeId,
      creatorId,
      keyword,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.todoTaskRepository.createQueryBuilder('task');

    if (taskType) {
      queryBuilder.andWhere('task.task_type = :taskType', { taskType });
    }

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (assigneeId) {
      queryBuilder.andWhere('task.assignee_id = :assigneeId', { assigneeId });
    }

    if (creatorId) {
      queryBuilder.andWhere('task.creator_id = :creatorId', { creatorId });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(task.title LIKE :keyword OR task.content LIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    if (startDate) {
      queryBuilder.andWhere('task.created_at >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('task.created_at <= :endDate', { endDate });
    }

    const [tasks, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('task.created_at', 'DESC')
      .getManyAndCount();

    return {
      data: tasks,
      total,
      page,
      pageSize,
    };
  }

  async getTaskById(id: number): Promise<TodoTask> {
    const task = await this.todoTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('待办任务不存在');
    }
    return task;
  }

  async getMyTasks(userId: number, query: QueryTodoTaskDto) {
    return this.getTaskList({ ...query, assigneeId: userId });
  }

  async getTaskStatistics(userId?: number) {
    const queryBuilder = this.todoTaskRepository.createQueryBuilder('task');

    if (userId) {
      queryBuilder.andWhere('task.assignee_id = :userId', { userId });
    }

    const [total, pending, processing, completed, highPriority] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TodoTaskStatus.PENDING }).getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TodoTaskStatus.PROCESSING }).getCount(),
      queryBuilder.clone().andWhere('task.status = :status', { status: TodoTaskStatus.COMPLETED }).getCount(),
      queryBuilder.clone().andWhere('task.priority IN (:...priorities)', { priorities: [TodoTaskPriority.HIGH, TodoTaskPriority.URGENT] })
        .andWhere('task.status != :status', { status: TodoTaskStatus.COMPLETED }).getCount(),
    ]);

    return {
      total,
      pending,
      processing,
      completed,
      highPriority,
    };
  }

  async updateTaskStatus(id: number, status: TodoTaskStatus, completedBy?: number, remark?: string): Promise<TodoTask> {
    const task = await this.getTaskById(id);

    if (task.status === TodoTaskStatus.COMPLETED) {
      throw new BadRequestException('任务已完成，无法修改状态');
    }

    if (task.status === TodoTaskStatus.CANCELLED) {
      throw new BadRequestException('任务已取消，无法修改状态');
    }

    task.status = status;

    if (status === TodoTaskStatus.COMPLETED) {
      task.completedAt = new Date();
      task.completedBy = completedBy ?? null;
    }

    if (remark) {
      task.remark = remark;
    }

    return this.todoTaskRepository.save(task);
  }

  async completeTask(id: number, completedBy: number, remark?: string): Promise<TodoTask> {
    return this.updateTaskStatus(id, TodoTaskStatus.COMPLETED, completedBy, remark);
  }

  async startTask(id: number): Promise<TodoTask> {
    return this.updateTaskStatus(id, TodoTaskStatus.PROCESSING);
  }

  async cancelTask(id: number, remark?: string): Promise<TodoTask> {
    const task = await this.getTaskById(id);

    if (task.status === TodoTaskStatus.COMPLETED) {
      throw new BadRequestException('任务已完成，无法取消');
    }

    task.status = TodoTaskStatus.CANCELLED;
    if (remark) {
      task.remark = remark;
    }

    return this.todoTaskRepository.save(task);
  }

  async batchComplete(ids: number[], completedBy: number, remark?: string): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        await this.completeTask(id, completedBy, remark);
        success++;
      } catch (error) {
        failed++;
      }
    }

    return { success, failed };
  }

  async getTasksByRelatedId(relatedType: string, relatedId: string): Promise<TodoTask[]> {
    return this.todoTaskRepository.find({
      where: { relatedType, relatedId },
      order: { createdAt: 'DESC' },
    });
  }

  async getOverdueTasks(userId?: number): Promise<TodoTask[]> {
    const queryBuilder = this.todoTaskRepository.createQueryBuilder('task')
      .where('task.status NOT IN (:...statuses)', { statuses: [TodoTaskStatus.COMPLETED, TodoTaskStatus.CANCELLED] })
      .andWhere('task.due_date IS NOT NULL')
      .andWhere('task.due_date < :now', { now: new Date() });

    if (userId) {
      queryBuilder.andWhere('task.assignee_id = :userId', { userId });
    }

    return queryBuilder.orderBy('task.due_date', 'ASC').getMany();
  }

  async createApprovalTask(params: {
    title: string;
    content?: string;
    assigneeId: number;
    assigneeName: string;
    creatorId: number;
    creatorName: string;
    relatedType: string;
    relatedId: string;
    relatedData?: any;
    dueDate?: Date;
  }): Promise<TodoTask> {
    return this.createTask({
      taskType: TodoTaskType.APPROVAL,
      title: params.title,
      content: params.content,
      priority: TodoTaskPriority.HIGH,
      assigneeId: params.assigneeId,
      assigneeName: params.assigneeName,
      creatorId: params.creatorId,
      creatorName: params.creatorName,
      relatedType: params.relatedType,
      relatedId: params.relatedId,
      relatedData: params.relatedData,
      dueDate: params.dueDate,
    });
  }

  async createAlertTask(params: {
    title: string;
    content: string;
    assigneeId: number;
    assigneeName: string;
    creatorId: number;
    creatorName: string;
    relatedType: string;
    relatedId: string;
    relatedData?: any;
    dueDate?: Date;
  }): Promise<TodoTask> {
    return this.createTask({
      taskType: TodoTaskType.ALERT_HANDLE,
      title: params.title,
      content: params.content,
      priority: TodoTaskPriority.URGENT,
      assigneeId: params.assigneeId,
      assigneeName: params.assigneeName,
      creatorId: params.creatorId,
      creatorName: params.creatorName,
      relatedType: params.relatedType,
      relatedId: params.relatedId,
      relatedData: params.relatedData,
      dueDate: params.dueDate,
    });
  }

  async createFeedbackTask(params: {
    title: string;
    content?: string;
    assigneeId: number;
    assigneeName: string;
    creatorId: number;
    creatorName: string;
    relatedType: string;
    relatedId: string;
    relatedData?: any;
    dueDate?: Date;
  }): Promise<TodoTask> {
    return this.createTask({
      taskType: TodoTaskType.PROGRESS_FEEDBACK,
      title: params.title,
      content: params.content,
      priority: TodoTaskPriority.MEDIUM,
      assigneeId: params.assigneeId,
      assigneeName: params.assigneeName,
      creatorId: params.creatorId,
      creatorName: params.creatorName,
      relatedType: params.relatedType,
      relatedId: params.relatedId,
      relatedData: params.relatedData,
      dueDate: params.dueDate,
    });
  }
}
