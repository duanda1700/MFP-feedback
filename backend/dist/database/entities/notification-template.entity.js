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
exports.NotificationTemplate = void 0;
const typeorm_1 = require("typeorm");
let NotificationTemplate = class NotificationTemplate {
    id;
    templateName;
    templateType;
    subjectTemplate;
    contentTemplate;
    linkTemplate;
    isDefault;
    status;
    createdBy;
    createdName;
    updatedBy;
    updatedName;
    createTime;
    updateTime;
};
exports.NotificationTemplate = NotificationTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NotificationTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_name', type: 'varchar', length: 100, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "templateName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_type', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "templateType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject_template', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "subjectTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_template', type: 'text', nullable: false }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "contentTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'link_template', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "linkTemplate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'boolean', nullable: false, default: false }),
    __metadata("design:type", Boolean)
], NotificationTemplate.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20, nullable: false, default: 'active' }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], NotificationTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_name', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "createdName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], NotificationTemplate.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "updatedName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], NotificationTemplate.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], NotificationTemplate.prototype, "updateTime", void 0);
exports.NotificationTemplate = NotificationTemplate = __decorate([
    (0, typeorm_1.Entity)('NOTIFICATION_TEMPLATE')
], NotificationTemplate);
//# sourceMappingURL=notification-template.entity.js.map