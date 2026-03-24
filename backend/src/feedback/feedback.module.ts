import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { TodoTaskModule } from '../todo/todo-task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ManufacturePlanFeedbackMain,
      ManufacturePlanFeedbackVersion,
      ProductionPlan,
      PurchaseOrder,
    ]),
    forwardRef(() => TodoTaskModule),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
