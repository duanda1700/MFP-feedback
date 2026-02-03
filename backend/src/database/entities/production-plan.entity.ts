import { Entity, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('PRODUCTION_PLAN')
export class ProductionPlan {
  @Column({ name: 'id', type: 'char', length: 16, primary: true })
  id: string;

  @Column({ name: 'bpm_scjh_id', type: 'bigint', nullable: false })
  bpmScjhId: number;

  @Column({ name: 'bpm_scjh_instance_id', type: 'bigint', nullable: false })
  @Index()
  bpmScjhInstanceId: number;

  @Column({ name: 'plan_name', type: 'varchar', length: 100, nullable: false })
  planName: string;

  @Column({ name: 'plan_type', type: 'varchar', length: 100, nullable: false })
  planType: string;

  @Column({ name: 'plan_dept', type: 'varchar', length: 100, nullable: false })
  planDept: string;

  @Column({ name: 'plan_maker', type: 'varchar', length: 100, nullable: false })
  planMaker: string;

  @Column({ name: 'plan_date', type: 'datetime', nullable: false })
  planDate: Date;

  @Column({ name: 'quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  quantity: number;

  @Column({ name: 'planned_date', type: 'datetime', nullable: false })
  @Index()
  plannedDate: Date;

  @Column({ name: 'finished_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  finishedQuantity: number;

  @Column({ name: 'plan_status', type: 'varchar', length: 50, nullable: false })
  planStatus: string;

  @Column({ name: 'material_code', type: 'varchar', length: 100, nullable: false })
  materialCode: string;

  @Column({ name: 'material_desc', type: 'varchar', length: 255, nullable: false })
  materialDesc: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
