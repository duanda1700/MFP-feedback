import { Repository } from 'typeorm';
import { FeedbackData } from '../database/entities/feedback-data.entity';
export declare class FeedbackService {
    private feedbackRepository;
    constructor(feedbackRepository: Repository<FeedbackData>);
    getFeedbackList(query: any): Promise<{
        data: FeedbackData[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getFeedbackDetail(id: number): Promise<FeedbackData>;
    submitFeedback(feedbackData: any): Promise<FeedbackData[]>;
    updateFeedbackStatus(id: number, status: number): Promise<FeedbackData>;
    updateFeedback(id: number, feedbackData: any): Promise<FeedbackData>;
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
    realTimeSync(feedback: any): Promise<void>;
    deleteFeedback(id: number): Promise<FeedbackData>;
}
