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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../database/entities/notification.entity");
const notification_record_entity_1 = require("../database/entities/notification-record.entity");
let NotificationService = NotificationService_1 = class NotificationService {
    notificationRepository;
    notificationRecordRepository;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(notificationRepository, notificationRecordRepository) {
        this.notificationRepository = notificationRepository;
        this.notificationRecordRepository = notificationRecordRepository;
    }
    async createNotification(notificationData) {
        const notification = this.notificationRepository.create({
            ...notificationData,
            notificationStatus: 0,
            sendTime: new Date(),
        });
        return this.notificationRepository.save(notification);
    }
    async getNotificationList(receiverId, query) {
        const { page = 1, pageSize = 10, notificationType, notificationStatus, startDate, endDate, } = query;
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification');
        queryBuilder.andWhere('notification.receiver_id = :receiverId', { receiverId });
        if (notificationType) {
            queryBuilder.andWhere('notification.notification_type = :notificationType', { notificationType });
        }
        if (notificationStatus) {
            queryBuilder.andWhere('notification.notification_status = :notificationStatus', { notificationStatus });
        }
        if (startDate) {
            queryBuilder.andWhere('notification.create_time >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('notification.create_time <= :endDate', { endDate });
        }
        const [notifications, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('notification.create_time', 'DESC')
            .getManyAndCount();
        return {
            data: notifications,
            total,
            page,
            pageSize,
        };
    }
    async getUnreadCount(receiverId) {
        return this.notificationRepository.count({
            where: {
                receiverId,
                notificationStatus: 0,
            },
        });
    }
    async markAsRead(id, receiverId) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id,
                receiverId,
            },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.notificationStatus = 1;
        notification.readTime = new Date();
        return this.notificationRepository.save(notification);
    }
    async markMultipleAsRead(ids, receiverId) {
        const result = await this.notificationRepository.update({
            id: (0, typeorm_2.In)(ids),
            receiverId,
            notificationStatus: 0,
        }, {
            notificationStatus: 1,
            readTime: new Date(),
        });
        return result.affected || 0;
    }
    async deleteNotification(id, receiverId) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id,
                receiverId,
            },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        return this.notificationRepository.remove(notification);
    }
    async deleteMultipleNotifications(ids, receiverId) {
        const result = await this.notificationRepository.delete({
            id: (0, typeorm_2.In)(ids),
            receiverId,
        });
        return result.affected || 0;
    }
    async sendAlertNotification(receiverId, alertId, alertContent, createBy) {
        return this.createNotification({
            notificationType: 1,
            notificationContent: `您有一条新的预警通知: ${alertContent}`,
            receiverId,
            receiverType: 'user',
            createBy,
        });
    }
    async sendApprovalNotification(receiverId, approvalId, approvalContent, createBy) {
        return this.createNotification({
            notificationType: 2,
            notificationContent: `您有一条新的审批任务: ${approvalContent}`,
            receiverId,
            receiverType: 'user',
            createBy,
        });
    }
    async sendTaskNotification(receiverId, taskId, taskContent, createBy) {
        return this.createNotification({
            notificationType: 3,
            notificationContent: `您有一条新的任务通知: ${taskContent}`,
            receiverId,
            receiverType: 'user',
            createBy,
        });
    }
    async getNotificationStats(receiverId) {
        const total = await this.notificationRepository.count({ where: { receiverId } });
        const unread = await this.getUnreadCount(receiverId);
        const alerts = await this.notificationRepository.count({ where: { receiverId, notificationType: 1 } });
        const approvals = await this.notificationRepository.count({ where: { receiverId, notificationType: 2 } });
        const tasks = await this.notificationRepository.count({ where: { receiverId, notificationType: 3 } });
        const others = total - alerts - approvals - tasks;
        return {
            total,
            unread,
            byType: {
                alert: alerts,
                approval: approvals,
                task: tasks,
                other: others,
            },
        };
    }
    async createNotificationRecord(recordData) {
        const record = this.notificationRecordRepository.create({
            ...recordData,
            createTime: new Date(),
            updateTime: new Date(),
        });
        return this.notificationRecordRepository.save(record);
    }
    async getNotificationRecords(query) {
        const { page = 1, pageSize = 10, notificationType, deliveryChannel, sendStatus, recipient, relatedId, relatedType, startDate, endDate, } = query;
        const queryBuilder = this.notificationRecordRepository.createQueryBuilder('record');
        if (notificationType) {
            queryBuilder.andWhere('record.notification_type = :notificationType', { notificationType });
        }
        if (deliveryChannel) {
            queryBuilder.andWhere('record.delivery_channel = :deliveryChannel', { deliveryChannel });
        }
        if (sendStatus) {
            queryBuilder.andWhere('record.send_status = :sendStatus', { sendStatus });
        }
        if (recipient) {
            queryBuilder.andWhere('record.recipient LIKE :recipient', { recipient: `%${recipient}%` });
        }
        if (relatedId) {
            queryBuilder.andWhere('record.related_id = :relatedId', { relatedId });
        }
        if (relatedType) {
            queryBuilder.andWhere('record.related_type = :relatedType', { relatedType });
        }
        if (startDate) {
            queryBuilder.andWhere('record.create_time >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('record.create_time <= :endDate', { endDate });
        }
        const [records, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('record.create_time', 'DESC')
            .getManyAndCount();
        return {
            data: records,
            total,
            page,
            pageSize,
        };
    }
    async updateNotificationRecordStatus(id, status, errorMessage) {
        const record = await this.notificationRecordRepository.findOne({ where: { id } });
        if (!record) {
            throw new Error('Notification record not found');
        }
        record.sendStatus = status;
        if (errorMessage) {
            record.errorMessage = errorMessage;
        }
        if (status === 'sent') {
            record.sentAt = new Date();
        }
        record.updateTime = new Date();
        return this.notificationRecordRepository.save(record);
    }
    async getNotificationRecordStats(query = {}) {
        const { startDate, endDate } = query;
        const queryBuilder = this.notificationRecordRepository.createQueryBuilder('record');
        if (startDate) {
            queryBuilder.andWhere('record.create_time >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('record.create_time <= :endDate', { endDate });
        }
        const total = await queryBuilder.getCount();
        const sent = await queryBuilder.clone().andWhere('record.send_status = :status', { status: 'sent' }).getCount();
        const failed = await queryBuilder.clone().andWhere('record.send_status = :status', { status: 'failed' }).getCount();
        const pending = await queryBuilder.clone().andWhere('record.send_status = :status', { status: 'pending' }).getCount();
        const email = await queryBuilder.clone().andWhere('record.delivery_channel = :channel', { channel: 'email' }).getCount();
        const wechat = await queryBuilder.clone().andWhere('record.delivery_channel = :channel', { channel: 'wechat' }).getCount();
        const inapp = await queryBuilder.clone().andWhere('record.delivery_channel = :channel', { channel: 'inapp' }).getCount();
        const alert = await queryBuilder.clone().andWhere('record.notification_type = :type', { type: 'alert' }).getCount();
        const approval = await queryBuilder.clone().andWhere('record.notification_type = :type', { type: 'approval' }).getCount();
        const task = await queryBuilder.clone().andWhere('record.notification_type = :type', { type: 'task' }).getCount();
        const other = total - alert - approval - task;
        return {
            total,
            byStatus: {
                sent,
                failed,
                pending,
            },
            byChannel: {
                email,
                wechat,
                inapp,
            },
            byType: {
                alert,
                approval,
                task,
                other,
            },
        };
    }
    async getNotificationRecord(id) {
        const record = await this.notificationRecordRepository.findOne({ where: { id } });
        if (!record) {
            throw new Error('Notification record not found');
        }
        return record;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(notification_record_entity_1.NotificationRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map