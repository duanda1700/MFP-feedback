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
exports.Supplier = void 0;
const typeorm_1 = require("typeorm");
let Supplier = class Supplier {
    id;
    supplierCode;
    supplierName;
    contactPerson;
    contactPhone;
    email;
    address;
    status;
    createTime;
    updateTime;
};
exports.Supplier = Supplier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Supplier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_code', type: 'varchar', length: 30, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Supplier.prototype, "supplierCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_name', type: 'varchar', length: 100, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Supplier.prototype, "supplierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 10, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Supplier.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], Supplier.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], Supplier.prototype, "updateTime", void 0);
exports.Supplier = Supplier = __decorate([
    (0, typeorm_1.Entity)('supplier')
], Supplier);
//# sourceMappingURL=supplier.entity.js.map