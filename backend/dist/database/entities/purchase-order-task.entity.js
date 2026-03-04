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
exports.PurchaseOrderTask = void 0;
const typeorm_1 = require("typeorm");
let PurchaseOrderTask = class PurchaseOrderTask {
    id;
    orderId;
    supplierId;
    taskStatus;
    issueDesc;
    planCompleteTime;
    createTime;
    updateTime;
};
exports.PurchaseOrderTask = PurchaseOrderTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseOrderTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], PurchaseOrderTask.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], PurchaseOrderTask.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_status', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PurchaseOrderTask.prototype, "taskStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_desc', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseOrderTask.prototype, "issueDesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_complete_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], PurchaseOrderTask.prototype, "planCompleteTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], PurchaseOrderTask.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], PurchaseOrderTask.prototype, "updateTime", void 0);
exports.PurchaseOrderTask = PurchaseOrderTask = __decorate([
    (0, typeorm_1.Entity)('purchase_order_task')
], PurchaseOrderTask);
//# sourceMappingURL=purchase-order-task.entity.js.map