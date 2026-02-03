import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('NOTIFICATION_TEMPLATE')
export class NotificationTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'template_name', type: 'varchar', length: 100, nullable: false })
  @Index()
  templateName: string;

  @Column({ name: 'template_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  templateType: string; // alert, approval, task, other

  @Column({ name: 'subject_template', type: 'varchar', length: 200, nullable: false })
  subjectTemplate: string;

  @Column({ name: 'content_template', type: 'text', nullable: false })
  contentTemplate: string;

  @Column({ name: 'link_template', type: 'varchar', length: 500, nullable: true })
  linkTemplate: string;

  @Column({ name: 'is_default', type: 'boolean', nullable: false, default: false })
  isDefault: boolean;

  @Column({ name: 'status', type: 'varchar', length: 20, nullable: false, default: 'active' })
  status: string; // active, inactive

  @Column({ name: 'created_by', type: 'int', nullable: false })
  createdBy: number;

  @Column({ name: 'created_name', type: 'varchar', length: 50, nullable: false })
  createdName: string;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updatedBy: number;

  @Column({ name: 'updated_name', type: 'varchar', length: 50, nullable: true })
  updatedName: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
