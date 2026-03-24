import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { TodoTask } from '../database/entities/todo-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      ProductionPlan,
      ManufacturePlanFeedbackMain,
      TodoTask,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
