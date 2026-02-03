import { AppDataSource } from '../data-source';
import { User } from '../../auth/entities/user.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseDetails } from '../entities/purchase-details.entity';
import { ProductionPlan } from '../entities/production-plan.entity';
import { FeedbackData } from '../entities/feedback-data.entity';
import { Alert } from '../entities/alert.entity';
import { Task } from '../entities/task.entity';
import { Notification } from '../entities/notification.entity';
import { ChangeRecord } from '../entities/change-record.entity';
import { RolePermission } from '../entities/role-permission.entity';

async function seedTestData() {
  try {
    // 初始化数据库连接
    await AppDataSource.initialize();
    console.log('数据库连接成功');

    // 获取所有仓库
    const userRepository = AppDataSource.getRepository(User);
    const purchaseOrderRepository = AppDataSource.getRepository(PurchaseOrder);
    const purchaseDetailsRepository = AppDataSource.getRepository(PurchaseDetails);
    const productionPlanRepository = AppDataSource.getRepository(ProductionPlan);
    const feedbackDataRepository = AppDataSource.getRepository(FeedbackData);
    const alertRepository = AppDataSource.getRepository(Alert);
    const taskRepository = AppDataSource.getRepository(Task);
    const notificationRepository = AppDataSource.getRepository(Notification);
    const changeRecordRepository = AppDataSource.getRepository(ChangeRecord);
    const rolePermissionRepository = AppDataSource.getRepository(RolePermission);

    // 插入用户测试数据
    console.log('开始插入用户测试数据...');
    const users = [
      {
        username: 'admin',
        password: '$2b$10$eGJ1w4t6Q3JgH7b9K8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0', // 加密后的密码
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

    // 插入采购订单测试数据
    console.log('开始插入采购订单测试数据...');
    const orderCount = 10;
    const detailsPerOrder = 10; // 每个订单10条详情，共100条
    
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
        orderStatus: ['待处理', '处理中', '已完成'][i % 3],
        setCount: '1',
        supplierName: `供应商${i}`,
        purchaseManager: '采购经理'
      });
      await purchaseOrderRepository.save(purchaseOrder);
      console.log(`插入采购订单: ${purchaseOrder.djbH}`);

      // 为每个订单插入多条采购详情
      for (let j = 1; j <= detailsPerOrder; j++) {
        const detailIndex = (i - 1) * detailsPerOrder + j;
        // 生成16位ID：PD + 时间戳后8位 + 序号后4位
        const timestamp = Date.now().toString().slice(-8);
        const seq = detailIndex.toString().padStart(4, '0');
        const id = `PD${timestamp}${seq}`.slice(0, 16);
        
        const purchaseDetails = purchaseDetailsRepository.create({
          id: id,
          bpmCgddmxId: detailIndex,
          bpmCgddInstanceId: instanceId, // 确保外键关联
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
          detailStatus: ['待处理', '处理中', '已完成'][j % 3]
        });
        await purchaseDetailsRepository.save(purchaseDetails);
        if (detailIndex % 10 === 0) {
          console.log(`已插入 ${detailIndex} 条采购详情`);
        }
      }
    }
    console.log('采购详情插入完成，共插入 100 条数据');

    // 插入生产计划测试数据
    console.log('开始插入生产计划测试数据...');
    for (let i = 1; i <= 3; i++) {
      const productionPlan = productionPlanRepository.create({
        id: `PP${Date.now()}${i}`,
        bpmScjhId: i,
        bpmScjhInstanceId: i,
        planName: `生产计划${i}`,
        planType: '测试类型',
        planDept: '生产部门',
        planMaker: '管理员',
        planDate: new Date(),
        quantity: 100 * i,
        plannedDate: new Date(),
        finishedQuantity: 0,
        planStatus: '待处理',
        materialCode: `MAT${i}`,
        materialDesc: `物料${i}`
      });
      await productionPlanRepository.save(productionPlan);
      console.log(`插入生产计划: ${productionPlan.planName}`);
    }

    // 插入反馈数据测试数据
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

    // 插入预警测试数据
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
  } catch (error) {
    console.error('插入测试数据失败:', error);
  } finally {
    // 关闭数据库连接
    await AppDataSource.destroy();
    console.log('数据库连接关闭');
  }
}

// 运行脚本
seedTestData();
