import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { FeedbackData } from '../database/entities/feedback-data.entity';
import { Alert } from '../database/entities/alert.entity';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseDetails, ProductionPlan, FeedbackData, Alert]), TaskModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
