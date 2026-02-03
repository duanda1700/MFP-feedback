import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('TASK')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  taskType: string;

  @Column({ name: 'task_status', type: 'varchar', length: 20, nullable: false })
  @Index()
  taskStatus: string; // pending, processing, completed, failed

  @Column({ name: 'task_data', type: 'json', nullable: true })
  taskData: any;

  @Column({ name: 'result_data', type: 'json', nullable: true })
  resultData: any;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'progress', type: 'int', nullable: false, default: 0 })
  progress: number;

  @Column({ name: 'created_by', type: 'int', nullable: false })
  createdBy: number;

  @Column({ name: 'created_name', type: 'varchar', length: 50, nullable: false })
  createdName: string;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
