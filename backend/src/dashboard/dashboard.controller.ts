import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { RequirePermission } from '../permission/guards/permission.guard';

@Controller('api/dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('statistics')
  @RequirePermission('dashboard:read')
  async getStatistics() {
    return this.dashboardService.getStatistics();
  }

  @Get('order-distribution')
  @RequirePermission('dashboard:read')
  async getOrderDistribution() {
    return this.dashboardService.getOrderStatusDistribution();
  }

  @Get('feedback-trend')
  @RequirePermission('dashboard:read')
  async getFeedbackTrend(@Query('days') days?: number) {
    return this.dashboardService.getFeedbackTrend(days || 7);
  }

  @Get('recent-alerts')
  @RequirePermission('dashboard:read')
  async getRecentAlerts(@Query('limit') limit?: number) {
    return this.dashboardService.getRecentAlerts(limit || 5);
  }

  @Get('recent-todos')
  @RequirePermission('dashboard:read')
  async getRecentTodos(@Request() req: any, @Query('limit') limit?: number) {
    const userId = req.user?.userId;
    return this.dashboardService.getRecentTodos(userId, limit || 5);
  }

  @Get()
  @RequirePermission('dashboard:read')
  async getDashboardData(@Request() req: any) {
    const userId = req.user?.userId;
    return this.dashboardService.getDashboardData(userId);
  }
}
