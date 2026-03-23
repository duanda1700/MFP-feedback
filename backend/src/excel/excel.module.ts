import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductionPlan,
      ManufacturePlanFeedbackMain,
      ManufacturePlanFeedbackVersion,
      PurchaseOrder,
    ]),
  ],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
