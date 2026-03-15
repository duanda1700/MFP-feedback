import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupplierService } from './supplier.service';

@Controller('api/supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  async getSupplierOrders(@Request() req, @Query() query) {
    const supplierId = req.user.supplierId;
    return this.supplierService.getSupplierOrders(supplierId, query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders/:id')
  async getOrderDetail(@Request() req, @Param('id') orderId: number) {
    const supplierId = req.user.supplierId;
    return this.supplierService.getOrderDetail(orderId, supplierId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('production-plans')
  async getSupplierProductionPlans(@Request() req, @Query() query) {
    const supplierId = req.user.supplierId;
    return this.supplierService.getSupplierProductionPlans(supplierId, query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('production-plans/:id/status')
  async updatePlanStatus(
    @Request() req, 
    @Param('id') planId: string, 
    @Body() body: { status: string }
  ) {
    const supplierId = req.user.supplierId;
    return this.supplierService.updatePlanStatus(planId, body.status, supplierId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('production-plans/batch-status')
  async batchUpdatePlanStatus(
    @Request() req, 
    @Body() body: { planIds: string[], status: string }
  ) {
    const supplierId = req.user.supplierId;
    return this.supplierService.batchUpdatePlanStatus(body.planIds, body.status, supplierId);
  }
}