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
exports.ManufacturePlanFeedbackVersion = void 0;
const typeorm_1 = require("typeorm");
const manufacture_plan_feedback_main_entity_1 = require("./manufacture-plan-feedback-main.entity");
let ManufacturePlanFeedbackVersion = class ManufacturePlanFeedbackVersion {
    id;
    mainId;
    purchaseDetailsId;
    setCount;
    drawingNo;
    sfzz;
    progressStatus;
    materialCode;
    version;
    feedbackTime;
    finishedQuantity;
    planQuantity;
    unfinishedQuantity;
    progressRate;
    defectQuantity;
    actualDeliveryDate;
    adjustedPlannedDate;
    remarks;
    creator;
    createTime;
    main;
};
exports.ManufacturePlanFeedbackVersion = ManufacturePlanFeedbackVersion;
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'char', length: 16, primary: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'main_id', type: 'char', length: 16, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "mainId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_details_id', type: 'char', length: 16, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "purchaseDetailsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'set_count', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "setCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drawing_no', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "drawingNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sfzz', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "sfzz", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'progress_status', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "progressStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_code', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "materialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackVersion.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'feedback_time', type: 'datetime', precision: 6, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], ManufacturePlanFeedbackVersion.prototype, "feedbackTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'finished_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackVersion.prototype, "finishedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackVersion.prototype, "planQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unfinished_quantity',
        type: 'decimal',
        precision: 18,
        scale: 6,
        generatedType: 'STORED',
        asExpression: 'plan_quantity - finished_quantity'
    }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackVersion.prototype, "unfinishedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'progress_rate',
        type: 'decimal',
        precision: 5,
        scale: 2,
        generatedType: 'STORED',
        asExpression: 'CASE WHEN plan_quantity = 0 THEN 0 ELSE (finished_quantity/plan_quantity)*100 END'
    }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackVersion.prototype, "progressRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'defect_quantity',
        type: 'decimal',
        precision: 18,
        scale: 6,
        nullable: true,
        default: 0
    }),
    __metadata("design:type", Number)
], ManufacturePlanFeedbackVersion.prototype, "defectQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_delivery_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], ManufacturePlanFeedbackVersion.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adjusted_planned_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], ManufacturePlanFeedbackVersion.prototype, "adjustedPlannedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'creator', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ManufacturePlanFeedbackVersion.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time', type: 'datetime', precision: 6 }),
    __metadata("design:type", Date)
], ManufacturePlanFeedbackVersion.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain, main => main.versions),
    (0, typeorm_1.JoinColumn)({ name: 'main_id' }),
    __metadata("design:type", manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain)
], ManufacturePlanFeedbackVersion.prototype, "main", void 0);
exports.ManufacturePlanFeedbackVersion = ManufacturePlanFeedbackVersion = __decorate([
    (0, typeorm_1.Entity)('manufacture_plan_feedback_version')
], ManufacturePlanFeedbackVersion);
//# sourceMappingURL=manufacture-plan-feedback-version.entity.js.map