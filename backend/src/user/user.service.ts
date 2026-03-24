import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { UserRole } from '../database/entities/user-role.entity';
import { Role } from '../database/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async getUserList(params: {
    keyword?: string;
    status?: number;
    page?: number;
    pageSize?: number;
  }) {
    const { keyword, status, page = 1, pageSize = 10 } = params;
    const where: any = {};

    if (keyword) {
      where.name = Like(`%${keyword}%`);
    }
    if (status !== undefined) {
      where.status = status;
    }

    const [list, total] = await this.userRepository.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const usersWithRoles = await Promise.all(
      list.map(async (user) => {
        const userRoles = await this.userRoleRepository.find({
          where: { userId: user.id },
          relations: ['role'],
        });
        return {
          ...user,
          roles: userRoles.map((ur) => ur.role),
        };
      })
    );

    return {
      list: usersWithRoles,
      total,
      page,
      pageSize,
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const userRoles = await this.userRoleRepository.find({
      where: { userId: id },
      relations: ['role'],
    });

    return {
      ...user,
      roles: userRoles.map((ur) => ur.role),
    };
  }

  async createUser(data: {
    username: string;
    password: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    supplierId?: number;
    roleIds?: number[];
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { username: data.username },
    });
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      username: data.username,
      password: hashedPassword,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
      supplierId: data.supplierId,
      status: 1,
    });

    const savedUser = await this.userRepository.save(user);

    if (data.roleIds && data.roleIds.length > 0) {
      await this.assignUserRoles(savedUser.id, data.roleIds);
    }

    return this.getUserById(savedUser.id);
  }

  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      department?: string;
      supplierId?: number;
      status?: number;
    }
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.department !== undefined) user.department = data.department;
    if (data.supplierId !== undefined) user.supplierId = data.supplierId;
    if (data.status !== undefined) user.status = data.status;

    await this.userRepository.save(user);

    return this.getUserById(id);
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('原密码错误');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { message: '密码修改成功' };
  }

  async resetPassword(id: number, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.save(user);

    return { message: '密码重置成功' };
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (user.username === 'admin') {
      throw new BadRequestException('不能删除管理员账户');
    }

    await this.userRoleRepository.delete({ userId: id });
    await this.userRepository.remove(user);

    return { message: '用户删除成功' };
  }

  async assignUserRoles(userId: number, roleIds: number[]) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (roleIds.length > 0) {
      const roles = await this.roleRepository.find({
        where: { id: In(roleIds) },
      });

      if (roles.length !== roleIds.length) {
        throw new BadRequestException('部分角色不存在');
      }
    }

    await this.userRoleRepository.delete({ userId });

    if (roleIds.length > 0) {
      const userRoles = roleIds.map((roleId) => ({
        userId,
        roleId,
      }));

      await this.userRoleRepository.insert(userRoles);
    }

    return this.getUserById(userId);
  }

  async updateLastLogin(userId: number, ip: string) {
    await this.userRepository.update(userId, {
      lastLoginTime: new Date(),
      lastLoginIp: ip,
    });
  }
}
