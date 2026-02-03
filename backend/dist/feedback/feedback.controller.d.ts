import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private feedbackService;
    constructor(feedbackService: FeedbackService);
    getFeedbackList(query: any): Promise<{
        data: import("../database/entities/feedback-data.entity").FeedbackData[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getFeedbackDetail(id: number): Promise<import("../database/entities/feedback-data.entity").FeedbackData>;
    submitFeedback(feedbackData: any): Promise<import("../database/entities/feedback-data.entity").FeedbackData[]>;
    updateFeedbackStatus(id: number, body: {
        status: number;
    }): Promise<import("../database/entities/feedback-data.entity").FeedbackData>;
    updateFeedback(id: number, feedbackData: any): Promise<import("../database/entities/feedback-data.entity").FeedbackData>;
    checkOrderStatus(orderId: number): Promise<{
        orderId: number;
        status: string;
        canSubmitFeedback: boolean;
    }>;
    checkEditableRange(feedbackId: number, userId: number): Promise<{
        feedbackId: number;
        userId: number;
        canEdit: boolean;
        editableFields: string[];
    }>;
    getPurchaseMonitoring(): Promise<{
        totalFeedbacks: number;
        pendingFeedbacks: number;
        overdueFeedbacks: number;
        trend: number[];
    }>;
    deleteFeedback(id: number): Promise<import("../database/entities/feedback-data.entity").FeedbackData>;
}
