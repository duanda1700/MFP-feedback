import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ALERT')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'alert_type', type: 'int', nullable: false })
  @Index()
  alertType: number;

  @Column({ name: 'alert_level', type: 'int', nullable: false })
  @Index()
  alertLevel: number;

  @Column({ name: 'alert_content', type: 'text', nullable: false })
  alertContent: string;

  @Column({ name: 'related_task_id', type: 'int', nullable: false })
  @Index()
  relatedTaskId: number;

  @Column({ name: 'related_task_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  relatedTaskType: string;

  @Column({ name: 'alert_status', type: 'int', nullable: false })
  @Index()
  alertStatus: number;

  @Column({ name: 'create_by', type: 'int', nullable: false })
  createBy: number;

  @Column({ name: 'create_name', type: 'varchar', length: 50, nullable: false })
  createName: string;

  @Column({ name: 'process_by', type: 'int', nullable: true })
  processBy: number;

  @Column({ name: 'process_name', type: 'varchar', length: 50, nullable: true })
  processName: string;

  @Column({ name: 'process_time', type: 'datetime', nullable: true })
  processTime: Date;

  @Column({ name: 'close_time', type: 'datetime', nullable: true })
  closeTime: Date;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;
}
