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
exports.OperationLog = void 0;
const typeorm_1 = require("typeorm");
let OperationLog = class OperationLog {
    id;
    operationType;
    operationDesc;
    operator;
    operatedAt;
    relatedId;
    ipAddress;
    createTime;
};
exports.OperationLog = OperationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OperationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operation_type', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], OperationLog.prototype, "operationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operation_desc', type: 'text', nullable: true }),
    __metadata("design:type", String)
], OperationLog.prototype, "operationDesc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], OperationLog.prototype, "operator", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operated_at', type: 'datetime', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], OperationLog.prototype, "operatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_id', type: 'varchar', length: 50, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], OperationLog.prototype, "relatedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], OperationLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], OperationLog.prototype, "createTime", void 0);
exports.OperationLog = OperationLog = __decorate([
    (0, typeorm_1.Entity)('operation_log')
], OperationLog);
//# sourceMappingURL=operation-log.entity.js.map