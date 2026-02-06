import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';

@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getOrderList(@Query() query) {
    return this.orderService.getOrderList(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('detail/:id')
  async getOrderDetail(@Param('id') id: number) {
    return this.orderService.getOrderDetail(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mark-key-material')
  async markKeyMaterial(@Body() body: { orderDetailId: string; isKeyMaterial: boolean }) {
    return this.orderService.markKeyMaterial(body.orderDetailId, body.isKeyMaterial);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('issue-task')
  async issueTask(@Body() body: { orderId: number; supplierId: number }) {
    return this.orderService.issueTask(body.orderId, body.supplierId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sync-erp')
  async syncErpData() {
    return this.orderService.syncErpData();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createOrder(@Body() orderData: any) {
    return this.orderService.createOrder(orderData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  async updateOrder(@Param('id') id: number, @Body() orderData: any) {
    return this.orderService.updateOrder(id, orderData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wide-table/:id')
  async getWideTableData(@Param('id') id: number) {
    return this.orderService.getWideTableData(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-plan-status')
  async updatePlanStatus(@Body() body: { materialCode: string; planStatus: string }) {
    return this.orderService.updatePlanStatus(body.materialCode, body.planStatus);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-remarks')
  async updateRemarks(@Body() body: { materialCode: string; remarks: string }) {
    return this.orderService.updateRemarks(body.materialCode, body.remarks);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-status/:id')
  async updateOrderStatus(@Param('id') id: number, @Body() body: { status: string }) {
    return this.orderService.updateOrderStatus(id, body.status);
  }
}
