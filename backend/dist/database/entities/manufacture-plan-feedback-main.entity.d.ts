import { ManufacturePlanFeedbackVersion } from './manufacture-plan-feedback-version.entity';
export declare class ManufacturePlanFeedbackMain {
    id: string;
    purchaseDetailsId: string;
    setCount: string;
    drawingNo: string;
    sfzz: string;
    progressStatus: string;
    djbH: string;
    planName: string;
    planType: string;
    materialCode: string;
    materialDesc: string;
    planQuantity: number;
    unit: string;
    plannedDate: Date;
    isKeyMaterial: string;
    productionLine: string;
    planClass: string;
    supplierCode: string;
    feedbackCycleType: string;
    feedbackCycle: string;
    latestVersion: number;
    feedbackStatus: string;
    creator: string;
    createTime: Date;
    updateTime: Date;
    versions: ManufacturePlanFeedbackVersion[];
}
