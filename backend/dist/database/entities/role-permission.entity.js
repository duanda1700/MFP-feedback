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
exports.RolePermission = void 0;
const typeorm_1 = require("typeorm");
let RolePermission = class RolePermission {
    id;
    roleId;
    permissionId;
    createTime;
    updateTime;
};
exports.RolePermission = RolePermission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RolePermission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], RolePermission.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permission_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], RolePermission.prototype, "permissionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], RolePermission.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], RolePermission.prototype, "updateTime", void 0);
exports.RolePermission = RolePermission = __decorate([
    (0, typeorm_1.Entity)('ROLE_PERMISSION')
], RolePermission);
//# sourceMappingURL=role-permission.entity.js.map