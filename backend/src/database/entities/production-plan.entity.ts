import { Entity, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('PRODUCTION_PLAN')
export class ProductionPlan {
  @Column({ name: 'id', type: 'char', length: 16, primary: true })
  id: string;

  @Column({ name: 'purchase_details_id', type: 'bigint', nullable: false })
  @Index()
  purchaseDetailsId: number;

  @Column({ name: 'djbH', type: 'varchar', length: 100, nullable: true })
  @Index()
  djbH: string;

  @Column({ name: 'plan_name', type: 'varchar', length: 100, nullable: false })
  @Index()
  planName: string;

  @Column({ name: 'plan_type', type: 'varchar', length: 100, nullable: false })
  planType: string;

  @Column({ name: 'plan_class', type: 'varchar', length: 50, nullable: true })
  @Index()
  planClass: string;

  @Column({ name: 'plan_dept', type: 'varchar', length: 100, nullable: false })
  planDept: string;

  @Column({ name: 'plan_maker', type: 'varchar', length: 100, nullable: false })
  planMaker: string;

  @Column({ name: 'plan_date', type: 'datetime', nullable: false })
  planDate: Date;

  @Column({ name: 'plan_status', type: 'varchar', length: 20, nullable: false })
  @Index()
  planStatus: string;

  @Column({ name: 'material_code', type: 'varchar', length: 200, nullable: false })
  @Index()
  materialCode: string;

  @Column({ name: 'material_desc', type: 'varchar', length: 200, nullable: false })
  materialDesc: string;

  @Column({ name: 'quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  quantity: number;

  @Column({ name: 'unit', type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ name: 'planned_date', type: 'datetime', nullable: false })
  @Index()
  plannedDate: Date;

  @Column({ name: 'finished_quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  finishedQuantity: number;

  @Column({ name: 'is_key_material', type: 'varchar', length: 10, nullable: true })
  isKeyMaterial: string;

  @Column({ name: 'production_line', type: 'varchar', length: 100, nullable: true })
  productionLine: string;

  @Column({ name: 'remarks', type: 'varchar', length: 255, nullable: true })
  remarks: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
