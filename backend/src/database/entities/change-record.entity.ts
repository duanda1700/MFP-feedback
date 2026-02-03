import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('CHANGE_RECORD')
export class ChangeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'related_type', type: 'varchar', length: 50, nullable: false })
  @Index()
  relatedType: string;

  @Column({ name: 'related_id', type: 'int', nullable: false })
  @Index()
  relatedId: number;

  @Column({ name: 'change_type', type: 'int', nullable: false })
  @Index()
  changeType: number;

  @Column({ name: 'change_content', type: 'text', nullable: false })
  changeContent: string;

  @Column({ name: 'operator_id', type: 'int', nullable: false })
  @Index()
  operatorId: number;

  @Column({ name: 'operator_name', type: 'varchar', length: 50, nullable: false })
  operatorName: string;

  @Column({ name: 'change_time', type: 'datetime', nullable: false })
  @Index()
  changeTime: Date;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
