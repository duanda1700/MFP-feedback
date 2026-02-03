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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const task_service_1 = require("./task.service");
const permission_guard_1 = require("../permission/guards/permission.guard");
let TaskController = class TaskController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async getTaskList(query) {
        return this.taskService.getTaskList(query);
    }
    async getTaskDetail(id) {
        return this.taskService.getTaskDetail(id);
    }
    async cancelTask(id) {
        return this.taskService.cancelTask(id);
    }
    async createTask(body) {
        return this.taskService.createTask(body.taskType, body.taskData, body.createdBy, body.createdName);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Get)('list'),
    (0, permission_guard_1.RequirePermission)('task:read'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskList", null);
__decorate([
    (0, common_1.Get)('detail/:id'),
    (0, permission_guard_1.RequirePermission)('task:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskDetail", null);
__decorate([
    (0, common_1.Post)('cancel/:id'),
    (0, permission_guard_1.RequirePermission)('task:cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "cancelTask", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, permission_guard_1.RequirePermission)('task:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('api/task'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
//# sourceMappingURL=task.controller.js.map