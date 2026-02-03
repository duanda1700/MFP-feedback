import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ErpService } from '../erp/erp.service';
import { AlertService } from '../../alert/alert.service';
import { DataSource } from 'typeorm';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly erpService: ErpService,
    private readonly alertService: AlertService,
    private readonly dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCronSyncErpData() {
    this.logger.log('开始执行定时同步ERP数据任务');
    try {
      const result = await this.erpService.syncErpData();
      if (result.success) {
        this.logger.log('定时同步ERP数据任务执行成功');
      } else {
        this.logger.error(`定时同步ERP数据任务执行失败: ${result.message}`);
      }
    } catch (error) {
      this.logger.error('定时同步ERP数据任务执行异常', error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronCheckAlerts() {
    this.logger.log('开始执行定时检测预警规则任务');
    try {
      await this.alertService.checkAlertRules();
      this.logger.log('定时检测预警规则任务执行成功');
    } catch (error) {
      this.logger.error('定时检测预警规则任务执行异常', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronArchiveData() {
    this.logger.log('开始执行定时归档历史数据任务');
    try {
      await this.archiveHistoricalData();
      this.logger.log('定时归档历史数据任务执行成功');
    } catch (error) {
      this.logger.error('定时归档历史数据任务执行异常', error);
    }
  }

  private async archiveHistoricalData() {
    // 归档一年前的采购订单数据
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // 这里实现具体的归档逻辑
    // 例如：将旧数据移动到归档表，或标记为已归档状态
    
    this.logger.log(`归档${oneYearAgo.toISOString()}之前的历史数据`);

    // 示例：更新订单状态为已归档
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
      await queryRunner.startTransaction();
      
      // 更新采购订单状态
      await queryRunner.query(
        'UPDATE purchase_order SET status = ? WHERE created_at < ? AND status = ?',
        ['ARCHIVED', oneYearAgo, 'COMPLETED'],
      );
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
