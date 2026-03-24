import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../auth/entities/user.entity';
import { UserRole } from '../database/entities/user-role.entity';
import { Role } from '../database/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Role])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
