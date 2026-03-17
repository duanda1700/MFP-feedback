const mysql = require('mysql2/promise');

async function updateOrderStatus() {
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

    // 先查询前5个订单的ID
    const selectIdsQuery = `
      SELECT id FROM PURCHASE_ORDER ORDER BY id LIMIT 5
    `;

    const [idsResult] = await connection.execute(selectIdsQuery);
    const ids = idsResult.map(row => row.id);

    if (ids.length > 0) {
      // 更新这些订单的状态为"待下发"
      const updateQuery = `
        UPDATE PURCHASE_ORDER 
        SET order_status = '待下发' 
        WHERE id IN (${ids.join(',')})
      `;

      const [result] = await connection.execute(updateQuery);
      console.log(`成功更新 ${result.affectedRows} 个订单的状态为"待下发"`);
    } else {
      console.log('没有找到订单');
    }

    // 查看更新后的订单状态
    const selectQuery = `
      SELECT id, djbH, order_status FROM PURCHASE_ORDER ORDER BY id
    `;

    const [rows] = await connection.execute(selectQuery);
    console.log('更新后的订单状态：');
    rows.forEach((order, index) => {
      console.log(`${index + 1}. 订单ID: ${order.id}, 订单编号: ${order.djbH}, 状态: ${order.order_status}`);
    });

  } catch (error) {
    console.error('更新订单状态失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
updateOrderStatus();
