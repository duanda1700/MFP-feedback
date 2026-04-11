const mysql = require('mysql2/promise');

async function testSplitOrderFilter() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    console.log('测试订单拆分过滤逻辑...\n');

    // 1. 查询所有订单
    const [allOrders] = await connection.execute(`
      SELECT id, djbH, order_status, order_type, split_count, parent_order_id
      FROM PURCHASE_ORDER
      ORDER BY id DESC
      LIMIT 10
    `);
    
    console.log('最近的10个订单:');
    console.table(allOrders);

    // 2. 查询应该被跟踪的订单（排除已拆分和子订单）
    const [trackableOrders] = await connection.execute(`
      SELECT id, djbH, order_status, order_type, split_count, parent_order_id
      FROM PURCHASE_ORDER
      WHERE order_status != '已拆分'
      AND order_type = 'ORIGINAL'
      ORDER BY id DESC
      LIMIT 10
    `);
    
    console.log('\n应该被跟踪的订单（排除已拆分和子订单）:');
    console.table(trackableOrders);

    // 3. 查询已拆分的订单
    const [splitOrders] = await connection.execute(`
      SELECT id, djbH, order_status, order_type, split_count, parent_order_id
      FROM PURCHASE_ORDER
      WHERE order_status = '已拆分'
      ORDER BY id DESC
    `);
    
    console.log('\n已拆分的订单:');
    console.table(splitOrders);

    // 4. 查询子订单
    const [subOrders] = await connection.execute(`
      SELECT id, djbH, order_status, order_type, split_count, parent_order_id
      FROM PURCHASE_ORDER
      WHERE order_type = 'SPLIT'
      ORDER BY id DESC
    `);
    
    console.log('\n子订单:');
    console.table(subOrders);

    // 5. 验证PO-1772719659484-010的状态
    const [testOrder] = await connection.execute(`
      SELECT id, djbH, order_status, order_type, split_count, parent_order_id
      FROM PURCHASE_ORDER
      WHERE djbH = 'PO-1772719659484-010'
    `);
    
    console.log('\nPO-1772719659484-010订单状态:');
    console.table(testOrder);

    if (testOrder.length > 0 && testOrder[0].order_status === '已拆分') {
      console.log('\n✅ 验证成功：PO-1772719659484-010状态为"已拆分"，应该被过滤');
    } else {
      console.log('\n❌ 验证失败：PO-1772719659484-010状态不正确');
    }

  } catch (error) {
    console.error('错误:', error);
  } finally {
    await connection.end();
  }
}

testSplitOrderFilter();
