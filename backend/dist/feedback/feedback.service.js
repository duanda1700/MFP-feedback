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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feedback_data_entity_1 = require("../database/entities/feedback-data.entity");
let FeedbackService = class FeedbackService {
    feedbackRepository;
    constructor(feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }
    async getFeedbackList(query) {
        const { page = 1, pageSize = 10, feedbackStatus, orderId, planId, startDate, endDate, } = query;
        const queryBuilder = this.feedbackRepository.createQueryBuilder('feedback');
        if (feedbackStatus) {
            queryBuilder.andWhere('feedback.feedback_status = :feedbackStatus', { feedbackStatus });
        }
        if (orderId) {
            queryBuilder.andWhere('feedback.order_id = :orderId', { orderId });
        }
        if (planId) {
            queryBuilder.andWhere('feedback.plan_id = :planId', { planId });
        }
        if (startDate) {
            queryBuilder.andWhere('feedback.feedback_time >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('feedback.feedback_time <= :endDate', { endDate });
        }
        const [feedbacks, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('feedback.feedback_time', 'DESC')
            .getManyAndCount();
        return {
            data: feedbacks,
            total,
            page,
            pageSize,
        };
    }
    async getFeedbackDetail(id) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        return feedback;
    }
    async submitFeedback(feedbackData) {
        const feedback = this.feedbackRepository.create({
            ...feedbackData,
            feedbackTime: new Date(),
            feedbackStatus: 1,
        });
        const savedFeedback = await this.feedbackRepository.save(feedback);
        this.realTimeSync(savedFeedback);
        return savedFeedback;
    }
    async updateFeedbackStatus(id, status) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        feedback.feedbackStatus = status;
        return this.feedbackRepository.save(feedback);
    }
    async updateFeedback(id, feedbackData) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        if (feedbackData.remarks) {
            feedback.remarks = feedbackData.remarks;
        }
        return this.feedbackRepository.save(feedback);
    }
    async checkOrderStatus(orderId) {
        return {
            orderId,
            status: '进行中',
            canSubmitFeedback: true,
        };
    }
    async checkEditableRange(feedbackId, userId) {
        const feedback = await this.feedbackRepository.findOne({ where: { id: feedbackId } });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        return {
            feedbackId,
            userId,
            canEdit: true,
            editableFields: ['remarks'],
        };
    }
    async getPurchaseMonitoring() {
        return {
            totalFeedbacks: 100,
            pendingFeedbacks: 20,
            overdueFeedbacks: 5,
            trend: [10, 15, 12, 18, 20],
        };
    }
    async realTimeSync(feedback) {
        setTimeout(() => {
            console.log('Feedback synchronized to ERP:', feedback.id);
        }, 1000);
    }
    async deleteFeedback(id) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (!feedback) {
            throw new common_1.NotFoundException('Feedback not found');
        }
        return this.feedbackRepository.remove(feedback);
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_data_entity_1.FeedbackData)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map