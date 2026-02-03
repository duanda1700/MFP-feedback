import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ROLE_PERMISSION')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id', type: 'int', nullable: false })
  @Index()
  roleId: number;

  @Column({ name: 'permission_id', type: 'int', nullable: false })
  @Index()
  permissionId: number;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
