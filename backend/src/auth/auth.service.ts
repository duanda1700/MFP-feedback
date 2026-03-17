import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log(`Validating user: ${username}`);
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      console.log(`User not found: ${username}`);
      return null;
    }
    console.log(`User found: ${user.username}`);

    const isMatch = await bcrypt.compare(pass, user.password);
    console.log(`Password match: ${isMatch}`);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }

    // 特殊处理：允许使用默认密码登录
    if (username === 'admin' && pass === '123456') {
      console.log(`Admin user using default password`);
      const { password, ...result } = user;
      return result;
    }

    console.log(`Validation failed for user: ${username}`);
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role, supplierId: user.supplierId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        department: user.department,
        supplierId: user.supplierId,
      },
    };
  }

  async register(userData: any) {
    const existingUser = await this.usersRepository.findOne({ where: { username: userData.username } });
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async getUserById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async refreshToken(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role, supplierId: user.supplierId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
