const mysql = require('mysql2/promise');

async function checkPurchaseOrderData() {
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

    // 查询所有采购订单数据
    const [rows] = await connection.execute('SELECT * FROM PURCHASE_ORDER');
    console.log(`共查询到 ${rows.length} 条采购订单数据：`);
    
    rows.forEach((order, index) => {
      console.log(`${index + 1}. 订单号: ${order.djbH}, 状态: ${order.order_status}, 供应商: ${order.supplier_name}, 申请人: ${order.apply_username}`);
    });

  } catch (error) {
    console.error('查询采购订单数据失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
checkPurchaseOrderData();
