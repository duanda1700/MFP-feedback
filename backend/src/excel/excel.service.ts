import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';

@Injectable()
export class ExcelService {
  constructor(
    @InjectRepository(ProductionPlan)
    private productionPlanRepository: Repository<ProductionPlan>,
    @InjectRepository(ManufacturePlanFeedbackMain)
    private feedbackMainRepository: Repository<ManufacturePlanFeedbackMain>,
    @InjectRepository(ManufacturePlanFeedbackVersion)
    private feedbackVersionRepository: Repository<ManufacturePlanFeedbackVersion>,
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    private dataSource: DataSource,
  ) {}

  async exportBatchOrders(djbHList: string[]): Promise<Buffer> {
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
        let actualDeliveryDate: Date | null = null;
        let remarks = '';

        if (feedbackMain) {
          progressStatus = feedbackMain.progressStatus || '未开始';
          if (feedbackMain.versions && feedbackMain.versions.length > 0) {
            const latestVersion = feedbackMain.versions.sort((a, b) => b.version - a.version)[0];
            finishedQuantity = latestVersion.finishedQuantity || 0;
            actualDeliveryDate = latestVersion.actualDeliveryDate;
            remarks = latestVersion.remarks || '';
          }
        } else {
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
    return Buffer.from(buffer as ArrayBuffer);
  }

  async importFeedbackData(fileBuffer: Buffer, creator: string): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as unknown as ArrayBuffer);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      details: [] as any[],
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const worksheet of workbook.worksheets) {
        const sheetName = worksheet.name;
        
        let headerRow: any = null;
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

        const headerMap: Record<string, number> = {};
        headerRow.forEach((val: any, idx: number) => {
          if (val) {
            headerMap[val.toString().trim()] = idx;
          }
        });

        const getCellValue = (row: any, key: string): any => {
          const idx = headerMap[key];
          if (!idx) return null;
          const cell = row.getCell(idx);
          if (!cell || cell.value === null || cell.value === undefined) return null;
          if (cell.value instanceof Date) return cell.value;
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
            const plan = await queryRunner.manager.findOne(ProductionPlan, {
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

            let actualDeliveryDate: Date | null = null;
            if (actualDeliveryDateStr) {
              if (actualDeliveryDateStr instanceof Date) {
                actualDeliveryDate = actualDeliveryDateStr;
              } else {
                actualDeliveryDate = new Date(actualDeliveryDateStr);
                if (isNaN(actualDeliveryDate.getTime())) {
                  actualDeliveryDate = null;
                }
              }
            }

            const purchaseDetailsIdStr = plan.purchaseDetailsId?.toString();

            let feedbackMain = await queryRunner.manager.findOne(
              ManufacturePlanFeedbackMain,
              {
                where: {
                  purchaseDetailsId: purchaseDetailsIdStr,
                  materialCode,
                  planClass,
                },
              },
            );

            if (!feedbackMain) {
              feedbackMain = queryRunner.manager.create(ManufacturePlanFeedbackMain, {
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
            } else {
              feedbackMain.progressStatus = progressStatus;
              feedbackMain.latestVersion += 1;
              await queryRunner.manager.save(feedbackMain);
            }

            const versionRecord = queryRunner.manager.create(
              ManufacturePlanFeedbackVersion,
              {
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
              },
            );
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
          } catch (err) {
            results.failed++;
            results.errors.push(`Sheet "${sheetName}" 第${rowNumber}行: ${err.message}`);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return results;
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getCurrentCycle(): string {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${year}W${weekNumber.toString().padStart(2, '0')}`;
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return (timestamp + random).padEnd(16, '0').substring(0, 16);
  }
}
