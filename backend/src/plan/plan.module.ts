import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { OperationLog } from '../database/entities/operation-log.entity';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionPlan, PurchaseOrder, OperationLog]), TaskModule],
  providers: [PlanService],
  controllers: [PlanController],
  exports: [PlanService],
})
export class PlanModule {}
