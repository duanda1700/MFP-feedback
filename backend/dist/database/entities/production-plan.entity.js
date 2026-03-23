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
exports.ProductionPlan = void 0;
const typeorm_1 = require("typeorm");
let ProductionPlan = class ProductionPlan {
    id;
    purchaseDetailsId;
    setCount;
    drawingNo;
    djbH;
    planName;
    planType;
    planClass;
    planDept;
    planMaker;
    planDate;
    planStatus;
    materialCode;
    materialDesc;
    quantity;
    unit;
    plannedDate;
    jhrq;
    changeType;
    sfzz;
    finishedQuantity;
    isKeyMaterial;
    productionLine;
    remarks;
    version;
    sortOrder;
    createTime;
    updateTime;
};
exports.ProductionPlan = ProductionPlan;
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'char', length: 16, primary: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_details_id', type: 'bigint', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], ProductionPlan.prototype, "purchaseDetailsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'set_count', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "setCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drawing_no', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "drawingNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'djbH', type: 'varchar', length: 100, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ProductionPlan.prototype, "djbH", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_name', type: 'varchar', length: 100, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ProductionPlan.prototype, "planName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_type', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "planType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_class', type: 'varchar', length: 50, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ProductionPlan.prototype, "planClass", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_dept', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "planDept", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_maker', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "planMaker", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_date', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], ProductionPlan.prototype, "planDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_status', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ProductionPlan.prototype, "planStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_code', type: 'varchar', length: 200, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ProductionPlan.prototype, "materialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_desc', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "materialDesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'decimal', precision: 18, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], ProductionPlan.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'planned_date', type: 'datetime', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], ProductionPlan.prototype, "plannedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'jhrq', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ProductionPlan.prototype, "jhrq", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'change_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "changeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sfzz', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "sfzz", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'finished_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], ProductionPlan.prototype, "finishedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_key_material', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "isKeyMaterial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'production_line', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "productionLine", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductionPlan.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version', type: 'int', nullable: false, default: 1 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], ProductionPlan.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', nullable: false, default: 0 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], ProductionPlan.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], ProductionPlan.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], ProductionPlan.prototype, "updateTime", void 0);
exports.ProductionPlan = ProductionPlan = __decorate([
    (0, typeorm_1.Entity)('PRODUCTION_PLAN')
], ProductionPlan);
//# sourceMappingURL=production-plan.entity.js.map