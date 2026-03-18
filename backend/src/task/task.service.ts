import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../database/entities/task.entity';
import { NotificationService } from '../integration/notification/notification.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private readonly taskQueue: any[] = [];
  private isProcessing = false;

  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private notificationService: NotificationService,
  ) {
    // 启动任务处理器
    this.startTaskProcessor();
  }

  // 创建任务
  async createTask(taskType: string, taskData: any, createdBy: number, createdName: string): Promise<Task> {
    const task = this.taskRepository.create({
      taskType,
      taskStatus: 'pending',
      taskData,
      progress: 0,
      createdBy,
      createdName,
    });

    const savedTask = await this.taskRepository.save(task);
    
    // 将任务加入队列
    this.taskQueue.push(savedTask.id);
    
    return savedTask;
  }

  // 获取任务列表
  async getTaskList(query: any) {
    const {
      page = 1,
      pageSize = 10,
      taskType,
      taskStatus,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (taskType) {
      queryBuilder.andWhere('task.task_type = :taskType', { taskType });
    }

    if (taskStatus) {
      queryBuilder.andWhere('task.task_status = :taskStatus', { taskStatus });
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

  // 获取任务详情
  async getTaskDetail(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  // 获取任务数量
  async getTaskCount(query: any) {
    const { taskStatus } = query;
    
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    
    if (taskStatus) {
      queryBuilder.andWhere('task.task_status = :taskStatus', { taskStatus });
    }
    
    const count = await queryBuilder.getCount();
    
    return { count };
  }

  // 启动任务处理器
  private startTaskProcessor() {
    setInterval(async () => {
      if (!this.isProcessing && this.taskQueue.length > 0) {
        await this.processTask();
      }
    }, 1000); // 每秒检查一次队列
  }

  // 处理任务
  private async processTask() {
    this.isProcessing = true;
    
    try {
      const taskId = this.taskQueue.shift();
      if (!taskId) {
        return;
      }

      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) {
        return;
      }

      // 更新任务状态为处理中
      task.taskStatus = 'processing';
      await this.taskRepository.save(task);

      // 根据任务类型执行不同的处理逻辑
      let result;
      try {
        switch (task.taskType) {
          case 'import-plan':
            result = await this.processImportPlanTask(task);
            break;
          case 'export-report':
            result = await this.processExportReportTask(task);
            break;
          default:
            throw new Error(`Unknown task type: ${task.taskType}`);
        }

        // 更新任务状态为完成
        task.taskStatus = 'completed';
        task.resultData = result;
        task.progress = 100;
        task.completedAt = new Date();
        await this.taskRepository.save(task);

        // 发送任务完成通知
        await this.sendTaskCompletionNotification(task);
      } catch (error) {
        // 更新任务状态为失败
        task.taskStatus = 'failed';
        task.errorMessage = error.message;
        await this.taskRepository.save(task);

        this.logger.error(`Task ${taskId} failed: ${error.message}`, error);
      }
    } catch (error) {
      this.logger.error('Error processing task:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // 处理导入计划任务
  private async processImportPlanTask(task: Task): Promise<any> {
    // 模拟导入计划处理
    const { planDataList } = task.taskData;
    const total = planDataList.length;
    
    for (let i = 0; i < total; i++) {
      // 模拟处理每个计划
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 更新进度
      const progress = Math.round(((i + 1) / total) * 100);
      task.progress = progress;
      await this.taskRepository.save(task);
    }

    return {
      importedCount: total,
      message: 'Plan import completed successfully',
    };
  }

  // 处理导出报表任务
  private async processExportReportTask(task: Task): Promise<any> {
    // 模拟导出报表处理
    await new Promise(resolve => setTimeout(resolve, 5000)); // 模拟5秒的处理时间
    
    return {
      fileName: `report_${Date.now()}.xlsx`,
      downloadUrl: `/api/analytics/download-report?file=report_${Date.now()}.xlsx`,
      message: 'Report export completed successfully',
    };
  }

  // 发送任务完成通知
  private async sendTaskCompletionNotification(task: Task): Promise<void> {
    const recipients = [task.createdBy.toString()];
    const taskType = this.getTaskTypeName(task.taskType);
    const message = `您的${taskType}任务已完成，任务ID: ${task.id}`;

    await this.notificationService.sendTaskNotification(
      recipients,
      taskType,
      message,
    );
  }

  // 获取任务类型的中文名称
  private getTaskTypeName(taskType: string): string {
    const typeMap: Record<string, string> = {
      'import-plan': '导入计划',
      'export-report': '导出报表',
    };
    return typeMap[taskType] || taskType;
  }

  // 取消任务
  async cancelTask(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.taskStatus === 'completed' || task.taskStatus === 'failed') {
      throw new Error('Cannot cancel completed or failed task');
    }

    task.taskStatus = 'cancelled';
    return this.taskRepository.save(task);
  }
}
