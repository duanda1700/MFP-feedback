import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlertService } from './alert.service';
import { RequirePermission } from '../permission/guards/permission.guard';

@Controller('api/alert')
@UseGuards(AuthGuard('jwt'))
export class AlertController {
  constructor(private alertService: AlertService) {}

  @Get('list')
  @RequirePermission('alert:read')
  async getAlertList(@Query() query) {
    return this.alertService.getAlertList(query);
  }

  @Get('detail/:id')
  @RequirePermission('alert:read')
  async getAlertDetail(@Param('id') id: number) {
    return this.alertService.getAlertDetail(id);
  }

  @Post('handle/:id')
  @RequirePermission('alert:update')
  async handleAlert(@Param('id') id: number, @Body() handleData: any) {
    return this.alertService.handleAlert(id, handleData);
  }

  @Put('status/:id')
  @RequirePermission('alert:update')
  async updateAlertStatus(@Param('id') id: number, @Body() body: { status: number }) {
    return this.alertService.updateAlertStatus(id, body.status);
  }

  @Post('create')
  @RequirePermission('alert:create')
  async createAlert(@Body() alertData: any) {
    return this.alertService.createAlert(alertData);
  }

  @Get('trigger-check')
  async checkAlertTriggerType(@Query('taskId') taskId: number, @Query('taskType') taskType: string) {
    return this.alertService.checkAlertTriggerType(taskId, taskType);
  }

  @Post('escalate/:id')
  @RequirePermission('alert:update')
  async escalateAlert(@Param('id') id: number) {
    return this.alertService.escalateAlert(id);
  }

  @Post('close/:id')
  @RequirePermission('alert:update')
  async closeAlert(@Param('id') id: number, @Body() closeData: any) {
    return this.alertService.closeAlert(id, closeData);
  }

  @Post('check-thresholds')
  async checkAlertThresholds() {
    return this.alertService.checkAlertThresholds();
  }

  @Delete('delete/:id')
  @RequirePermission('alert:delete')
  async deleteAlert(@Param('id') id: number) {
    return this.alertService.deleteAlert(id);
  }
}
