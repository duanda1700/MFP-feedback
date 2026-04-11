import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { PurchaseDetails } from './purchase-details.entity';

@Entity('PURCHASE_ORDER')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bpm_cgdd_id', type: 'bigint', nullable: false })
  bpmCgddId: number;

  @Column({ name: 'bpm_cgdd_instance_id', type: 'bigint', nullable: false })
  @Index()
  bpmCgddInstanceId: number;

  @Column({ name: 'djbH', type: 'varchar', length: 50, nullable: false })
  @Index()
  djbH: string;

  @Column({ name: 'apply_username', type: 'varchar', length: 50, nullable: true })
  applyUsername: string;

  @Column({ name: 'apply_userno', type: 'varchar', length: 50, nullable: true })
  applyUserno: string;

  @Column({ name: 'apply_dept', type: 'varchar', length: 100, nullable: true })
  applyDept: string;

  @Column({ name: 'budget_no', type: 'varchar', length: 50, nullable: true })
  budgetNo: string;

  @Column({ name: 'second_plan_name', type: 'varchar', length: 100, nullable: true })
  secondPlanName: string;

  @Column({ name: 'purchase_level', type: 'varchar', length: 100, nullable: true })
  purchaseLevel: string;

  @Column({ name: 'actual_plan_purchase_name', type: 'varchar', length: 100, nullable: true })
  actualPlanPurchaseName: string;

  @Column({ name: 'is_temporary_emergency', type: 'varchar', length: 100, nullable: true })
  isTemporaryEmergency: string;

  @Column({ name: 'purchase_task_type', type: 'varchar', length: 100, nullable: true })
  purchaseTaskType: string;

  @Column({ name: 'major', type: 'varchar', length: 100, nullable: false })
  major: string;

  @Column({ name: 'project', type: 'varchar', length: 100, nullable: false })
  project: string;

  @Column({ name: 'version', type: 'varchar', length: 100, nullable: true })
  version: string;

  @Column({ name: 'version_control_type', type: 'varchar', length: 100, nullable: true })
  versionControlType: string;

  @Column({ name: 'order_status', type: 'varchar', length: 20, nullable: false })
  @Index()
  orderStatus: string;

  @Column({ 
    name: 'feedback_status', 
    type: 'varchar', 
    length: 20, 
    nullable: false, 
    default: '未开始',
    comment: '反馈状态：未开始、进行中、已完成、已延期'
  })
  @Index()
  feedbackStatus: string;

  @Column({ name: 'set_count', type: 'varchar', length: 50, nullable: false })
  setCount: string;

  @Column({ name: 'supplier_code', type: 'varchar', length: 30, nullable: true })
  supplierCode: string;

  @Column({ name: 'supplier_name', type: 'varchar', length: 100, nullable: true })
  supplierName: string;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplierId: number;

  @Column({ name: 'parent_order_id', type: 'int', nullable: true })
  parentOrderId: number;

  @Column({ 
    name: 'order_type', 
    type: 'varchar', 
    length: 20, 
    nullable: false, 
    default: 'ORIGINAL',
    comment: '订单类型：ORIGINAL-原始订单, SPLIT-子订单'
  })
  orderType: string;

  @Column({ name: 'split_count', type: 'int', nullable: true })
  splitCount: number;

  @Column({ name: 'split_batch_no', type: 'varchar', length: 50, nullable: true })
  splitBatchNo: string;

  @Column({ name: 'split_time', type: 'datetime', nullable: true })
  splitTime: Date;

  @Column({ name: 'split_operator', type: 'varchar', length: 50, nullable: true })
  splitOperator: string;

  @Column({ name: 'purchase_manager', type: 'varchar', length: 20, nullable: true })
  purchaseManager: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
