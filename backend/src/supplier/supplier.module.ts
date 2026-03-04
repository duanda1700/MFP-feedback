import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from '../database/entities/supplier.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, PurchaseOrder, PurchaseDetails, ProductionPlan]),
  ],
  providers: [SupplierService],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
