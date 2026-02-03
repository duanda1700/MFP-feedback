import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseDetails])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
