import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    getFeedbackList(query: any): Promise<{
        data: import("../database/entities/manufacture-plan-feedback-main.entity").ManufacturePlanFeedbackMain[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getFeedbackDetail(id: string): Promise<import("../database/entities/manufacture-plan-feedback-main.entity").ManufacturePlanFeedbackMain>;
    submitFeedback(feedbackData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getFeedbackStatistics(query: any): Promise<{
        total: number;
        completed: number;
        inProgress: number;
        delayed: number;
    }>;
    getConfirmedPlans(query: any): Promise<{
        data: import("../database/entities/production-plan.entity").ProductionPlan[];
        total: number;
        page: any;
        pageSize: any;
    }>;
    getConfirmedOrdersWithPlans(query: any): Promise<{
        data: any[];
        total: number;
        page: any;
        pageSize: any;
    }>;
}
