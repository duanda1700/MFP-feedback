import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('api/performance')
export class PerformanceController {
  private readonly logger = new Logger(PerformanceController.name);

  constructor(private readonly performanceService: PerformanceService) {}

  /**
   * 获取数据库性能状态
   */
  @Get('status')
  async getPerformanceStatus() {
    this.logger.log('接收到获取数据库性能状态请求');
    const status = await this.performanceService.getPerformanceStatus();
    return status;
  }

  /**
   * 优化数据库表结构
   */
  @Post('optimize-tables')
  async optimizeTables() {
    this.logger.log('接收到优化数据库表结构请求');
    await this.performanceService.optimizeTables();
    return { message: '数据库表结构优化执行成功' };
  }

  /**
   * 分析SQL查询性能
   * @param query SQL查询语句
   */
  @Post('analyze-query')
  async analyzeQuery(@Body('query') query: string) {
    this.logger.log(`接收到SQL查询性能分析请求: ${query}`);
    const result = await this.performanceService.analyzeQuery(query);
    return result;
  }

  /**
   * 获取数据库服务器参数
   */
  @Get('server-params')
  async getServerParams() {
    this.logger.log('接收到获取数据库服务器参数请求');
    const params = await this.performanceService.getServerParams();
    return params;
  }

  /**
   * 优化数据库服务器参数
   * @param params 要优化的参数
   */
  @Post('optimize-server-params')
  async optimizeServerParams(@Body('params') params: {
    [key: string]: any;
  }) {
    this.logger.log('接收到优化数据库服务器参数请求');
    await this.performanceService.optimizeServerParams(params);
    return { message: '数据库服务器参数优化执行成功' };
  }

  /**
   * 生成性能优化建议
   */
  @Get('suggestions')
  async generateOptimizationSuggestions() {
    this.logger.log('接收到生成性能优化建议请求');
    const suggestions = await this.performanceService.generateOptimizationSuggestions();
    return { suggestions };
  }
}
