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
exports.NotificationRecord = void 0;
const typeorm_1 = require("typeorm");
let NotificationRecord = class NotificationRecord {
    id;
    notificationType;
    deliveryChannel;
    recipient;
    recipientName;
    subject;
    content;
    linkUrl;
    sendStatus;
    errorMessage;
    relatedId;
    relatedType;
    templateId;
    sentAt;
    createTime;
    updateTime;
};
exports.NotificationRecord = NotificationRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NotificationRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_type', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], NotificationRecord.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_channel', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], NotificationRecord.prototype, "deliveryChannel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient', type: 'varchar', length: 200, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], NotificationRecord.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], NotificationRecord.prototype, "recipientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], NotificationRecord.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text', nullable: true }),
    __metadata("design:type", String)
], NotificationRecord.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'link_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], NotificationRecord.prototype, "linkUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'send_status', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], NotificationRecord.prototype, "sendStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], NotificationRecord.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_id', type: 'varchar', length: 100, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], NotificationRecord.prototype, "relatedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'related_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], NotificationRecord.prototype, "relatedType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id', type: 'int', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], NotificationRecord.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'datetime', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], NotificationRecord.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], NotificationRecord.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], NotificationRecord.prototype, "updateTime", void 0);
exports.NotificationRecord = NotificationRecord = __decorate([
    (0, typeorm_1.Entity)('NOTIFICATION_RECORD')
], NotificationRecord);
//# sourceMappingURL=notification-record.entity.js.map