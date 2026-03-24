import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum TodoTaskType {
  APPROVAL = 'approval',
  TASK_RECEIVE = 'task_receive',
  PROGRESS_FEEDBACK = 'progress_feedback',
  ALERT_HANDLE = 'alert_handle',
  ORDER_CONFIRM = 'order_confirm',
  PLAN_CONFIRM = 'plan_confirm',
}

export enum TodoTaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TodoTaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('TODO_TASK')
export class TodoTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  taskType: TodoTaskType;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ name: 'content', type: 'text', nullable: true })
  content: string;

  @Column({ name: 'priority', type: 'varchar', length: 20, nullable: false, default: TodoTaskPriority.MEDIUM })
  priority: TodoTaskPriority;

  @Column({ name: 'status', type: 'varchar', length: 20, nullable: false, default: TodoTaskStatus.PENDING })
  @Index()
  status: TodoTaskStatus;

  @Column({ name: 'assignee_id', type: 'int', nullable: false })
  @Index()
  assigneeId: number;

  @Column({ name: 'assignee_name', type: 'varchar', length: 100, nullable: false })
  assigneeName: string;

  @Column({ name: 'creator_id', type: 'int', nullable: false })
  @Index()
  creatorId: number;

  @Column({ name: 'creator_name', type: 'varchar', length: 100, nullable: false })
  creatorName: string;

  @Column({ name: 'related_type', type: 'varchar', length: 50, nullable: true })
  @Index()
  relatedType: string;

  @Column({ name: 'related_id', type: 'varchar', length: 100, nullable: true })
  @Index()
  relatedId: string;

  @Column({ name: 'related_data', type: 'json', nullable: true })
  relatedData: any;

  @Column({ name: 'due_date', type: 'datetime', nullable: true })
  @Index()
  dueDate: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;

  @Column({ name: 'completed_by', type: 'int', nullable: true })
  completedBy: number | null;

  @Column({ name: 'remark', type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator: User;
}
