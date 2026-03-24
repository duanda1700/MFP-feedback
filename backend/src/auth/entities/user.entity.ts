import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('USER')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true, nullable: false })
  @Index()
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'name', type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'department', type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplierId: number;

  @Column({ name: 'status', type: 'tinyint', default: 1, nullable: false })
  status: number;

  @Column({ name: 'last_login_time', type: 'datetime', nullable: true })
  lastLoginTime: Date;

  @Column({ name: 'last_login_ip', type: 'varchar', length: 50, nullable: true })
  lastLoginIp: string;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
