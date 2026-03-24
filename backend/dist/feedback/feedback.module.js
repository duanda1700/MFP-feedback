"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const feedback_controller_1 = require("./feedback.controller");
const feedback_service_1 = require("./feedback.service");
const manufacture_plan_feedback_main_entity_1 = require("../database/entities/manufacture-plan-feedback-main.entity");
const manufacture_plan_feedback_version_entity_1 = require("../database/entities/manufacture-plan-feedback-version.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const todo_task_module_1 = require("../todo/todo-task.module");
let FeedbackModule = class FeedbackModule {
};
exports.FeedbackModule = FeedbackModule;
exports.FeedbackModule = FeedbackModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain,
                manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion,
                production_plan_entity_1.ProductionPlan,
                purchase_order_entity_1.PurchaseOrder,
            ]),
            (0, common_1.forwardRef)(() => todo_task_module_1.TodoTaskModule),
        ],
        controllers: [feedback_controller_1.FeedbackController],
        providers: [feedback_service_1.FeedbackService],
        exports: [feedback_service_1.FeedbackService],
    })
], FeedbackModule);
//# sourceMappingURL=feedback.module.js.map