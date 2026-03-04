import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('purchase_order_task')
export class PurchaseOrderTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'int', nullable: false })
  @Index()
  orderId: number;

  @Column({ name: 'supplier_id', type: 'int', nullable: false })
  @Index()
  supplierId: number;

  @Column({ name: 'task_status', type: 'varchar', length: 20, nullable: false })
  @Index()
  taskStatus: string;

  @Column({ name: 'issue_desc', type: 'text', nullable: true })
  issueDesc: string;

  @Column({ name: 'plan_complete_time', type: 'datetime', nullable: true })
  planCompleteTime: Date;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}