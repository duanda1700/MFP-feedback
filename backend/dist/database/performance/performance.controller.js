"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PerformanceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceController = void 0;
const common_1 = require("@nestjs/common");
const performance_service_1 = require("./performance.service");
let PerformanceController = PerformanceController_1 = class PerformanceController {
    performanceService;
    logger = new common_1.Logger(PerformanceController_1.name);
    constructor(performanceService) {
        this.performanceService = performanceService;
    }
    async getPerformanceStatus() {
        this.logger.log('接收到获取数据库性能状态请求');
        const status = await this.performanceService.getPerformanceStatus();
        return status;
    }
    async optimizeTables() {
        this.logger.log('接收到优化数据库表结构请求');
        await this.performanceService.optimizeTables();
        return { message: '数据库表结构优化执行成功' };
    }
    async analyzeQuery(query) {
        this.logger.log(`接收到SQL查询性能分析请求: ${query}`);
        const result = await this.performanceService.analyzeQuery(query);
        return result;
    }
    async getServerParams() {
        this.logger.log('接收到获取数据库服务器参数请求');
        const params = await this.performanceService.getServerParams();
        return params;
    }
    async optimizeServerParams(params) {
        this.logger.log('接收到优化数据库服务器参数请求');
        await this.performanceService.optimizeServerParams(params);
        return { message: '数据库服务器参数优化执行成功' };
    }
    async generateOptimizationSuggestions() {
        this.logger.log('接收到生成性能优化建议请求');
        const suggestions = await this.performanceService.generateOptimizationSuggestions();
        return { suggestions };
    }
};
exports.PerformanceController = PerformanceController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getPerformanceStatus", null);
__decorate([
    (0, common_1.Post)('optimize-tables'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "optimizeTables", null);
__decorate([
    (0, common_1.Post)('analyze-query'),
    __param(0, (0, common_1.Body)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "analyzeQuery", null);
__decorate([
    (0, common_1.Get)('server-params'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getServerParams", null);
__decorate([
    (0, common_1.Post)('optimize-server-params'),
    __param(0, (0, common_1.Body)('params')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "optimizeServerParams", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "generateOptimizationSuggestions", null);
exports.PerformanceController = PerformanceController = PerformanceController_1 = __decorate([
    (0, common_1.Controller)('api/performance'),
    __metadata("design:paramtypes", [performance_service_1.PerformanceService])
], PerformanceController);
//# sourceMappingURL=performance.controller.js.map