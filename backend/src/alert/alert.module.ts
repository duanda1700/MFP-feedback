import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { Alert } from '../database/entities/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alert])],
  providers: [AlertService],
  controllers: [AlertController],
  exports: [AlertService],
})
export class AlertModule {}
