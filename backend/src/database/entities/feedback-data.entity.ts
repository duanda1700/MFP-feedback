import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('FEEDBACK_DATA')
export class FeedbackData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'int', nullable: false })
  @Index()
  orderId: number;

  @Column({ name: 'plan_id', type: 'int', nullable: false })
  @Index()
  planId: number;

  @Column({ name: 'feedback_time', type: 'datetime', nullable: false })
  @Index()
  feedbackTime: Date;

  @Column({ name: 'feedback_content', type: 'text', nullable: false })
  feedbackContent: string;

  @Column({ name: 'feedback_status', type: 'int', nullable: false })
  @Index()
  feedbackStatus: number;

  @Column({ name: 'operator_id', type: 'int', nullable: false })
  operatorId: number;

  @Column({ name: 'operator_name', type: 'varchar', length: 50, nullable: false })
  operatorName: string;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  @Index()
  supplierId: number;

  @Column({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true })
  supplierName: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;
}
