import { ManufacturePlanFeedbackMain } from './manufacture-plan-feedback-main.entity';
export declare class ManufacturePlanFeedbackVersion {
    id: string;
    mainId: string;
    purchaseDetailsId: string;
    setCount: string;
    drawingNo: string;
    sfzz: string;
    progressStatus: string;
    materialCode: string;
    version: number;
    feedbackTime: Date;
    finishedQuantity: number;
    planQuantity: number;
    unfinishedQuantity: number;
    progressRate: number;
    defectQuantity: number;
    actualDeliveryDate: Date;
    adjustedPlannedDate: Date;
    remarks: string;
    creator: string;
    createTime: Date;
    main: ManufacturePlanFeedbackMain;
}
