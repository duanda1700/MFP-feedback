import { Entity, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ManufacturePlanFeedbackMain } from './manufacture-plan-feedback-main.entity';

@Entity('manufacture_plan_feedback_version')
export class ManufacturePlanFeedbackVersion {
  @Column({ name: 'id', type: 'char', length: 16, primary: true })
  id: string;

  @Column({ name: 'main_id', type: 'char', length: 16, nullable: false })
  @Index()
  mainId: string;

  @Column({ name: 'purchase_details_id', type: 'char', length: 16, nullable: false })
  @Index()
  purchaseDetailsId: string;

  @Column({ name: 'set_count', type: 'varchar', length: 100, nullable: true })
  setCount: string;

  @Column({ name: 'drawing_no', type: 'varchar', length: 100, nullable: true })
  drawingNo: string;

  @Column({ name: 'sfzz', type: 'varchar', length: 100, nullable: true })
  sfzz: string;

  @Column({ name: 'progress_status', type: 'varchar', length: 50, nullable: true })
  progressStatus: string;

  @Column({ name: 'material_code', type: 'varchar', length: 200, nullable: false })
  materialCode: string;

  @Column({ name: 'version', type: 'int', nullable: false })
  version: number;

  @Column({ name: 'feedback_time', type: 'datetime', precision: 6, nullable: false })
  @Index()
  feedbackTime: Date;

  @Column({ name: 'finished_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  finishedQuantity: number;

  @Column({ name: 'plan_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  planQuantity: number;

  @Column({ 
    name: 'unfinished_quantity', 
    type: 'decimal', 
    precision: 18, 
    scale: 6,
    generatedType: 'STORED',
    asExpression: 'plan_quantity - finished_quantity'
  })
  unfinishedQuantity: number;

  @Column({ 
    name: 'progress_rate', 
    type: 'decimal', 
    precision: 5, 
    scale: 2,
    generatedType: 'STORED',
    asExpression: 'CASE WHEN plan_quantity = 0 THEN 0 ELSE (finished_quantity/plan_quantity)*100 END'
  })
  progressRate: number;

  @Column({ 
    name: 'defect_quantity', 
    type: 'decimal', 
    precision: 18, 
    scale: 6, 
    nullable: true, 
    default: 0 
  })
  defectQuantity: number;

  @Column({ name: 'actual_delivery_date', type: 'datetime', nullable: true })
  actualDeliveryDate: Date;

  @Column({ name: 'adjusted_planned_date', type: 'datetime', nullable: true })
  adjustedPlannedDate: Date;

  @Column({ name: 'remarks', type: 'varchar', length: 255, nullable: true })
  remarks: string;

  @Column({ name: 'creator', type: 'varchar', length: 100, nullable: false })
  creator: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', precision: 6 })
  createTime: Date;

  @ManyToOne(() => ManufacturePlanFeedbackMain, main => main.versions)
  @JoinColumn({ name: 'main_id' })
  main: ManufacturePlanFeedbackMain;
}
