import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('supplier')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supplier_code', type: 'varchar', length: 30, nullable: false })
  @Index()
  supplierCode: string;

  @Column({ name: 'supplier_name', type: 'varchar', length: 100, nullable: false })
  @Index()
  supplierName: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 50, nullable: true })
  contactPerson: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ name: 'status', type: 'varchar', length: 10, nullable: false })
  @Index()
  status: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}