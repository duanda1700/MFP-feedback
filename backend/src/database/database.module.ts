import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseDetails } from './entities/purchase-details.entity';
import { ProductionPlan } from './entities/production-plan.entity';
import { FeedbackData } from './entities/feedback-data.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Alert } from './entities/alert.entity';
import { ChangeRecord } from './entities/change-record.entity';
import { Notification } from './entities/notification.entity';
import { PurchaseOrderTask } from './entities/purchase-order-task.entity';
import { Supplier } from './entities/supplier.entity';
import { OperationLog } from './entities/operation-log.entity';

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
      PurchaseOrderTask,
      Supplier,
      OperationLog,
    ]),
  ],
  exports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      PurchaseDetails,
      ProductionPlan,
      FeedbackData,
      RolePermission,
      Alert,
      ChangeRecord,
      Notification,
      PurchaseOrderTask,
      Supplier,
      OperationLog,
    ]),
  ],
})
export class DatabaseModule {}
