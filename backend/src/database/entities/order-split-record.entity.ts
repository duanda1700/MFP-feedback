import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('order_split_record')
export class OrderSplitRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_order_id', type: 'int', nullable: false })
  @Index()
  originalOrderId: number;

  @Column({ name: 'original_djbh', type: 'varchar', length: 50, nullable: false })
  originalDjbh: string;

  @Column({ name: 'split_batch_no', type: 'varchar', length: 50, nullable: false })
  @Index()
  splitBatchNo: string;

  @Column({ name: 'split_count', type: 'int', nullable: false })
  splitCount: number;

  @Column({ 
    name: 'split_type', 
    type: 'varchar', 
    length: 20, 
    nullable: false,
    comment: '拆分类型：BY_ITEM-按商品, BY_AMOUNT-按金额'
  })
  splitType: string;

  @Column({ name: 'split_reason', type: 'text', nullable: true })
  splitReason: string;

  @Column({ name: 'operator', type: 'varchar', length: 50, nullable: false })
  operator: string;

  @Column({ 
    name: 'status', 
    type: 'varchar', 
    length: 20, 
    nullable: false, 
    default: 'ACTIVE',
    comment: '状态：ACTIVE-有效, CANCELLED-已撤销'
  })
  @Index()
  status: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
