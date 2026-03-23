"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const user_entity_1 = require("../../auth/entities/user.entity");
const purchase_order_entity_1 = require("../entities/purchase-order.entity");
const purchase_details_entity_1 = require("../entities/purchase-details.entity");
const production_plan_entity_1 = require("../entities/production-plan.entity");
const feedback_data_entity_1 = require("../entities/feedback-data.entity");
const alert_entity_1 = require("../entities/alert.entity");
const task_entity_1 = require("../entities/task.entity");
const notification_entity_1 = require("../entities/notification.entity");
const change_record_entity_1 = require("../entities/change-record.entity");
const role_permission_entity_1 = require("../entities/role-permission.entity");
async function seedTestData() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('数据库连接成功');
        const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const purchaseOrderRepository = data_source_1.AppDataSource.getRepository(purchase_order_entity_1.PurchaseOrder);
        const purchaseDetailsRepository = data_source_1.AppDataSource.getRepository(purchase_details_entity_1.PurchaseDetails);
        const productionPlanRepository = data_source_1.AppDataSource.getRepository(production_plan_entity_1.ProductionPlan);
        const feedbackDataRepository = data_source_1.AppDataSource.getRepository(feedback_data_entity_1.FeedbackData);
        const alertRepository = data_source_1.AppDataSource.getRepository(alert_entity_1.Alert);
        const taskRepository = data_source_1.AppDataSource.getRepository(task_entity_1.Task);
        const notificationRepository = data_source_1.AppDataSource.getRepository(notification_entity_1.Notification);
        const changeRecordRepository = data_source_1.AppDataSource.getRepository(change_record_entity_1.ChangeRecord);
        const rolePermissionRepository = data_source_1.AppDataSource.getRepository(role_permission_entity_1.RolePermission);
        console.log('开始插入用户测试数据...');
        const users = [
            {
                username: 'admin',
                password: '$2b$10$eGJ1w4t6Q3JgH7b9K8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0',
                name: '管理员',
                role: 'admin',
                department: 'IT部门',
                isActive: true
            },
            {
                username: 'user1',
                password: '$2b$10$eGJ1w4t6Q3JgH7b9K8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0',
                name: '用户1',
                role: 'user',
                department: '采购部门',
                isActive: true
            },
            {
                username: 'user2',
                password: '$2b$10$eGJ1w4t6Q3JgH7b9K8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0',
                name: '用户2',
                role: 'user',
                department: '生产部门',
                isActive: true
            }
        ];
        for (const userData of users) {
            const existingUser = await userRepository.findOne({ where: { username: userData.username } });
            if (!existingUser) {
                const user = userRepository.create(userData);
                await userRepository.save(user);
                console.log(`插入用户: ${userData.username}`);
            }
        }
        console.log('开始插入采购订单测试数据...');
        const orderCount = 10;
        const detailsPerOrder = 10;
        const purchaseDetailsIds = [];
        for (let i = 1; i <= orderCount; i++) {
            const instanceId = i;
            const purchaseOrder = purchaseOrderRepository.create({
                bpmCgddId: i,
                bpmCgddInstanceId: instanceId,
                djbH: `PO-${Date.now()}-${i}`,
                applyUsername: '测试用户',
                applyUserno: 'test' + i,
                applyDept: '采购部门',
                major: '测试专业',
                project: '测试项目',
                orderStatus: ['待下发', '有变更', '已完成'][i % 3],
                setCount: '1',
                supplierName: `供应商${i}`,
                purchaseManager: '采购经理'
            });
            await purchaseOrderRepository.save(purchaseOrder);
            console.log(`插入采购订单: ${purchaseOrder.djbH}`);
            for (let j = 1; j <= detailsPerOrder; j++) {
                const detailIndex = (i - 1) * detailsPerOrder + j;
                const timestamp = Date.now().toString().slice(-8);
                const seq = detailIndex.toString().padStart(4, '0');
                const id = `PD${timestamp}${seq}`.slice(0, 16);
                const purchaseDetails = purchaseDetailsRepository.create({
                    id: id,
                    bpmCgddmxId: detailIndex,
                    bpmCgddInstanceId: instanceId,
                    receiveCompany: '测试公司',
                    materialCode: `MAT${detailIndex}`,
                    materialDesc: `物料${detailIndex}`,
                    quantity: 100 * detailIndex,
                    planDate: new Date(),
                    planNo: `PLAN${detailIndex}`,
                    productType: '测试产品',
                    orderNo: `ORD${detailIndex}`,
                    setCount: '1',
                    supplierCode: `SUP${i}`,
                    detailStatus: ['待处理', '已下发', '已完成'][j % 3]
                });
                await purchaseDetailsRepository.save(purchaseDetails);
                purchaseDetailsIds.push(id);
                if (detailIndex % 10 === 0) {
                    console.log(`已插入 ${detailIndex} 条采购详情`);
                }
            }
        }
        console.log('采购详情插入完成，共插入 100 条数据');
        console.log('开始插入生产计划测试数据...');
        for (let i = 0; i < 100; i++) {
            const timestamp = Date.now().toString().slice(-8);
            const seq = (i + 1).toString().padStart(4, '0');
            const id = `PP${timestamp}${seq}`.slice(0, 16);
            const productionPlan = productionPlanRepository.create({
                id: id,
                purchaseDetailsId: i + 1,
                planName: `生产计划${i + 1}`,
                planType: '测试类型',
                planDept: '生产部门',
                planMaker: '管理员',
                planDate: new Date(),
                quantity: 100 * (i + 1),
                unit: '个',
                plannedDate: new Date(),
                finishedQuantity: 0,
                planStatus: ['待确认', '已确认', '已完成'][(i + 1) % 3],
                materialCode: `MAT${i + 1}`,
                materialDesc: `物料${i + 1}`,
                isKeyMaterial: (i + 1) % 2 === 0 ? '是' : '否',
                productionLine: `生产线${(i + 1) % 5 + 1}`,
                remarks: `备注${i + 1}`
            });
            await productionPlanRepository.save(productionPlan);
            if ((i + 1) % 10 === 0) {
                console.log(`已插入 ${i + 1} 条生产计划`);
            }
        }
        console.log('生产计划插入完成，共插入 100 条数据');
        console.log('开始插入反馈数据测试数据...');
        for (let i = 1; i <= 3; i++) {
            const feedbackData = feedbackDataRepository.create({
                orderId: i,
                planId: i,
                feedbackTime: new Date(),
                feedbackContent: `反馈内容${i}`,
                feedbackStatus: i % 3,
                operatorId: 1,
                operatorName: '管理员',
                supplierId: i,
                supplierName: `供应商${i}`
            });
            await feedbackDataRepository.save(feedbackData);
            console.log(`插入反馈数据: 反馈${i}`);
        }
        console.log('开始插入预警测试数据...');
        for (let i = 1; i <= 3; i++) {
            const alert = alertRepository.create({
                alertType: i % 3 + 1,
                alertLevel: i % 3 + 1,
                alertContent: `预警内容${i}`,
                relatedTaskId: i,
                relatedTaskType: i % 2 === 0 ? 'purchase' : 'production',
                alertStatus: i % 3,
                createBy: 1,
                createName: '管理员'
            });
            await alertRepository.save(alert);
            console.log(`插入预警: 预警${i}`);
        }
        console.log('测试数据插入完成！');
    }
    catch (error) {
        console.error('插入测试数据失败:', error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
        console.log('数据库连接关闭');
    }
}
seedTestData();
//# sourceMappingURL=test-data.js.map