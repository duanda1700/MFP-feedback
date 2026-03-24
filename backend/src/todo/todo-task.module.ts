import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoTaskService } from './todo-task.service';
import { TodoTaskController } from './todo-task.controller';
import { TodoTask } from '../database/entities/todo-task.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoTask, User])],
  providers: [TodoTaskService],
  controllers: [TodoTaskController],
  exports: [TodoTaskService],
})
export class TodoTaskModule {}
