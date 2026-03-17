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
  @Post('mark-compliance-material')
  async markComplianceMaterial(@Body() body: { orderDetailId: string; isComplianceMaterial: boolean }) {
    return this.orderService.markComplianceMaterial(body.orderDetailId, body.isComplianceMaterial);
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

  @UseGuards(AuthGuard('jwt'))
  @Get('suppliers')
  async getSuppliers() {
    return this.orderService.getSupplierList();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('generate-template/:orderId')
  async generateTemplate(@Param('orderId') orderId: number) {
    return this.orderService.generatePlanFeedbackTemplate(orderId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('issue')
  async issueOrder(@Body() body: {
    orderId: number;
    supplierId: number;
    issueDesc: string;
    planCompleteTime: Date;
    detailMarks: any[];
    planFeedbackTemplate: any[];
  }) {
    return this.orderService.issueOrder(
      body.orderId,
      body.supplierId,
      body.issueDesc,
      body.planCompleteTime,
      body.detailMarks,
      body.planFeedbackTemplate
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('issue-task')
  async issueTask(@Body() body: {
    ids: number[];
    supplierId: string;
    description: string;
    dueDate: Date;
  }) {
    return this.orderService.issueTask(body);
  }
}
