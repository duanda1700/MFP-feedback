import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseDetails } from './entities/purchase-details.entity';
import { ProductionPlan } from './entities/production-plan.entity';
import { FeedbackData } from './entities/feedback-data.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Alert } from './entities/alert.entity';
import { ChangeRecord } from './entities/change-record.entity';
import { Notification } from './entities/notification.entity';
import { PurchaseOrderTask } from './entities/purchase-order-task.entity';
import { Supplier } from './entities/supplier.entity';
import { OperationLog } from './entities/operation-log.entity';
import { User } from '../auth/entities/user.entity';
import { ManufacturePlanFeedbackMain } from './entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from './entities/manufacture-plan-feedback-version.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { TodoTask } from './entities/todo-task.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'ab123=ab123',
  database: 'mfp_feedback',
  entities: [
    PurchaseOrder,
    PurchaseDetails,
    ProductionPlan,
    FeedbackData,
    RolePermission,
    Alert,
    ChangeRecord,
    Notification,
    PurchaseOrderTask,
    Supplier,
    OperationLog,
    User,
    ManufacturePlanFeedbackMain,
    ManufacturePlanFeedbackVersion,
    Role,
    Permission,
    UserRole,
    TodoTask,
  ],
  synchronize: false,
  logging: true,
  poolSize: 10,
  connectTimeout: 20000,
};
