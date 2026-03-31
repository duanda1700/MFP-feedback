import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlanService } from './plan.service';
import { RequirePermission } from '../permission/guards/permission.guard';

@Controller('api/plan')
export class PlanController {
  constructor(private planService: PlanService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getPlanList(@Query() query) {
    return this.planService.getPlanList(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('detail/:id')
  async getPlanDetail(@Param('id') id: string) {
    return this.planService.getPlanDetail(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createPlan(@Body() planData: any) {
    return this.planService.createPlan(planData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  async updatePlan(@Param('id') id: string, @Body() planData: any) {
    return this.planService.updatePlan(id, planData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('import')
  @RequirePermission('plan:create')
  async importPlan(@Body() body: { plans: any[]; createdBy: number; createdName: string; orderId?: number; isFirstConfirmation?: boolean }) {
    return this.planService.importPlan(body.plans, body.createdBy, body.createdName, body.orderId, body.isFirstConfirmation);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('submit-approval/:id')
  async submitApproval(@Param('id') id: string) {
    return this.planService.submitApproval(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('execute/:id')
  async executePlan(@Param('id') id: string) {
    return this.planService.executePlan(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('complete/:id')
  async completePlan(@Param('id') id: string) {
    return this.planService.completePlan(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('close/:id')
  async closePlan(@Param('id') id: string) {
    return this.planService.closePlan(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  async deletePlan(@Param('id') id: string) {
    return this.planService.deletePlan(id);
  }
}
