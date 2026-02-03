import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CamundaService {
  private readonly logger = new Logger(CamundaService.name);
  private readonly camundaApiUrl = 'http://localhost:8080/engine-rest'; // Camunda REST API地址

  async startProcess(processKey: string, variables: any): Promise<{ success: boolean; processInstanceId?: string; message: string }> {
    try {
      this.logger.log(`开始启动Camunda流程: ${processKey}`);
      
      const response = await axios.post(`${this.camundaApiUrl}/process-definition/key/${processKey}/start`, {
        variables: this.convertVariables(variables),
      });
      
      this.logger.log(`Camunda流程启动成功: ${response.data.id}`);
      return {
        success: true,
        processInstanceId: response.data.id,
        message: '流程启动成功',
      };
    } catch (error) {
      this.logger.error('Camunda流程启动失败', error);
      return {
        success: false,
        message: `流程启动失败: ${error.message}`,
      };
    }
  }

  async completeTask(taskId: string, variables: any): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`开始完成Camunda任务: ${taskId}`);
      
      await axios.post(`${this.camundaApiUrl}/task/${taskId}/complete`, {
        variables: this.convertVariables(variables),
      });
      
      this.logger.log(`Camunda任务完成成功: ${taskId}`);
      return {
        success: true,
        message: '任务完成成功',
      };
    } catch (error) {
      this.logger.error('Camunda任务完成失败', error);
      return {
        success: false,
        message: `任务完成失败: ${error.message}`,
      };
    }
  }

  async getTasksByProcessInstanceId(processInstanceId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.camundaApiUrl}/task`, {
        params: {
          processInstanceId,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('获取Camunda任务失败', error);
      return [];
    }
  }

  async getProcessInstance(processInstanceId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.camundaApiUrl}/process-instance/${processInstanceId}`);
      return response.data;
    } catch (error) {
      this.logger.error('获取Camunda流程实例失败', error);
      return null;
    }
  }

  private convertVariables(variables: any): any {
    const converted: any = {};
    
    for (const key in variables) {
      if (variables.hasOwnProperty(key)) {
        converted[key] = {
          value: variables[key],
          type: typeof variables[key],
        };
      }
    }
    
    return converted;
  }

  async startPurchaseTaskProcess(orderId: string, supplierId: string): Promise<{ success: boolean; processInstanceId?: string; message: string }> {
    return this.startProcess('purchaseTaskProcess', {
      orderId,
      supplierId,
      startTime: new Date().toISOString(),
    });
  }

  async startProductionPlanProcess(planId: string, plannerId: string): Promise<{ success: boolean; processInstanceId?: string; message: string }> {
    return this.startProcess('productionPlanProcess', {
      planId,
      plannerId,
      startTime: new Date().toISOString(),
    });
  }

  async startProductionPlanChangeProcess(planId: string, changeReason: string): Promise<{ success: boolean; processInstanceId?: string; message: string }> {
    return this.startProcess('productionPlanChangeProcess', {
      planId,
      changeReason,
      startTime: new Date().toISOString(),
    });
  }

  async startAlertProcess(alertId: string, alertType: string): Promise<{ success: boolean; processInstanceId?: string; message: string }> {
    return this.startProcess('alertProcess', {
      alertId,
      alertType,
      startTime: new Date().toISOString(),
    });
  }
}
