"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTrackingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_tracking_controller_1 = require("./order-tracking.controller");
const order_tracking_service_1 = require("./order-tracking.service");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const manufacture_plan_feedback_main_entity_1 = require("../database/entities/manufacture-plan-feedback-main.entity");
const manufacture_plan_feedback_version_entity_1 = require("../database/entities/manufacture-plan-feedback-version.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
let OrderTrackingModule = class OrderTrackingModule {
};
exports.OrderTrackingModule = OrderTrackingModule;
exports.OrderTrackingModule = OrderTrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                purchase_order_entity_1.PurchaseOrder,
                production_plan_entity_1.ProductionPlan,
                manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain,
                manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion,
                purchase_details_entity_1.PurchaseDetails,
            ]),
        ],
        controllers: [order_tracking_controller_1.OrderTrackingController],
        providers: [order_tracking_service_1.OrderTrackingService],
    })
], OrderTrackingModule);
//# sourceMappingURL=order-tracking.module.js.map