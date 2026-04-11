import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderSplitService } from './order-split.service';
import { RequirePermission } from '../permission/guards/permission.guard';
import { OrderSplitPreviewDto, OrderSplitExecuteDto, OrderSplitCancelDto } from './dto/order-split.dto';

@Controller('api/order-split')
@UseGuards(AuthGuard('jwt'))
export class OrderSplitController {
  constructor(private readonly orderSplitService: OrderSplitService) {}

  @Post('preview')
  @RequirePermission('order:split')
  async previewSplit(@Body() dto: OrderSplitPreviewDto) {
    return this.orderSplitService.previewSplit(dto);
  }

  @Post('execute')
  @RequirePermission('order:split')
  async executeSplit(@Body() dto: OrderSplitExecuteDto, @Request() req: any) {
    const operator = req.user?.username || 'system';
    return this.orderSplitService.executeSplit(dto, operator);
  }

  @Get('history/:orderId')
  @RequirePermission('order:read')
  async getSplitHistory(@Param('orderId') orderId: number) {
    return this.orderSplitService.getSplitHistory(orderId);
  }

  @Post('cancel/:splitRecordId')
  @RequirePermission('order:split:cancel')
  async cancelSplit(@Param('splitRecordId') splitRecordId: number, @Request() req: any) {
    const operator = req.user?.username || 'system';
    return this.orderSplitService.cancelSplit(splitRecordId, operator);
  }

  @Get('sub-orders/:orderId')
  @RequirePermission('order:read')
  async getSubOrders(@Param('orderId') orderId: number) {
    return this.orderSplitService.getSubOrders(orderId);
  }

  @Get('detail/:splitRecordId')
  @RequirePermission('order:read')
  async getSplitDetail(@Param('splitRecordId') splitRecordId: number) {
    return this.orderSplitService.getSplitDetail(splitRecordId);
  }
}
