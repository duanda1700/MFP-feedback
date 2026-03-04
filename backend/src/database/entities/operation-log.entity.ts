import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('operation_log')
export class OperationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'operation_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  operationType: string;

  @Column({ name: 'operation_desc', type: 'text', nullable: true })
  operationDesc: string;

  @Column({ name: 'operator', type: 'varchar', length: 50, nullable: false })
  operator: string;

  @Column({ name: 'operated_at', type: 'datetime', nullable: false })
  @Index()
  operatedAt: Date;

  @Column({ name: 'related_id', type: 'varchar', length: 50, nullable: true })
  @Index()
  relatedId: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;
}