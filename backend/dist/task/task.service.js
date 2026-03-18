"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("../database/entities/task.entity");
const notification_service_1 = require("../integration/notification/notification.service");
let TaskService = TaskService_1 = class TaskService {
    taskRepository;
    notificationService;
    logger = new common_1.Logger(TaskService_1.name);
    taskQueue = [];
    isProcessing = false;
    constructor(taskRepository, notificationService) {
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
        this.startTaskProcessor();
    }
    async createTask(taskType, taskData, createdBy, createdName) {
        const task = this.taskRepository.create({
            taskType,
            taskStatus: 'pending',
            taskData,
            progress: 0,
            createdBy,
            createdName,
        });
        const savedTask = await this.taskRepository.save(task);
        this.taskQueue.push(savedTask.id);
        return savedTask;
    }
    async getTaskList(query) {
        const { page = 1, pageSize = 10, taskType, taskStatus, startDate, endDate, } = query;
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
    async getTaskDetail(id) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }
    async getTaskCount(query) {
        const { taskStatus } = query;
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        if (taskStatus) {
            queryBuilder.andWhere('task.task_status = :taskStatus', { taskStatus });
        }
        const count = await queryBuilder.getCount();
        return { count };
    }
    startTaskProcessor() {
        setInterval(async () => {
            if (!this.isProcessing && this.taskQueue.length > 0) {
                await this.processTask();
            }
        }, 1000);
    }
    async processTask() {
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
            task.taskStatus = 'processing';
            await this.taskRepository.save(task);
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
                task.taskStatus = 'completed';
                task.resultData = result;
                task.progress = 100;
                task.completedAt = new Date();
                await this.taskRepository.save(task);
                await this.sendTaskCompletionNotification(task);
            }
            catch (error) {
                task.taskStatus = 'failed';
                task.errorMessage = error.message;
                await this.taskRepository.save(task);
                this.logger.error(`Task ${taskId} failed: ${error.message}`, error);
            }
        }
        catch (error) {
            this.logger.error('Error processing task:', error);
        }
        finally {
            this.isProcessing = false;
        }
    }
    async processImportPlanTask(task) {
        const { planDataList } = task.taskData;
        const total = planDataList.length;
        for (let i = 0; i < total; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            const progress = Math.round(((i + 1) / total) * 100);
            task.progress = progress;
            await this.taskRepository.save(task);
        }
        return {
            importedCount: total,
            message: 'Plan import completed successfully',
        };
    }
    async processExportReportTask(task) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return {
            fileName: `report_${Date.now()}.xlsx`,
            downloadUrl: `/api/analytics/download-report?file=report_${Date.now()}.xlsx`,
            message: 'Report export completed successfully',
        };
    }
    async sendTaskCompletionNotification(task) {
        const recipients = [task.createdBy.toString()];
        const taskType = this.getTaskTypeName(task.taskType);
        const message = `您的${taskType}任务已完成，任务ID: ${task.id}`;
        await this.notificationService.sendTaskNotification(recipients, taskType, message);
    }
    getTaskTypeName(taskType) {
        const typeMap = {
            'import-plan': '导入计划',
            'export-report': '导出报表',
        };
        return typeMap[taskType] || taskType;
    }
    async cancelTask(id) {
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
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = TaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notification_service_1.NotificationService])
], TaskService);
//# sourceMappingURL=task.service.js.map