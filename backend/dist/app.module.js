"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = require("./database/database.config");
const backup_module_1 = require("./database/backup/backup.module");
const performance_module_1 = require("./database/performance/performance.module");
const auth_module_1 = require("./auth/auth.module");
const order_module_1 = require("./order/order.module");
const plan_module_1 = require("./plan/plan.module");
const feedback_module_1 = require("./feedback/feedback.module");
const permission_module_1 = require("./permission/permission.module");
const alert_module_1 = require("./alert/alert.module");
const analytics_module_1 = require("./analytics/analytics.module");
const integration_module_1 = require("./integration/integration.module");
const task_module_1 = require("./task/task.module");
const notification_module_1 = require("./notification/notification.module");
const supplier_module_1 = require("./supplier/supplier.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(database_config_1.databaseConfig),
            backup_module_1.BackupModule,
            performance_module_1.PerformanceModule,
            auth_module_1.AuthModule,
            order_module_1.OrderModule,
            plan_module_1.PlanModule,
            feedback_module_1.FeedbackModule,
            permission_module_1.PermissionModule,
            alert_module_1.AlertModule,
            analytics_module_1.AnalyticsModule,
            integration_module_1.IntegrationModule,
            task_module_1.TaskModule,
            notification_module_1.NotificationModule,
            supplier_module_1.SupplierModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map