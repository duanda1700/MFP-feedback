import { AnalyticsService } from './analytics.service';
import type { Response } from 'express';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStatistics(): Promise<{
        orders: {
            total: number;
            pending: number;
            completed: number;
        };
        plans: {
            total: number;
            pending: number;
            completed: number;
        };
        feedbacks: {
            total: number;
            pending: number;
        };
        alerts: {
            total: number;
            pending: number;
            highLevel: number;
        };
    }>;
    getTrendData(type: string, period: string): Promise<{
        type: string;
        period: string;
        data: {
            date: string;
            value: number;
        }[];
    }>;
    exportReport(body: {
        reportType: string;
        filters?: any;
        createdBy: number;
        createdName: string;
    }): Promise<{
        taskId: string;
        taskStatus: string;
        message: string;
    }>;
    downloadReport(fileName: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOrderChangeStatistics(filters: any): Promise<{
        byTime: {
            period: string;
            count: number;
        }[];
        bySupplier: {
            supplier: string;
            count: number;
        }[];
        byChangeType: {
            type: string;
            count: number;
        }[];
        byProcessEfficiency: {
            efficiency: string;
            count: number;
        }[];
    }>;
}
