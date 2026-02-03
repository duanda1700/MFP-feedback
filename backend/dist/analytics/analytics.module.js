"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const analytics_service_1 = require("./analytics.service");
const analytics_controller_1 = require("./analytics.controller");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const feedback_data_entity_1 = require("../database/entities/feedback-data.entity");
const alert_entity_1 = require("../database/entities/alert.entity");
const task_module_1 = require("../task/task.module");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([purchase_order_entity_1.PurchaseOrder, purchase_details_entity_1.PurchaseDetails, production_plan_entity_1.ProductionPlan, feedback_data_entity_1.FeedbackData, alert_entity_1.Alert]), task_module_1.TaskModule],
        providers: [analytics_service_1.AnalyticsService],
        controllers: [analytics_controller_1.AnalyticsController],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map