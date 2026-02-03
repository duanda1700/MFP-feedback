"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationModule = void 0;
const common_1 = require("@nestjs/common");
const erp_module_1 = require("./erp/erp.module");
const camunda_module_1 = require("./camunda/camunda.module");
const notification_module_1 = require("./notification/notification.module");
const schedule_module_1 = require("./schedule/schedule.module");
let IntegrationModule = class IntegrationModule {
};
exports.IntegrationModule = IntegrationModule;
exports.IntegrationModule = IntegrationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            erp_module_1.ErpModule,
            camunda_module_1.CamundaModule,
            notification_module_1.NotificationModule,
            schedule_module_1.AppScheduleModule,
        ],
        exports: [
            erp_module_1.ErpModule,
            camunda_module_1.CamundaModule,
            notification_module_1.NotificationModule,
            schedule_module_1.AppScheduleModule,
        ],
    })
], IntegrationModule);
//# sourceMappingURL=integration.module.js.map