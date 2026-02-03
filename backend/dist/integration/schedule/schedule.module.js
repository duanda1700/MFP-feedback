"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppScheduleModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const schedule_service_1 = require("./schedule.service");
const erp_module_1 = require("../erp/erp.module");
const alert_module_1 = require("../../alert/alert.module");
let AppScheduleModule = class AppScheduleModule {
};
exports.AppScheduleModule = AppScheduleModule;
exports.AppScheduleModule = AppScheduleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            erp_module_1.ErpModule,
            alert_module_1.AlertModule,
        ],
        providers: [schedule_service_1.ScheduleService],
        exports: [schedule_service_1.ScheduleService],
    })
], AppScheduleModule);
//# sourceMappingURL=schedule.module.js.map