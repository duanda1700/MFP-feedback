import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../database/entities/notification.entity';
import { NotificationTemplate } from '../database/entities/notification-template.entity';
import { NotificationRecord } from '../database/entities/notification-record.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationTemplateController } from './notification-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationTemplate, NotificationRecord])],
  controllers: [NotificationController, NotificationTemplateController],
  providers: [NotificationService, NotificationTemplateService],
  exports: [NotificationService, NotificationTemplateService],
})
export class NotificationModule {}
