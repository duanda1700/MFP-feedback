"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const purchase_details_entity_1 = require("./entities/purchase-details.entity");
const production_plan_entity_1 = require("./entities/production-plan.entity");
const feedback_data_entity_1 = require("./entities/feedback-data.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
const alert_entity_1 = require("./entities/alert.entity");
const change_record_entity_1 = require("./entities/change-record.entity");
const notification_entity_1 = require("./entities/notification.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                purchase_order_entity_1.PurchaseOrder,
                purchase_details_entity_1.PurchaseDetails,
                production_plan_entity_1.ProductionPlan,
                feedback_data_entity_1.FeedbackData,
                role_permission_entity_1.RolePermission,
                alert_entity_1.Alert,
                change_record_entity_1.ChangeRecord,
                notification_entity_1.Notification,
            ]),
        ],
        exports: [
            typeorm_1.TypeOrmModule.forFeature([
                purchase_order_entity_1.PurchaseOrder,
                purchase_details_entity_1.PurchaseDetails,
                production_plan_entity_1.ProductionPlan,
                feedback_data_entity_1.FeedbackData,
                role_permission_entity_1.RolePermission,
                alert_entity_1.Alert,
                change_record_entity_1.ChangeRecord,
                notification_entity_1.Notification,
            ]),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map