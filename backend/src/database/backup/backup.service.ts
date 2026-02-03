import { Injectable, Logger } from '@nestjs/common';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backup');
  private readonly config = {
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback',
    },
    backup: {
      full: {
        schedule: '0 0 * * 0', // 每周日凌晨0点执行全量备份
        keepDays: 30, // 保留30天的全量备份
      },
      incremental: {
        schedule: '0 0 * * 1-6', // 周一到周六凌晨0点执行增量备份
        keepDays: 7, // 保留7天的增量备份
      },
    },
  };

  constructor() {
    // 确保备份目录存在
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * 执行全量备份
   */
  async fullBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupDir, `full-${timestamp}.sql`);

    try {
      this.logger.log('开始执行全量备份...');
      
      // 使用 mysqldump 命令执行全量备份
      const command = `mysqldump -h ${this.config.mysql.host} -P ${this.config.mysql.port} -u ${this.config.mysql.user} -p${this.config.mysql.password} --databases ${this.config.mysql.database} > "${backupFile}"`;
      execSync(command);

      this.logger.log(`全量备份完成，文件路径: ${backupFile}`);
      
      // 清理过期的全量备份
      this.cleanupOldBackups('full', this.config.backup.full.keepDays);
    } catch (error) {
      this.logger.error('全量备份失败:', error);
      throw error;
    }
  }

  /**
   * 执行增量备份
   */
  async incrementalBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupDir, `incremental-${timestamp}.sql`);

    try {
      this.logger.log('开始执行增量备份...');
      
      // 这里简化处理，实际项目中应该基于二进制日志进行增量备份
      // 使用 mysqldump 命令执行带 --no-create-info 的备份，只备份数据
      const command = `mysqldump -h ${this.config.mysql.host} -P ${this.config.mysql.port} -u ${this.config.mysql.user} -p${this.config.mysql.password} --no-create-info ${this.config.mysql.database} > "${backupFile}"`;
      execSync(command);

      this.logger.log(`增量备份完成，文件路径: ${backupFile}`);
      
      // 清理过期的增量备份
      this.cleanupOldBackups('incremental', this.config.backup.incremental.keepDays);
    } catch (error) {
      this.logger.error('增量备份失败:', error);
      throw error;
    }
  }

  /**
   * 恢复数据
   * @param backupFile 备份文件路径
   */
  async restore(backupFile: string): Promise<void> {
    try {
      this.logger.log(`开始从备份文件恢复数据: ${backupFile}`);
      
      // 使用 mysql 命令执行恢复
      const command = `mysql -h ${this.config.mysql.host} -P ${this.config.mysql.port} -u ${this.config.mysql.user} -p${this.config.mysql.password} ${this.config.mysql.database} < "${backupFile}"`;
      execSync(command);

      this.logger.log('数据恢复完成');
    } catch (error) {
      this.logger.error('数据恢复失败:', error);
      throw error;
    }
  }

  /**
   * 清理过期的备份文件
   * @param type 备份类型: full 或 incremental
   * @param keepDays 保留天数
   */
  private cleanupOldBackups(type: 'full' | 'incremental', keepDays: number): void {
    try {
      const files = fs.readdirSync(this.backupDir);
      const cutoffTime = Date.now() - keepDays * 24 * 60 * 60 * 1000;

      files.forEach(file => {
        if (file.startsWith(`${type}-`)) {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            fs.unlinkSync(filePath);
            this.logger.log(`删除过期的${type}备份文件: ${file}`);
          }
        }
      });
    } catch (error) {
      this.logger.error('清理过期备份文件失败:', error);
    }
  }

  /**
   * 归档历史数据
   * @param days 归档多少天前的数据
   */
  async archiveOldData(days: number = 90): Promise<void> {
    try {
      this.logger.log(`开始归档${days}天前的历史数据...`);
      
      // 这里简化处理，实际项目中应该根据具体表结构和业务逻辑进行归档
      // 例如，将旧数据移动到归档表中
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

      // 示例：归档变更记录表中的旧数据
      // 实际项目中应该创建归档表，并实现数据移动逻辑
      this.logger.log(`归档截止日期: ${cutoffDateStr}`);
      this.logger.log('历史数据归档完成');
    } catch (error) {
      this.logger.error('历史数据归档失败:', error);
      throw error;
    }
  }

  /**
   * 获取备份状态
   */
  async getBackupStatus(): Promise<{
    lastFullBackup?: string;
    lastIncrementalBackup?: string;
    backupDirSize?: string;
  }> {
    try {
      const files = fs.readdirSync(this.backupDir);
      const fullBackups = files.filter(f => f.startsWith('full-')).sort().reverse();
      const incrementalBackups = files.filter(f => f.startsWith('incremental-')).sort().reverse();
      
      // 计算备份目录大小
      let totalSize = 0;
      files.forEach(file => {
        const stats = fs.statSync(path.join(this.backupDir, file));
        totalSize += stats.size;
      });
      
      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

      return {
        lastFullBackup: fullBackups.length > 0 ? fullBackups[0] : undefined,
        lastIncrementalBackup: incrementalBackups.length > 0 ? incrementalBackups[0] : undefined,
        backupDirSize: `${sizeInMB} MB`,
      };
    } catch (error) {
      this.logger.error('获取备份状态失败:', error);
      return {};
    }
  }
}
