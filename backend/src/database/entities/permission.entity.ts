import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('PERMISSION')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true, nullable: false })
  @Index()
  name: string;

  @Column({ name: 'code', type: 'varchar', length: 100, unique: true, nullable: false })
  @Index()
  code: string;

  @Column({ name: 'module', type: 'varchar', length: 50, nullable: false })
  @Index()
  module: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'status', type: 'tinyint', default: 1, nullable: false })
  status: number;

  @Column({ name: 'sort_order', type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
