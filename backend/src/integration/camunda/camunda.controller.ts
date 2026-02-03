import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CamundaService } from './camunda.service';

@Controller('api/integration/camunda')
export class CamundaController {
  constructor(private readonly camundaService: CamundaService) {}

  @Post('process/start')
  async startProcess(@Body() body: { processKey: string; variables: any }) {
    return this.camundaService.startProcess(body.processKey, body.variables);
  }

  @Post('task/:taskId/complete')
  async completeTask(@Param('taskId') taskId: string, @Body() body: { variables: any }) {
    return this.camundaService.completeTask(taskId, body.variables);
  }

  @Get('process/:processInstanceId/tasks')
  async getTasksByProcessInstanceId(@Param('processInstanceId') processInstanceId: string) {
    return this.camundaService.getTasksByProcessInstanceId(processInstanceId);
  }

  @Get('process/:processInstanceId')
  async getProcessInstance(@Param('processInstanceId') processInstanceId: string) {
    return this.camundaService.getProcessInstance(processInstanceId);
  }

  @Post('process/purchase-task/start')
  async startPurchaseTaskProcess(@Body() body: { orderId: string; supplierId: string }) {
    return this.camundaService.startPurchaseTaskProcess(body.orderId, body.supplierId);
  }

  @Post('process/production-plan/start')
  async startProductionPlanProcess(@Body() body: { planId: string; plannerId: string }) {
    return this.camundaService.startProductionPlanProcess(body.planId, body.plannerId);
  }

  @Post('process/production-plan-change/start')
  async startProductionPlanChangeProcess(@Body() body: { planId: string; changeReason: string }) {
    return this.camundaService.startProductionPlanChangeProcess(body.planId, body.changeReason);
  }

  @Post('process/alert/start')
  async startAlertProcess(@Body() body: { alertId: string; alertType: string }) {
    return this.camundaService.startAlertProcess(body.alertId, body.alertType);
  }
}
