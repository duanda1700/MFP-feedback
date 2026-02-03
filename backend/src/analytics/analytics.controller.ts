import { Controller, Get, Post, Query, Body, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { RequirePermission } from '../permission/guards/permission.guard';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('statistics')
  @RequirePermission('analytics:read')
  async getStatistics() {
    return this.analyticsService.getStatistics();
  }

  @Get('trend')
  @RequirePermission('analytics:read')
  async getTrendData(@Query('type') type: string, @Query('period') period: string) {
    return this.analyticsService.getTrendData(type, period);
  }

  @Post('export-report')
  @RequirePermission('analytics:export')
  async exportReport(@Body() body: { reportType: string; filters?: any; createdBy: number; createdName: string }) {
    return this.analyticsService.exportReport(
      body.reportType,
      body.filters || {},
      body.createdBy,
      body.createdName,
    );
  }

  @Get('download-report')
  @RequirePermission('analytics:export')
  async downloadReport(@Query('file') fileName: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', '..', 'reports', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  }

  @Post('order-change-statistics')
  @RequirePermission('analytics:read')
  async getOrderChangeStatistics(@Body() filters: any) {
    return this.analyticsService.getOrderChangeStatistics(filters);
  }
}
