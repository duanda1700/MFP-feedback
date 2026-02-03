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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpController = void 0;
const common_1 = require("@nestjs/common");
const erp_service_1 = require("./erp.service");
let ErpController = class ErpController {
    erpService;
    constructor(erpService) {
        this.erpService = erpService;
    }
    async syncErpData() {
        return this.erpService.syncErpData();
    }
    async manuallySyncErpData() {
        return this.erpService.manuallySyncErpData();
    }
};
exports.ErpController = ErpController;
__decorate([
    (0, common_1.Post)('sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ErpController.prototype, "syncErpData", null);
__decorate([
    (0, common_1.Post)('manual-sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ErpController.prototype, "manuallySyncErpData", null);
exports.ErpController = ErpController = __decorate([
    (0, common_1.Controller)('api/integration/erp'),
    __metadata("design:paramtypes", [erp_service_1.ErpService])
], ErpController);
//# sourceMappingURL=erp.controller.js.map