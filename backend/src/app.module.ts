import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './database/database.config';
import { BackupModule } from './database/backup/backup.module';
import { PerformanceModule } from './database/performance/performance.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { PlanModule } from './plan/plan.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PermissionModule } from './permission/permission.module';
import { AlertModule } from './alert/alert.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { IntegrationModule } from './integration/integration.module';
import { TaskModule } from './task/task.module';
import { NotificationModule } from './notification/notification.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    BackupModule,
    PerformanceModule,
    AuthModule,
    OrderModule,
    PlanModule,
    FeedbackModule,
    PermissionModule,
    AlertModule,
    AnalyticsModule,
    IntegrationModule,
    TaskModule,
    NotificationModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
