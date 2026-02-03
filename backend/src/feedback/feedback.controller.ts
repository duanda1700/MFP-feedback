import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedbackService } from './feedback.service';

@Controller('api/feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async getFeedbackList(@Query() query) {
    return this.feedbackService.getFeedbackList(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('detail/:id')
  async getFeedbackDetail(@Param('id') id: number) {
    return this.feedbackService.getFeedbackDetail(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('submit')
  async submitFeedback(@Body() feedbackData: any) {
    return this.feedbackService.submitFeedback(feedbackData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-status/:id')
  async updateFeedbackStatus(@Param('id') id: number, @Body() body: { status: number }) {
    return this.feedbackService.updateFeedbackStatus(id, body.status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  async updateFeedback(@Param('id') id: number, @Body() feedbackData: any) {
    return this.feedbackService.updateFeedback(id, feedbackData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('order-status/:orderId')
  async checkOrderStatus(@Param('orderId') orderId: number) {
    return this.feedbackService.checkOrderStatus(orderId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('editable-range/:feedbackId')
  async checkEditableRange(@Param('feedbackId') feedbackId: number, @Query('userId') userId: number) {
    return this.feedbackService.checkEditableRange(feedbackId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('purchase-monitoring')
  async getPurchaseMonitoring() {
    return this.feedbackService.getPurchaseMonitoring();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  async deleteFeedback(@Param('id') id: number) {
    return this.feedbackService.deleteFeedback(id);
  }
}
