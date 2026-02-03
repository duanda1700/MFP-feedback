import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationModule as CoreNotificationModule } from '../../notification/notification.module';

@Module({
  imports: [CoreNotificationModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
