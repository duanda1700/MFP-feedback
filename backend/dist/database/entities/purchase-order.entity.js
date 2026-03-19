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
exports.PurchaseOrder = void 0;
const typeorm_1 = require("typeorm");
let PurchaseOrder = class PurchaseOrder {
    id;
    bpmCgddId;
    bpmCgddInstanceId;
    djbH;
    applyUsername;
    applyUserno;
    applyDept;
    budgetNo;
    secondPlanName;
    purchaseLevel;
    actualPlanPurchaseName;
    isTemporaryEmergency;
    purchaseTaskType;
    major;
    project;
    version;
    versionControlType;
    orderStatus;
    feedbackStatus;
    setCount;
    supplierCode;
    supplierName;
    supplierId;
    purchaseManager;
    createTime;
    updateTime;
};
exports.PurchaseOrder = PurchaseOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bpm_cgdd_id', type: 'bigint', nullable: false }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "bpmCgddId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bpm_cgdd_instance_id', type: 'bigint', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "bpmCgddInstanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'djbH', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "djbH", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apply_username', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "applyUsername", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apply_userno', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "applyUserno", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apply_dept', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "applyDept", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'budget_no', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "budgetNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'second_plan_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "secondPlanName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_level', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "purchaseLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_plan_purchase_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "actualPlanPurchaseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_temporary_emergency', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "isTemporaryEmergency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_task_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "purchaseTaskType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'major', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "major", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'project', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version_control_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "versionControlType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_status', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "orderStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'feedback_status',
        type: 'varchar',
        length: 20,
        nullable: false,
        default: '未开始',
        comment: '反馈状态：未开始、进行中、已完成、已延期'
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "feedbackStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'set_count', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "setCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_code', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "supplierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_manager', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "purchaseManager", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], PurchaseOrder.prototype, "updateTime", void 0);
exports.PurchaseOrder = PurchaseOrder = __decorate([
    (0, typeorm_1.Entity)('PURCHASE_ORDER')
], PurchaseOrder);
//# sourceMappingURL=purchase-order.entity.js.map