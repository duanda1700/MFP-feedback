const mysql = require('mysql2/promise');

async function fixFeedbackStatus() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    console.log('========================================');
    console.log('修复订单反馈状态脚本');
    console.log('========================================\n');

    console.log('数据库连接成功\n');

    console.log('第一步：检查所有订单的反馈状态');
    console.log('----------------------------------------');

    const [orders] = await connection.execute(`
      SELECT id, djbH, order_status, feedback_status 
      FROM PURCHASE_ORDER 
      WHERE feedback_status IS NOT NULL
    `);
    console.log(`共有 ${orders.length} 条订单有反馈状态\n`);

    const updates = [];

    for (const order of orders) {
      const [feedbackMains] = await connection.execute(`
        SELECT progress_status 
        FROM MANUFACTURE_PLAN_FEEDBACK_MAIN 
        WHERE djbH = ?
      `, [order.djbH]);

      if (feedbackMains.length === 0) continue;

      const allStatuses = feedbackMains.map(m => m.progress_status);
      
      let correctStatus = '进行中';
      if (allStatuses.every(s => s === '已完成')) {
        correctStatus = '已完成';
      } else if (allStatuses.some(s => s === '已延期')) {
        correctStatus = '已延期';
      }

      if (order.feedback_status !== correctStatus) {
        updates.push({
          djbH: order.djbH,
          currentStatus: order.feedback_status,
          correctStatus: correctStatus,
          allStatuses: allStatuses
        });
        console.log(`订单 ${order.djbH}:`);
        console.log(`  当前状态: ${order.feedback_status}`);
        console.log(`  正确状态: ${correctStatus}`);
        console.log(`  计划状态: [${allStatuses.join(', ')}]`);
      }
    }

    if (updates.length === 0) {
      console.log('\n✓ 所有订单反馈状态正确，无需修复');
      return;
    }

    console.log(`\n发现 ${updates.length} 条订单需要修复\n`);

    console.log('第二步：执行修复');
    console.log('----------------------------------------');

    await connection.beginTransaction();

    try {
      for (const update of updates) {
        await connection.execute(`
          UPDATE PURCHASE_ORDER 
          SET feedback_status = ? 
          WHERE djbH = ?
        `, [update.correctStatus, update.djbH]);
        console.log(`✓ 已修复订单 ${update.djbH}: ${update.currentStatus} -> ${update.correctStatus}`);
      }

      await connection.commit();
      console.log('\n✓ 事务提交成功\n');

    } catch (error) {
      await connection.rollback();
      console.error('\n✗ 修复失败，已回滚事务');
      throw error;
    }

    console.log('第三步：验证修复结果');
    console.log('----------------------------------------');

    const [verifyOrders] = await connection.execute(`
      SELECT id, djbH, order_status, feedback_status 
      FROM PURCHASE_ORDER 
      WHERE feedback_status IS NOT NULL
    `);

    let allCorrect = true;
    for (const order of verifyOrders) {
      const [feedbackMains] = await connection.execute(`
        SELECT progress_status 
        FROM MANUFACTURE_PLAN_FEEDBACK_MAIN 
        WHERE djbH = ?
      `, [order.djbH]);

      if (feedbackMains.length === 0) continue;

      const allStatuses = feedbackMains.map(m => m.progress_status);
      
      let correctStatus = '进行中';
      if (allStatuses.every(s => s === '已完成')) {
        correctStatus = '已完成';
      } else if (allStatuses.some(s => s === '已延期')) {
        correctStatus = '已延期';
      }

      if (order.feedback_status !== correctStatus) {
        allCorrect = false;
        console.log(`✗ 订单 ${order.djbH} 状态仍不正确: ${order.feedback_status} (应为 ${correctStatus})`);
      }
    }

    if (allCorrect) {
      console.log('✓ 所有订单反馈状态已正确修复\n');
    }

    console.log('========================================');
    console.log('修复报告');
    console.log('========================================');
    console.log(`检查订单数：${orders.length} 条`);
    console.log(`修复订单数：${updates.length} 条`);
    console.log(`状态：✓ 修复成功完成`);

  } catch (error) {
    console.error('\n========================================');
    console.error('错误报告');
    console.error('========================================');
    console.error('执行过程中发生错误：', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n数据库连接关闭');
    }
  }
}

fixFeedbackStatus();
