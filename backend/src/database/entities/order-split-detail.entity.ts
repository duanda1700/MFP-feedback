import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { OrderSplitRecord } from './order-split-record.entity';

@Entity('order_split_detail')
export class OrderSplitDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'split_record_id', type: 'int', nullable: false })
  @Index()
  splitRecordId: number;

  @Column({ name: 'sub_order_id', type: 'int', nullable: false })
  @Index()
  subOrderId: number;

  @Column({ name: 'sub_djbh', type: 'varchar', length: 50, nullable: false })
  subDjbh: string;

  @Column({ name: 'supplier_id', type: 'int', nullable: false })
  supplierId: number;

  @Column({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true })
  supplierName: string;

  @Column({ name: 'split_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  splitAmount: number;

  @Column({ name: 'split_remark', type: 'text', nullable: true })
  splitRemark: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @ManyToOne(() => OrderSplitRecord)
  @JoinColumn({ name: 'split_record_id' })
  splitRecord: OrderSplitRecord;
}
