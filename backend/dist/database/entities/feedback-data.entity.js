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
exports.FeedbackData = void 0;
const typeorm_1 = require("typeorm");
let FeedbackData = class FeedbackData {
    id;
    orderId;
    planId;
    feedbackTime;
    feedbackContent;
    feedbackStatus;
    operatorId;
    operatorName;
    supplierId;
    supplierName;
    createTime;
    updateTime;
    remarks;
};
exports.FeedbackData = FeedbackData;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FeedbackData.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], FeedbackData.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], FeedbackData.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'feedback_time', type: 'datetime', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], FeedbackData.prototype, "feedbackTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'feedback_content', type: 'text', nullable: false }),
    __metadata("design:type", String)
], FeedbackData.prototype, "feedbackContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'feedback_status', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], FeedbackData.prototype, "feedbackStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator_id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], FeedbackData.prototype, "operatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator_name', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], FeedbackData.prototype, "operatorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'int', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], FeedbackData.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], FeedbackData.prototype, "supplierName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], FeedbackData.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], FeedbackData.prototype, "updateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'remarks', type: 'text', nullable: true }),
    __metadata("design:type", String)
], FeedbackData.prototype, "remarks", void 0);
exports.FeedbackData = FeedbackData = __decorate([
    (0, typeorm_1.Entity)('FEEDBACK_DATA')
], FeedbackData);
//# sourceMappingURL=feedback-data.entity.js.map