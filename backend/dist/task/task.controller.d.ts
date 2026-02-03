import { TaskService } from './task.service';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    getTaskList(query: any): Promise<{
        data: import("../database/entities/task.entity").Task[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getTaskDetail(id: string): Promise<import("../database/entities/task.entity").Task>;
    cancelTask(id: string): Promise<import("../database/entities/task.entity").Task>;
    createTask(body: {
        taskType: string;
        taskData: any;
        createdBy: number;
        createdName: string;
    }): Promise<import("../database/entities/task.entity").Task>;
}
