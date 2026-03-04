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
exports.PurchaseDetails = void 0;
const typeorm_1 = require("typeorm");
let PurchaseDetails = class PurchaseDetails {
    id;
    bpmCgddmxId;
    bpmCgddInstanceId;
    receiveCompany;
    materialCode;
    materialDesc;
    materialGroup;
    quantity;
    planDate;
    planNo;
    productType;
    secondPlanNo;
    secondPlanName;
    orderNo;
    setCount;
    drawingNo;
    changeType;
    supplierCode;
    detailStatus;
    createTime;
    updateTime;
    isKeyMaterial;
    isComplianceMaterial;
};
exports.PurchaseDetails = PurchaseDetails;
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'char', length: 16, primary: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bpm_cgddmx_id', type: 'bigint', nullable: false }),
    __metadata("design:type", Number)
], PurchaseDetails.prototype, "bpmCgddmxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bpm_cgdd_instance_id', type: 'bigint', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], PurchaseDetails.prototype, "bpmCgddInstanceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receive_company', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "receiveCompany", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_code', type: 'varchar', length: 200, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "materialCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_desc', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "materialDesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material_group', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "materialGroup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'decimal', precision: 18, scale: 6, nullable: false }),
    __metadata("design:type", Number)
], PurchaseDetails.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_date', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], PurchaseDetails.prototype, "planDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_no', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "planNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_type', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'second_plan_no', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "secondPlanNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'second_plan_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "secondPlanName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_no', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "orderNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'set_count', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "setCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'drawing_no', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "drawingNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'change_type', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "changeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_code', type: 'varchar', length: 30, nullable: false }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "supplierCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'detail_status', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "detailStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], PurchaseDetails.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], PurchaseDetails.prototype, "updateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_key_material', type: 'varchar', length: 2, nullable: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "isKeyMaterial", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_compliance_material', type: 'varchar', length: 2, nullable: true }),
    __metadata("design:type", String)
], PurchaseDetails.prototype, "isComplianceMaterial", void 0);
exports.PurchaseDetails = PurchaseDetails = __decorate([
    (0, typeorm_1.Entity)('PURCHASE_DETAILS')
], PurchaseDetails);
//# sourceMappingURL=purchase-details.entity.js.map