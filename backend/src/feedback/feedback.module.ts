import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackData } from '../database/entities/feedback-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackData])],
  providers: [FeedbackService],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {}
