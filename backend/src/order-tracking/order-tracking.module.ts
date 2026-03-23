import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTrackingController } from './order-tracking.controller';
import { OrderTrackingService } from './order-tracking.service';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      ProductionPlan,
      ManufacturePlanFeedbackMain,
      ManufacturePlanFeedbackVersion,
      PurchaseDetails,
    ]),
  ],
  controllers: [OrderTrackingController],
  providers: [OrderTrackingService],
})
export class OrderTrackingModule {}
