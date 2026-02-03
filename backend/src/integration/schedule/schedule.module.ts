import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { ErpModule } from '../erp/erp.module';
import { AlertModule } from '../../alert/alert.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ErpModule,
    AlertModule,
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class AppScheduleModule {}
