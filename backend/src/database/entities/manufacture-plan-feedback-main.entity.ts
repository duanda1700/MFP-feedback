import { Entity, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ManufacturePlanFeedbackVersion } from './manufacture-plan-feedback-version.entity';

@Entity('manufacture_plan_feedback_main')
export class ManufacturePlanFeedbackMain {
  @Column({ name: 'id', type: 'char', length: 16, primary: true })
  id: string;

  @Column({ name: 'purchase_details_id', type: 'char', length: 16, nullable: false })
  @Index()
  purchaseDetailsId: string;

  @Column({ name: 'production_plan_id', type: 'char', length: 16, nullable: true })
  @Index()
  productionPlanId: string;

  @Column({ name: 'set_count', type: 'varchar', length: 100, nullable: true })
  setCount: string;

  @Column({ name: 'drawing_no', type: 'varchar', length: 100, nullable: true })
  drawingNo: string;

  @Column({ name: 'sfzz', type: 'varchar', length: 100, nullable: true })
  sfzz: string;

  @Column({ name: 'progress_status', type: 'varchar', length: 50, nullable: true })
  progressStatus: string;

  @Column({ name: 'djbH', type: 'varchar', length: 100, nullable: false })
  @Index()
  djbH: string;

  @Column({ name: 'plan_name', type: 'varchar', length: 100, nullable: false })
  planName: string;

  @Column({ name: 'plan_type', type: 'varchar', length: 100, nullable: false })
  planType: string;

  @Column({ name: 'material_code', type: 'varchar', length: 200, nullable: false })
  @Index()
  materialCode: string;

  @Column({ name: 'material_desc', type: 'varchar', length: 200, nullable: false })
  materialDesc: string;

  @Column({ name: 'plan_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  planQuantity: number;

  @Column({ name: 'unit', type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ name: 'planned_date', type: 'datetime', nullable: false })
  @Index()
  plannedDate: Date;

  @Column({ name: 'is_key_material', type: 'varchar', length: 10, nullable: true })
  isKeyMaterial: string;

  @Column({ name: 'production_line', type: 'varchar', length: 100, nullable: true })
  productionLine: string;

  @Column({ name: 'plan_class', type: 'varchar', length: 50, nullable: true })
  planClass: string;

  @Column({ name: 'supplier_code', type: 'varchar', length: 32, nullable: false })
  supplierCode: string;

  @Column({ 
    name: 'feedback_cycle_type', 
    type: 'varchar', 
    length: 20, 
    nullable: false, 
    default: '周度' 
  })
  feedbackCycleType: string;

  @Column({ name: 'feedback_cycle', type: 'varchar', length: 32, nullable: false })
  @Index()
  feedbackCycle: string;

  @Column({ 
    name: 'latest_version', 
    type: 'int', 
    nullable: false, 
    default: 1 
  })
  latestVersion: number;

  @Column({ 
    name: 'feedback_status', 
    type: 'varchar', 
    length: 20, 
    nullable: false, 
    default: '正常' 
  })
  @Index()
  feedbackStatus: string;

  @Column({ name: 'creator', type: 'varchar', length: 100, nullable: false })
  creator: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', precision: 6 })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', type: 'datetime', precision: 6 })
  updateTime: Date;

  @OneToMany(() => ManufacturePlanFeedbackVersion, version => version.main)
  versions: ManufacturePlanFeedbackVersion[];
}
