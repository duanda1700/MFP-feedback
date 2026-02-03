"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const analytics_service_1 = require("./analytics.service");
const permission_guard_1 = require("../permission/guards/permission.guard");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getStatistics() {
        return this.analyticsService.getStatistics();
    }
    async getTrendData(type, period) {
        return this.analyticsService.getTrendData(type, period);
    }
    async exportReport(body) {
        return this.analyticsService.exportReport(body.reportType, body.filters || {}, body.createdBy, body.createdName);
    }
    async downloadReport(fileName, res) {
        const filePath = path.join(__dirname, '..', '..', 'reports', fileName);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    }
    async getOrderChangeStatistics(filters) {
        return this.analyticsService.getOrderChangeStatistics(filters);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('statistics'),
    (0, permission_guard_1.RequirePermission)('analytics:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('trend'),
    (0, permission_guard_1.RequirePermission)('analytics:read'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrendData", null);
__decorate([
    (0, common_1.Post)('export-report'),
    (0, permission_guard_1.RequirePermission)('analytics:export'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('download-report'),
    (0, permission_guard_1.RequirePermission)('analytics:export'),
    __param(0, (0, common_1.Query)('file')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "downloadReport", null);
__decorate([
    (0, common_1.Post)('order-change-statistics'),
    (0, permission_guard_1.RequirePermission)('analytics:read'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOrderChangeStatistics", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('api/analytics'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map