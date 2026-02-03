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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const typeorm_1 = require("typeorm");
let Task = class Task {
    id;
    taskType;
    taskStatus;
    taskData;
    resultData;
    errorMessage;
    progress;
    createdBy;
    createdName;
    completedAt;
    createdAt;
    updatedAt;
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_type', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Task.prototype, "taskType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_status', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Task.prototype, "taskStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_data', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "taskData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'result_data', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Task.prototype, "resultData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'progress', type: 'int', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Task.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_name', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Task.prototype, "createdName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)('TASK')
], Task);
//# sourceMappingURL=task.entity.js.map