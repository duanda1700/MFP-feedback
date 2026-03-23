import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('PURCHASE_DETAILS')
export class PurchaseDetails {
  @Column({ name: 'id', type: 'char', length: 16, primary: true })
  id: string;

  @Column({ name: 'bpm_cgddmx_id', type: 'bigint', nullable: false })
  bpmCgddmxId: number;

  @Column({ name: 'bpm_cgdd_instance_id', type: 'bigint', nullable: false })
  @Index()
  bpmCgddInstanceId: number;

  @Column({ name: 'receive_company', type: 'varchar', length: 200, nullable: false })
  receiveCompany: string;

  @Column({ name: 'material_code', type: 'varchar', length: 200, nullable: false })
  @Index()
  materialCode: string;

  @Column({ name: 'material_desc', type: 'varchar', length: 200, nullable: false })
  materialDesc: string;

  @Column({ name: 'material_group', type: 'varchar', length: 50, nullable: true })
  materialGroup: string;

  @Column({ name: 'quantity', type: 'decimal', precision: 18, scale: 6, nullable: false })
  quantity: number;

  @Column({ name: 'plan_date', type: 'datetime', nullable: false })
  planDate: Date;

  @Column({ name: 'plan_no', type: 'varchar', length: 50, nullable: false })
  planNo: string;

  @Column({ name: 'product_type', type: 'varchar', length: 50, nullable: false })
  productType: string;

  @Column({ name: 'second_plan_no', type: 'varchar', length: 200, nullable: true })
  secondPlanNo: string;

  @Column({ name: 'second_plan_name', type: 'varchar', length: 200, nullable: true })
  secondPlanName: string;

  @Column({ name: 'order_no', type: 'varchar', length: 50, nullable: false })
  @Index()
  orderNo: string;

  @Column({ name: 'set_count', type: 'varchar', length: 100, nullable: false })
  setCount: string;

  @Column({ name: 'drawing_no', type: 'varchar', length: 100, nullable: true })
  drawingNo: string;

  @Column({ name: 'change_type', type: 'varchar', length: 100, nullable: true })
  changeType: string;

  @Column({ name: 'supplier_code', type: 'varchar', length: 30, nullable: false })
  supplierCode: string;

  @Column({ name: 'detail_status', type: 'varchar', length: 20, nullable: false })
  @Index()
  detailStatus: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @Column({ name: 'is_key_material', type: 'varchar', length: 2, nullable: true })
  isKeyMaterial: string;

  @Column({ name: 'is_compliance_material', type: 'varchar', length: 2, nullable: true })
  isComplianceMaterial: string;

  @Column({ name: 'jhrq', type: 'date', nullable: true })
  jhrq: Date;

  @Column({ name: 'sfzz', type: 'varchar', length: 100, nullable: true })
  sfzz: string;
}
