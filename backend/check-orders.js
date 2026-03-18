const mysql = require('mysql2/promise');

async function checkOrders() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    // 查询所有订单状态
    const [allOrders] = await conn.execute(
      'SELECT id, djbH, order_status FROM PURCHASE_ORDER LIMIT 20'
    );
    console.log('All orders:');
    allOrders.forEach(order => {
      console.log(`  ID: ${order.id}, djbH: ${order.djbH}, status: ${order.order_status}`);
    });

    // 查询待下发和有变更的订单
    const [filteredOrders] = await conn.execute(
      'SELECT id, djbH, order_status FROM PURCHASE_ORDER WHERE order_status IN ("待下发", "有变更") LIMIT 10'
    );
    console.log('\nOrders with status 待下发 or 有变更:', filteredOrders.length);
    filteredOrders.forEach(order => {
      console.log(`  ID: ${order.id}, djbH: ${order.djbH}, status: ${order.order_status}`);
    });

    // 查询已下发的订单
    const [issuedOrders] = await conn.execute(
      'SELECT id, djbH, order_status FROM PURCHASE_ORDER WHERE order_status = "已下发" LIMIT 10'
    );
    console.log('\nOrders with status 已下发:', issuedOrders.length);
    issuedOrders.forEach(order => {
      console.log(`  ID: ${order.id}, djbH: ${order.djbH}, status: ${order.order_status}`);
    });

  } catch (error) {
    console.error('Query error:', error);
  } finally {
    await conn.end();
  }
}

checkOrders();
