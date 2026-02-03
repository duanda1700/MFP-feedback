import { Module } from '@nestjs/common';
import { ErpModule } from './erp/erp.module';
import { CamundaModule } from './camunda/camunda.module';
import { NotificationModule } from './notification/notification.module';
import { AppScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ErpModule,
    CamundaModule,
    NotificationModule,
    AppScheduleModule,
  ],
  exports: [
    ErpModule,
    CamundaModule,
    NotificationModule,
    AppScheduleModule,
  ],
})
export class IntegrationModule {}
