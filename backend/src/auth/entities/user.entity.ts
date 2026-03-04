import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true, nullable: false })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ name: 'role', type: 'varchar', length: 50, nullable: false })
  role: string;

  @Column({ name: 'department', type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplierId: number;

  @Column({ name: 'is_active', type: 'tinyint', default: 1, nullable: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
