import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderTrackingService } from './order-tracking.service';

@Controller('api/order-tracking')
export class OrderTrackingController {
  constructor(private readonly orderTrackingService: OrderTrackingService) {}

  @Get('orders')
  async getOrdersByStatus() {
    return this.orderTrackingService.getOrdersByStatus();
  }

  @Get('statistics')
  async getStatistics() {
    return this.orderTrackingService.getOrderStatistics();
  }

  @Get('detail/:djbH')
  async getOrderDetail(@Param('djbH') djbH: string) {
    return this.orderTrackingService.getOrderDetail(djbH);
  }

  @Get('compare/:djbH')
  async comparePlans(@Param('djbH') djbH: string) {
    return this.orderTrackingService.comparePlans(djbH);
  }
}
