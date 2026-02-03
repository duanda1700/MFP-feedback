import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('NOTIFICATION_RECORD')
export class NotificationRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'notification_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  notificationType: string; // alert, approval, task, other

  @Column({ name: 'delivery_channel', type: 'varchar', length: 50, nullable: false })
  @Index()
  deliveryChannel: string; // email, wechat, inapp

  @Column({ name: 'recipient', type: 'varchar', length: 200, nullable: false })
  @Index()
  recipient: string; // email address or wechat user id or user id

  @Column({ name: 'recipient_name', type: 'varchar', length: 100, nullable: true })
  recipientName: string;

  @Column({ name: 'subject', type: 'varchar', length: 200, nullable: false })
  subject: string;

  @Column({ name: 'content', type: 'text', nullable: true })
  content: string;

  @Column({ name: 'link_url', type: 'varchar', length: 500, nullable: true })
  linkUrl: string;

  @Column({ name: 'send_status', type: 'varchar', length: 20, nullable: false })
  @Index()
  sendStatus: string; // pending, sent, failed

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'related_id', type: 'varchar', length: 100, nullable: true })
  @Index()
  relatedId: string; // related alert id, approval id, task id

  @Column({ name: 'related_type', type: 'varchar', length: 50, nullable: true })
  relatedType: string; // alert, approval, task

  @Column({ name: 'template_id', type: 'int', nullable: true })
  @Index()
  templateId: number;

  @Column({ name: 'sent_at', type: 'datetime', nullable: true })
  @Index()
  sentAt: Date;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
