import { Controller, Post, Body, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ExcelService } from './excel.service';

@Controller('api/excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('export/batch')
  async exportBatchOrders(
    @Body() body: { djbHList: string[] },
    @Res() res: Response,
  ) {
    try {
      if (!body.djbHList || body.djbHList.length === 0) {
        throw new BadRequestException('请选择要导出的订单');
      }

      const buffer = await this.excelService.exportBatchOrders(body.djbHList);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=feedback_batch_${Date.now()}.xlsx`);
      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(`导出失败: ${error.message}`);
    }
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importFeedbackData(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { creator?: string },
  ) {
    if (!file) {
      throw new BadRequestException('请上传文件');
    }

    if (!file.originalname.endsWith('.xlsx') && !file.originalname.endsWith('.xls')) {
      throw new BadRequestException('请上传Excel文件（.xlsx或.xls格式）');
    }

    try {
      const result = await this.excelService.importFeedbackData(
        file.buffer,
        body.creator || 'system',
      );
      return result;
    } catch (error) {
      throw new BadRequestException(`导入失败: ${error.message}`);
    }
  }
}
