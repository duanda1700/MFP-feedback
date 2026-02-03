import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseDetails } from '../entities/purchase-details.entity';
import { ProductionPlan } from '../entities/production-plan.entity';
import { FeedbackData } from '../entities/feedback-data.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Alert } from '../entities/alert.entity';
import { ChangeRecord } from '../entities/change-record.entity';
import { Notification } from '../entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      PurchaseDetails,
      ProductionPlan,
      FeedbackData,
      RolePermission,
      Alert,
      ChangeRecord,
      Notification,
    ]),
  ],
  providers: [PerformanceService],
  controllers: [PerformanceController],
  exports: [PerformanceService],
})
export class PerformanceModule {}
