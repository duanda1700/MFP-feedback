"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpModule = void 0;
const common_1 = require("@nestjs/common");
const erp_controller_1 = require("./erp.controller");
const erp_service_1 = require("./erp.service");
let ErpModule = class ErpModule {
};
exports.ErpModule = ErpModule;
exports.ErpModule = ErpModule = __decorate([
    (0, common_1.Module)({
        controllers: [erp_controller_1.ErpController],
        providers: [erp_service_1.ErpService],
        exports: [erp_service_1.ErpService],
    })
], ErpModule);
//# sourceMappingURL=erp.module.js.map