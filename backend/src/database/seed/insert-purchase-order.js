const mysql = require('mysql2/promise');

async function insertPurchaseOrderData() {
  let connection;
  try {
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });
    console.log('数据库连接成功');

    // 准备插入语句
    const insertQuery = `
      INSERT INTO PURCHASE_ORDER (
        bpm_cgdd_id, bpm_cgdd_instance_id, djbH, apply_username, apply_userno, 
        apply_dept, major, project, order_status, set_count, 
        supplier_code, supplier_name, supplier_id, purchase_manager
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        bpm_cgdd_instance_id = VALUES(bpm_cgdd_instance_id),
        apply_username = VALUES(apply_username),
        apply_userno = VALUES(apply_userno),
        apply_dept = VALUES(apply_dept),
        major = VALUES(major),
        project = VALUES(project),
        order_status = VALUES(order_status),
        set_count = VALUES(set_count),
        supplier_code = VALUES(supplier_code),
        supplier_name = VALUES(supplier_name),
        supplier_id = VALUES(supplier_id),
        purchase_manager = VALUES(purchase_manager)
    `;

    // 采购订单数据
    const purchaseOrders = [
      [1001, 1001, `PO-${Date.now()}-001`, '张三', 'ZHANG001', '采购部门', '电子工程', '研发项目A', '待处理', '1', 'SUP001', '上海供应商A', 1, '采购经理1'],
      [1002, 1002, `PO-${Date.now()}-002`, '李四', 'LI002', '技术部门', '机械工程', '研发项目B', '处理中', '1', 'SUP002', '北京供应商B', 2, '采购经理2'],
      [1003, 1003, `PO-${Date.now()}-003`, '王五', 'WANG003', '生产部门', '软件工程', '研发项目C', '已完成', '1', 'SUP003', '广州供应商C', 3, '采购经理3'],
      [1004, 1004, `PO-${Date.now()}-004`, '赵六', 'ZHAO004', '采购部门', '电子工程', '研发项目D', '待处理', '1', 'SUP004', '深圳供应商D', 4, '采购经理1'],
      [1005, 1005, `PO-${Date.now()}-005`, '孙七', 'SUN005', '技术部门', '机械工程', '研发项目E', '处理中', '1', 'SUP005', '杭州供应商E', 5, '采购经理2'],
      [1006, 1006, `PO-${Date.now()}-006`, '周八', 'ZHOU006', '生产部门', '软件工程', '研发项目F', '已完成', '1', 'SUP006', '苏州供应商F', 6, '采购经理3'],
      [1007, 1007, `PO-${Date.now()}-007`, '吴九', 'WU007', '采购部门', '电子工程', '研发项目G', '待处理', '1', 'SUP007', '南京供应商G', 7, '采购经理1'],
      [1008, 1008, `PO-${Date.now()}-008`, '郑十', 'ZHENG008', '技术部门', '机械工程', '研发项目H', '处理中', '1', 'SUP008', '武汉供应商H', 8, '采购经理2'],
      [1009, 1009, `PO-${Date.now()}-009`, '王一一', 'WANG009', '生产部门', '软件工程', '研发项目I', '已完成', '1', 'SUP009', '成都供应商I', 9, '采购经理3'],
      [1010, 1010, `PO-${Date.now()}-010`, '李二二', 'LI010', '采购部门', '电子工程', '研发项目J', '待处理', '1', 'SUP010', '西安供应商J', 10, '采购经理1']
    ];

    // 批量插入数据
    console.log('开始插入采购订单测试数据...');
    for (const order of purchaseOrders) {
      await connection.execute(insertQuery, order);
      console.log(`插入采购订单: ${order[2]}`);
    }

    console.log('采购订单测试数据插入完成！');

  } catch (error) {
    console.error('插入采购订单数据失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
insertPurchaseOrderData();
