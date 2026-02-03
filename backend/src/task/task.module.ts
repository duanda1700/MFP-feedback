import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../database/entities/task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    IntegrationModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
