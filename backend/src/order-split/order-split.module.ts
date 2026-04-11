import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSplitController } from './order-split.controller';
import { OrderSplitService } from './order-split.service';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { PurchaseDetails } from '../database/entities/purchase-details.entity';
import { OrderSplitRecord } from '../database/entities/order-split-record.entity';
import { OrderSplitDetail } from '../database/entities/order-split-detail.entity';
import { OperationLog } from '../database/entities/operation-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      PurchaseDetails,
      OrderSplitRecord,
      OrderSplitDetail,
      OperationLog,
    ]),
  ],
  controllers: [OrderSplitController],
  providers: [OrderSplitService],
  exports: [OrderSplitService],
})
export class OrderSplitModule {}
