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
exports.Alert = void 0;
const typeorm_1 = require("typeorm");
let Alert = class Alert {
    id;
    alertType;
    alertLevel;
    alertContent;
    relatedTaskId;
    relatedTaskType;
    alertStatus;
    createBy;
    createName;
    processBy;
    processName;
    processTime;
    closeTime;
    createTime;
    updateTime;
    remarks;
};
exports.Alert = Alert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Alert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alert_type', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Alert.prototype, "alertType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alert_level', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Alert.prototype, "alertLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alert_content', type: 'text', nullable: false }),
    __metadata("design:type", String)
], Alert.prototype, "alertContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_task_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Alert.prototype, "relatedTaskId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_task_type', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Alert.prototype, "relatedTaskType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alert_status', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Alert.prototype, "alertStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'create_by', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Alert.prototype, "createBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'create_name', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Alert.prototype, "createName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'process_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Alert.prototype, "processBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'process_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Alert.prototype, "processName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'process_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Alert.prototype, "processTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'close_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Alert.prototype, "closeTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], Alert.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], Alert.prototype, "updateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Alert.prototype, "remarks", void 0);
exports.Alert = Alert = __decorate([
    (0, typeorm_1.Entity)('ALERT')
], Alert);
//# sourceMappingURL=alert.entity.js.map