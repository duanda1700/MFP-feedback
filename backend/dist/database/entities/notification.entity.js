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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
let Notification = class Notification {
    id;
    notificationType;
    notificationContent;
    receiverId;
    receiverType;
    notificationStatus;
    sendTime;
    readTime;
    createBy;
    createTime;
    updateTime;
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_type', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Notification.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_content', type: 'text', nullable: false }),
    __metadata("design:type", String)
], Notification.prototype, "notificationContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_id', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Notification.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_type', type: 'varchar', length: 50, nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Notification.prototype, "receiverType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notification_status', type: 'int', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Notification.prototype, "notificationStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'send_time', type: 'datetime', nullable: false }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], Notification.prototype, "sendTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'read_time', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "readTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'create_by', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Notification.prototype, "createBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_time' }),
    __metadata("design:type", Date)
], Notification.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_time' }),
    __metadata("design:type", Date)
], Notification.prototype, "updateTime", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('NOTIFICATION')
], Notification);
//# sourceMappingURL=notification.entity.js.map