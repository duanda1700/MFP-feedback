"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ExcelJS = __importStar(require("exceljs"));
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const manufacture_plan_feedback_main_entity_1 = require("../database/entities/manufacture-plan-feedback-main.entity");
const manufacture_plan_feedback_version_entity_1 = require("../database/entities/manufacture-plan-feedback-version.entity");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
let ExcelService = class ExcelService {
    productionPlanRepository;
    feedbackMainRepository;
    feedbackVersionRepository;
    purchaseOrderRepository;
    dataSource;
    constructor(productionPlanRepository, feedbackMainRepository, feedbackVersionRepository, purchaseOrderRepository, dataSource) {
        this.productionPlanRepository = productionPlanRepository;
        this.feedbackMainRepository = feedbackMainRepository;
        this.feedbackVersionRepository = feedbackVersionRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.dataSource = dataSource;
    }
    async exportBatchOrders(djbHList) {
        const workbook = new ExcelJS.Workbook();
        for (const djbH of djbHList) {
            const worksheet = workbook.addWorksheet(djbH.substring(0, 31));
            worksheet.columns = [
                { header: '订单编号', key: 'djbH', width: 20 },
                { header: '台份', key: 'setCount', width: 12 },
                { header: '图号', key: 'drawingNo', width: 15 },
                { header: '物料编码', key: 'materialCode', width: 15 },
                { header: '物料描述', key: 'materialDesc', width: 30 },
                { header: '计划分类', key: 'planClass', width: 15 },
                { header: '是否自制', key: 'sfzz', width: 10 },
                { header: '计划数量', key: 'quantity', width: 12 },
                { header: '单位', key: 'unit', width: 8 },
                { header: '计划交付日期', key: 'plannedDate', width: 15 },
                { header: '进展状态', key: 'progressStatus', width: 12 },
                { header: '完成数量', key: 'finishedQuantity', width: 12 },
                { header: '实际交付日期', key: 'actualDeliveryDate', width: 15 },
                { header: '备注', key: 'remarks', width: 30 },
            ];
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' },
            };
            const plans = await this.productionPlanRepository
                .createQueryBuilder('plan')
                .where('plan.djbH = :djbH', { djbH })
                .andWhere('plan.planStatus = :status', { status: '已确认' })
                .orderBy('plan.sortOrder', 'ASC')
                .getMany();
            const now = new Date();
            for (const plan of plans) {
                const feedbackMain = await this.feedbackMainRepository.findOne({
                    where: {
                        purchaseDetailsId: plan.purchaseDetailsId?.toString(),
                        materialCode: plan.materialCode,
                        planClass: plan.planClass,
                    },
                    order: { createTime: 'DESC' },
                    relations: ['versions'],
                });
                let progressStatus = '未开始';
                let finishedQuantity = 0;
                let actualDeliveryDate = null;
                let remarks = '';
                if (feedbackMain) {
                    progressStatus = feedbackMain.progressStatus || '未开始';
                    if (feedbackMain.versions && feedbackMain.versions.length > 0) {
                        const latestVersion = feedbackMain.versions.sort((a, b) => b.version - a.version)[0];
                        finishedQuantity = latestVersion.finishedQuantity || 0;
                        actualDeliveryDate = latestVersion.actualDeliveryDate;
                        remarks = latestVersion.remarks || '';
                    }
                }
                else {
                    const plannedDate = plan.plannedDate ? new Date(plan.plannedDate) : null;
                    if (plannedDate && now > plannedDate) {
                        progressStatus = '已延期';
                    }
                }
                worksheet.addRow({
                    djbH: plan.djbH,
                    setCount: plan.setCount || '',
                    drawingNo: plan.drawingNo || '',
                    materialCode: plan.materialCode,
                    materialDesc: plan.materialDesc,
                    planClass: plan.planClass,
                    sfzz: plan.sfzz || '',
                    quantity: plan.quantity,
                    unit: plan.unit || '',
                    plannedDate: plan.plannedDate ? this.formatDate(plan.plannedDate) : '',
                    progressStatus,
                    finishedQuantity,
                    actualDeliveryDate: actualDeliveryDate ? this.formatDate(actualDeliveryDate) : '',
                    remarks,
                });
            }
        }
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async importFeedbackData(fileBuffer, creator) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        const results = {
            success: 0,
            failed: 0,
            errors: [],
            details: [],
        };
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const worksheet of workbook.worksheets) {
                const sheetName = worksheet.name;
                let headerRow = null;
                let dataStartRow = 1;
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1) {
                        headerRow = row.values;
                    }
                });
                if (!headerRow) {
                    results.errors.push(`Sheet "${sheetName}": 未找到表头行`);
                    continue;
                }
                const headerMap = {};
                headerRow.forEach((val, idx) => {
                    if (val) {
                        headerMap[val.toString().trim()] = idx;
                    }
                });
                const getCellValue = (row, key) => {
                    const idx = headerMap[key];
                    if (!idx)
                        return null;
                    const cell = row.getCell(idx);
                    if (!cell || cell.value === null || cell.value === undefined)
                        return null;
                    if (cell.value instanceof Date)
                        return cell.value;
                    if (typeof cell.value === 'object' && cell.value.result !== undefined) {
                        return cell.value.result;
                    }
                    return cell.value.toString().trim();
                };
                for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                    const row = worksheet.getRow(rowNumber);
                    const djbH = getCellValue(row, '订单编号');
                    const materialCode = getCellValue(row, '物料编码');
                    const planClass = getCellValue(row, '计划分类');
                    if (!djbH || !materialCode || !planClass) {
                        continue;
                    }
                    try {
                        const plan = await queryRunner.manager.findOne(production_plan_entity_1.ProductionPlan, {
                            where: {
                                djbH,
                                materialCode,
                                planClass,
                                planStatus: '已确认',
                            },
                        });
                        if (!plan) {
                            results.failed++;
                            results.errors.push(`Sheet "${sheetName}" 第${rowNumber}行: 未找到对应的生产计划 (订单: ${djbH}, 物料: ${materialCode}, 计划分类: ${planClass})`);
                            continue;
                        }
                        const progressStatus = getCellValue(row, '进展状态') || '未开始';
                        const finishedQuantity = parseFloat(getCellValue(row, '完成数量')) || 0;
                        const actualDeliveryDateStr = getCellValue(row, '实际交付日期');
                        const remarks = getCellValue(row, '备注') || '';
                        let actualDeliveryDate = null;
                        if (actualDeliveryDateStr) {
                            if (actualDeliveryDateStr instanceof Date) {
                                actualDeliveryDate = actualDeliveryDateStr;
                            }
                            else {
                                actualDeliveryDate = new Date(actualDeliveryDateStr);
                                if (isNaN(actualDeliveryDate.getTime())) {
                                    actualDeliveryDate = null;
                                }
                            }
                        }
                        const purchaseDetailsIdStr = plan.purchaseDetailsId?.toString();
                        let feedbackMain = await queryRunner.manager.findOne(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain, {
                            where: {
                                purchaseDetailsId: purchaseDetailsIdStr,
                                materialCode,
                                planClass,
                            },
                        });
                        if (!feedbackMain) {
                            feedbackMain = queryRunner.manager.create(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain, {
                                id: this.generateId(),
                                purchaseDetailsId: purchaseDetailsIdStr,
                                setCount: plan.setCount,
                                drawingNo: plan.drawingNo,
                                sfzz: plan.sfzz,
                                progressStatus,
                                djbH: plan.djbH,
                                planName: plan.planName,
                                planType: plan.planType,
                                materialCode,
                                materialDesc: plan.materialDesc,
                                planQuantity: plan.quantity,
                                unit: plan.unit,
                                plannedDate: plan.plannedDate,
                                isKeyMaterial: plan.isKeyMaterial,
                                productionLine: plan.productionLine,
                                planClass,
                                supplierCode: 'SUPPLIER001',
                                feedbackCycleType: '周度',
                                feedbackCycle: this.getCurrentCycle(),
                                latestVersion: 1,
                                feedbackStatus: '正常',
                                creator,
                            });
                            await queryRunner.manager.save(feedbackMain);
                        }
                        else {
                            feedbackMain.progressStatus = progressStatus;
                            feedbackMain.latestVersion += 1;
                            await queryRunner.manager.save(feedbackMain);
                        }
                        const versionRecord = queryRunner.manager.create(manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion, {
                            id: this.generateId(),
                            mainId: feedbackMain.id,
                            purchaseDetailsId: purchaseDetailsIdStr,
                            setCount: plan.setCount,
                            drawingNo: plan.drawingNo,
                            sfzz: plan.sfzz,
                            progressStatus,
                            materialCode,
                            version: feedbackMain.latestVersion,
                            feedbackTime: new Date(),
                            finishedQuantity,
                            planQuantity: plan.quantity,
                            defectQuantity: 0,
                            actualDeliveryDate: actualDeliveryDate || undefined,
                            remarks,
                            creator,
                        });
                        await queryRunner.manager.save(versionRecord);
                        results.success++;
                        results.details.push({
                            sheet: sheetName,
                            row: rowNumber,
                            djbH,
                            materialCode,
                            planClass,
                            progressStatus,
                        });
                    }
                    catch (err) {
                        results.failed++;
                        results.errors.push(`Sheet "${sheetName}" 第${rowNumber}行: ${err.message}`);
                    }
                }
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
        return results;
    }
    formatDate(date) {
        if (!date)
            return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    getCurrentCycle() {
        const now = new Date();
        const year = now.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        return `${year}W${weekNumber.toString().padStart(2, '0')}`;
    }
    generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 10);
        return (timestamp + random).padEnd(16, '0').substring(0, 16);
    }
};
exports.ExcelService = ExcelService;
exports.ExcelService = ExcelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain)),
    __param(2, (0, typeorm_1.InjectRepository)(manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion)),
    __param(3, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ExcelService);
//# sourceMappingURL=excel.service.js.map