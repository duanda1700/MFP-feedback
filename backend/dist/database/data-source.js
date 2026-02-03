"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const purchase_details_entity_1 = require("./entities/purchase-details.entity");
const production_plan_entity_1 = require("./entities/production-plan.entity");
const feedback_data_entity_1 = require("./entities/feedback-data.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
const alert_entity_1 = require("./entities/alert.entity");
const change_record_entity_1 = require("./entities/change-record.entity");
const notification_entity_1 = require("./entities/notification.entity");
const user_entity_1 = require("../auth/entities/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
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
        user_entity_1.User,
    ],
    synchronize: false,
    logging: true,
    migrations: [],
    poolSize: 10,
    connectTimeout: 20000,
});
//# sourceMappingURL=data-source.js.map