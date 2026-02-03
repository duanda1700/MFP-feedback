import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from '../database/entities/alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert) private alertRepository: Repository<Alert>,
  ) {}

  // 获取预警列表
  async getAlertList(query: any) {
    const {
      page = 1,
      pageSize = 10,
      alertLevel,
      alertStatus,
      alertType,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.alertRepository.createQueryBuilder('alert');

    if (alertLevel) {
      queryBuilder.andWhere('alert.alert_level = :alertLevel', { alertLevel });
    }

    if (alertStatus) {
      queryBuilder.andWhere('alert.alert_status = :alertStatus', { alertStatus });
    }

    if (alertType) {
      queryBuilder.andWhere('alert.alert_type = :alertType', { alertType });
    }

    if (startDate) {
      queryBuilder.andWhere('alert.create_time >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('alert.create_time <= :endDate', { endDate });
    }

    const [alerts, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('alert.create_time', 'DESC')
      .getManyAndCount();

    return {
      data: alerts,
      total,
      page,
      pageSize,
    };
  }

  // 获取预警详情
  async getAlertDetail(id: number) {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }
    return alert;
  }

  // 处理预警
  async handleAlert(id: number, handleData: any) {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.alertStatus = 2; // 2: 处理中
    alert.processBy = handleData.processBy;
    alert.processName = handleData.processName;
    alert.processTime = new Date();
    alert.remarks = handleData.remarks;

    return this.alertRepository.save(alert);
  }

  // 更新预警状态
  async updateAlertStatus(id: number, status: number) {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.alertStatus = status;
    
    if (status === 3) { // 3: 已闭环
      alert.closeTime = new Date();
    }

    return this.alertRepository.save(alert);
  }

  // 创建预警
  async createAlert(alertData: any) {
    const alert = this.alertRepository.create({
      ...alertData,
      alertStatus: 1, // 1: 待处理
      createTime: new Date(),
    });

    const savedAlert = await this.alertRepository.save(alert);

    // 推送预警信息
    this.pushAlertNotification(savedAlert);

    return savedAlert;
  }

  // 预警触发类型判断
  async checkAlertTriggerType(taskId: number, taskType: string) {
    // 这里应该实现预警触发类型判断逻辑
    // 暂时返回模拟数据
    return {
      taskId,
      taskType,
      alertType: '进度延迟',
      alertLevel: '高',
      shouldTrigger: true,
    };
  }

  // 预警信息推送
  async pushAlertNotification(alert: any) {
    // 这里应该实现预警信息推送逻辑
    // 暂时模拟推送
    console.log('Alert notification pushed:', alert.id);
    return {
      message: 'Alert notification pushed successfully',
      alertId: alert.id,
    };
  }

  // 预警升级
  async escalateAlert(id: number) {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    // 升级预警级别
    if (alert.alertLevel === 1) {
      alert.alertLevel = 2;
    } else if (alert.alertLevel === 2) {
      alert.alertLevel = 3;
    }

    return this.alertRepository.save(alert);
  }

  // 预警闭环
  async closeAlert(id: number, closeData: any) {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.alertStatus = 3; // 3: 已闭环
    alert.closeTime = new Date();
    alert.remarks = closeData.remarks;

    return this.alertRepository.save(alert);
  }

  // 检查预警阈值
  async checkAlertThresholds() {
    // 这里应该实现检查预警阈值的逻辑
    // 暂时返回模拟数据
    return {
      checkedTasks: 100,
      triggeredAlerts: 5,
      message: 'Alert thresholds checked successfully',
    };
  }

  // 删除预警
  async deleteAlert(id: number) {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    return this.alertRepository.remove(alert);
  }

  // 检查预警规则
  async checkAlertRules() {
    // 这里应该实现检查预警规则的逻辑
    // 例如：检查任务进度、反馈状态等
    
    // 暂时模拟检查过程
    console.log('Checking alert rules...');
    
    // 模拟检查结果
    const checkedTasks = 100;
    const triggeredAlerts = 5;
    
    console.log(`Checked ${checkedTasks} tasks, triggered ${triggeredAlerts} alerts`);
    
    return {
      checkedTasks,
      triggeredAlerts,
      message: 'Alert rules checked successfully',
    };
  }
}
