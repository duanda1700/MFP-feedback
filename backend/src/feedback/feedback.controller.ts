import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('list')
  async getFeedbackList(@Query() query: any) {
    return await this.feedbackService.getFeedbackList(query);
  }

  @Get('detail/:id')
  async getFeedbackDetail(@Param('id') id: string) {
    return await this.feedbackService.getFeedbackDetail(id);
  }

  @Post('submit')
  async submitFeedback(@Body() feedbackData: any) {
    return await this.feedbackService.submitFeedback(feedbackData);
  }

  @Get('statistics')
  async getFeedbackStatistics(@Query() query: any) {
    return await this.feedbackService.getFeedbackStatistics(query);
  }

  @Get('confirmed-plans')
  async getConfirmedPlans(@Query() query: any) {
    return await this.feedbackService.getConfirmedPlans(query);
  }

  @Get('orders-with-plans')
  async getConfirmedOrdersWithPlans(@Query() query: any) {
    return await this.feedbackService.getConfirmedOrdersWithPlans(query);
  }
}
