import type { Response } from 'express';
import { ExcelService } from './excel.service';
export declare class ExcelController {
    private readonly excelService;
    constructor(excelService: ExcelService);
    exportBatchOrders(body: {
        djbHList: string[];
    }, res: Response): Promise<void>;
    importFeedbackData(file: Express.Multer.File, body: {
        creator?: string;
    }): Promise<any>;
}
