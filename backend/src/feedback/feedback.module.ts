import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManufacturePlanFeedbackMain,
      ManufacturePlanFeedbackVersion,
      ProductionPlan,
      PurchaseOrder,
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
