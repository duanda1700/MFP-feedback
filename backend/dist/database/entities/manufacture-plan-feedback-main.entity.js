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
exports.ManufacturePlanFeedbackMain = void 0;
const typeorm_1 = require("typeorm");
const manufacture_plan_feedback_version_entity_1 = require("./manufacture-plan-feedback-version.entity");
let ManufacturePlanFeedbackMain = class ManufacturePlanFeedbackMain {
    id;
    purchaseDetailsId;
    setCount;
    drawingNo;
    sfzz;
    progressStatus;
    djbH;
    planName;
    planType;
    materialCode;
    materialDesc;
    planQuantity;
    unit;
    plannedDate;
    isKeyMaterial;
    productionLine;
    planClass;
    supplierCode;
    feedbackCycleType;
    feedbackCycle;
    latestVersion;
    feedbackStatus;
    creator;
    createTime;
    updateTime;
    versions;
};
exports.ManufacturePlanFeedbackMain = ManufacturePlanFeedbackMain;
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'char', length: 16, primary: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_details_id', type: 'char', length: 16, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "purchaseDetailsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'set_count', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "setCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drawing_no', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "drawingNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sfzz', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "sfzz", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'progress_status', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "progressStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'djbH', type: 'varchar', length: 100, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "djbH", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_name', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "planName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_type', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "planType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_code', type: 'varchar', length: 200, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "materialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_desc', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "materialDesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackMain.prototype, "planQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'planned_date', type: 'datetime', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], ManufacturePlanFeedbackMain.prototype, "plannedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_key_material', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "isKeyMaterial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'production_line', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "productionLine", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_class', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "planClass", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_code', type: 'varchar', length: 32, nullable: false }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "supplierCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'feedback_cycle_type',
        type: 'varchar',
        length: 20,
        nullable: false,
        default: '周度'
    }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "feedbackCycleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'feedback_cycle', type: 'varchar', length: 32, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "feedbackCycle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'latest_version',
        type: 'int',
        nullable: false,
        default: 1
    }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackMain.prototype, "latestVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'feedback_status',
        type: 'varchar',
        length: 20,
        nullable: false,
        default: '正常'
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "feedbackStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'creator', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackMain.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], ManufacturePlanFeedbackMain.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], ManufacturePlanFeedbackMain.prototype, "updateTime", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion, version => version.main),
    __metadata("design:type", Array)
], ManufacturePlanFeedbackMain.prototype, "versions", void 0);
exports.ManufacturePlanFeedbackMain = ManufacturePlanFeedbackMain = __decorate([
    (0, typeorm_1.Entity)('manufacture_plan_feedback_main')
], ManufacturePlanFeedbackMain);
//# sourceMappingURL=manufacture-plan-feedback-main.entity.js.map