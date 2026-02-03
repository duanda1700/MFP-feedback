import { PerformanceService } from './performance.service';
export declare class PerformanceController {
    private readonly performanceService;
    private readonly logger;
    constructor(performanceService: PerformanceService);
    getPerformanceStatus(): Promise<{
        connectionPoolStatus?: any;
        tableStats?: any[];
        indexStats?: any[];
        slowQueries?: any[];
    }>;
    optimizeTables(): Promise<{
        message: string;
    }>;
    analyzeQuery(query: string): Promise<{
        executionPlan?: any;
        estimatedCost?: number;
        suggestions?: string[];
    }>;
    getServerParams(): Promise<{
        [key: string]: any;
    }>;
    optimizeServerParams(params: {
        [key: string]: any;
    }): Promise<{
        message: string;
    }>;
    generateOptimizationSuggestions(): Promise<{
        suggestions: string[];
    }>;
}
