import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('api/backup')
export class BackupController {
  private readonly logger = new Logger(BackupController.name);

  constructor(private readonly backupService: BackupService) {}

  /**
   * 执行全量备份
   */
  @Post('full')
  async fullBackup() {
    this.logger.log('接收到全量备份请求');
    await this.backupService.fullBackup();
    return { message: '全量备份执行成功' };
  }

  /**
   * 执行增量备份
   */
  @Post('incremental')
  async incrementalBackup() {
    this.logger.log('接收到增量备份请求');
    await this.backupService.incrementalBackup();
    return { message: '增量备份执行成功' };
  }

  /**
   * 恢复数据
   * @param backupFile 备份文件路径
   */
  @Post('restore')
  async restore(@Body('backupFile') backupFile: string) {
    this.logger.log(`接收到数据恢复请求，备份文件: ${backupFile}`);
    await this.backupService.restore(backupFile);
    return { message: '数据恢复执行成功' };
  }

  /**
   * 归档历史数据
   * @param days 归档多少天前的数据
   */
  @Post('archive')
  async archiveOldData(@Body('days') days: number = 90) {
    this.logger.log(`接收到历史数据归档请求，归档${days}天前的数据`);
    await this.backupService.archiveOldData(days);
    return { message: '历史数据归档执行成功' };
  }

  /**
   * 获取备份状态
   */
  @Get('status')
  async getBackupStatus() {
    this.logger.log('接收到获取备份状态请求');
    const status = await this.backupService.getBackupStatus();
    return status;
  }
}
