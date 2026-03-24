"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const purchase_details_entity_1 = require("./entities/purchase-details.entity");
const production_plan_entity_1 = require("./entities/production-plan.entity");
const feedback_data_entity_1 = require("./entities/feedback-data.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
const alert_entity_1 = require("./entities/alert.entity");
const change_record_entity_1 = require("./entities/change-record.entity");
const notification_entity_1 = require("./entities/notification.entity");
const purchase_order_task_entity_1 = require("./entities/purchase-order-task.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const operation_log_entity_1 = require("./entities/operation-log.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const manufacture_plan_feedback_main_entity_1 = require("./entities/manufacture-plan-feedback-main.entity");
const manufacture_plan_feedback_version_entity_1 = require("./entities/manufacture-plan-feedback-version.entity");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
const user_role_entity_1 = require("./entities/user-role.entity");
const todo_task_entity_1 = require("./entities/todo-task.entity");
exports.databaseConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback',
    entities: [
        purchase_order_entity_1.PurchaseOrder,
        purchase_details_entity_1.PurchaseDetails,
        production_plan_entity_1.ProductionPlan,
        feedback_data_entity_1.FeedbackData,
        role_permission_entity_1.RolePermission,
        alert_entity_1.Alert,
        change_record_entity_1.ChangeRecord,
        notification_entity_1.Notification,
        purchase_order_task_entity_1.PurchaseOrderTask,
        supplier_entity_1.Supplier,
        operation_log_entity_1.OperationLog,
        user_entity_1.User,
        manufacture_plan_feedback_main_entity_1.ManufacturePlanFeedbackMain,
        manufacture_plan_feedback_version_entity_1.ManufacturePlanFeedbackVersion,
        role_entity_1.Role,
        permission_entity_1.Permission,
        user_role_entity_1.UserRole,
        todo_task_entity_1.TodoTask,
    ],
    synchronize: false,
    logging: true,
    poolSize: 10,
    connectTimeout: 20000,
};
//# sourceMappingURL=database.config.js.map