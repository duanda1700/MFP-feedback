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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const excel_service_1 = require("./excel.service");
let ExcelController = class ExcelController {
    excelService;
    constructor(excelService) {
        this.excelService = excelService;
    }
    async exportBatchOrders(body, res) {
        try {
            if (!body.djbHList || body.djbHList.length === 0) {
                throw new common_1.BadRequestException('请选择要导出的订单');
            }
            const buffer = await this.excelService.exportBatchOrders(body.djbHList);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=feedback_batch_${Date.now()}.xlsx`);
            res.send(buffer);
        }
        catch (error) {
            throw new common_1.BadRequestException(`导出失败: ${error.message}`);
        }
    }
    async importFeedbackData(file, body) {
        if (!file) {
            throw new common_1.BadRequestException('请上传文件');
        }
        if (!file.originalname.endsWith('.xlsx') && !file.originalname.endsWith('.xls')) {
            throw new common_1.BadRequestException('请上传Excel文件（.xlsx或.xls格式）');
        }
        try {
            const result = await this.excelService.importFeedbackData(file.buffer, body.creator || 'system');
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(`导入失败: ${error.message}`);
        }
    }
};
exports.ExcelController = ExcelController;
__decorate([
    (0, common_1.Post)('export/batch'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExcelController.prototype, "exportBatchOrders", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExcelController.prototype, "importFeedbackData", null);
exports.ExcelController = ExcelController = __decorate([
    (0, common_1.Controller)('api/excel'),
    __metadata("design:paramtypes", [excel_service_1.ExcelService])
], ExcelController);
//# sourceMappingURL=excel.controller.js.map