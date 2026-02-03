import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('NOTIFICATION')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'notification_type', type: 'int', nullable: false })
  @Index()
  notificationType: number;

  @Column({ name: 'notification_content', type: 'text', nullable: false })
  notificationContent: string;

  @Column({ name: 'receiver_id', type: 'int', nullable: false })
  @Index()
  receiverId: number;

  @Column({ name: 'receiver_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  receiverType: string;

  @Column({ name: 'notification_status', type: 'int', nullable: false })
  @Index()
  notificationStatus: number;

  @Column({ name: 'send_time', type: 'datetime', nullable: false })
  @Index()
  sendTime: Date;

  @Column({ name: 'read_time', type: 'datetime', nullable: true })
  readTime: Date;

  @Column({ name: 'create_by', type: 'int', nullable: false })
  createBy: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
