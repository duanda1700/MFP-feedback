import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrderTask } from '../database/entities/purchase-order-task.entity';
import { Supplier } from '../database/entities/supplier.entity';
import { OperationLog } from '../database/entities/operation-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseDetails, ProductionPlan, PurchaseOrderTask, Supplier, OperationLog])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
