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
exports.ChangeRecord = void 0;
const typeorm_1 = require("typeorm");
let ChangeRecord = class ChangeRecord {
    id;
    relatedType;
    relatedId;
    changeType;
    changeContent;
    operatorId;
    operatorName;
    changeTime;
    createTime;
    updateTime;
};
exports.ChangeRecord = ChangeRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChangeRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_type', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], ChangeRecord.prototype, "relatedType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], ChangeRecord.prototype, "relatedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'change_type', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], ChangeRecord.prototype, "changeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'change_content', type: 'text', nullable: false }),
    __metadata("design:type", String)
], ChangeRecord.prototype, "changeContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], ChangeRecord.prototype, "operatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator_name', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], ChangeRecord.prototype, "operatorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'change_time', type: 'datetime', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], ChangeRecord.prototype, "changeTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], ChangeRecord.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], ChangeRecord.prototype, "updateTime", void 0);
exports.ChangeRecord = ChangeRecord = __decorate([
    (0, typeorm_1.Entity)('CHANGE_RECORD')
], ChangeRecord);
//# sourceMappingURL=change-record.entity.js.map