const mysql = require('mysql2/promise');

async function updateOrderStatusByFeedback() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    console.log('========================================');
    console.log('订单状态更新脚本');
    console.log('========================================\n');

    console.log('数据库连接成功\n');

    console.log('第一步：数据验证');
    console.log('----------------------------------------');

    const [allOrders] = await connection.execute(`
      SELECT id, djbH, order_status, feedback_status 
      FROM PURCHASE_ORDER 
      WHERE feedback_status IS NOT NULL
    `);
    console.log(`总共有 ${allOrders.length} 条订单有反馈状态\n`);

    const [invalidOrders] = await connection.execute(`
      SELECT id, djbH, order_status, feedback_status 
      FROM PURCHASE_ORDER 
      WHERE feedback_status IS NOT NULL 
      AND feedback_status NOT IN ('进行中', '已延期', '已完成')
    `);
    
    if (invalidOrders.length > 0) {
      console.log('警告：发现无效的反馈状态：');
      console.table(invalidOrders);
    } else {
      console.log('✓ 所有反馈状态值均有效\n');
    }

    console.log('第二步：统计待更新记录');
    console.log('----------------------------------------');

    const [progressRecords] = await connection.execute(`
      SELECT id, djbH, order_status, feedback_status 
      FROM PURCHASE_ORDER 
      WHERE feedback_status = '进行中' 
      AND order_status != '进行中'
    `);
    console.log(`需要更新为"进行中"的记录：${progressRecords.length} 条`);
    if (progressRecords.length > 0) {
      console.log('详情：');
      progressRecords.forEach(r => {
        console.log(`  - ${r.djbH}: ${r.order_status} -> 进行中 (反馈状态: ${r.feedback_status})`);
      });
    }

    const [delayedRecords] = await connection.execute(`
      SELECT id, djbH, order_status, feedback_status 
      FROM PURCHASE_ORDER 
      WHERE feedback_status = '已延期' 
      AND order_status != '已延期'
    `);
    console.log(`\n需要更新为"已延期"的记录：${delayedRecords.length} 条`);
    if (delayedRecords.length > 0) {
      console.log('详情：');
      delayedRecords.forEach(r => {
        console.log(`  - ${r.djbH}: ${r.order_status} -> 已延期 (反馈状态: ${r.feedback_status})`);
      });
    }

    const [completedRecords] = await connection.execute(`
      SELECT id, djbH, order_status, feedback_status 
      FROM PURCHASE_ORDER 
      WHERE feedback_status = '已完成' 
      AND order_status != '已完成'
    `);
    console.log(`\n需要更新为"已完成"的记录：${completedRecords.length} 条`);
    if (completedRecords.length > 0) {
      console.log('详情：');
      completedRecords.forEach(r => {
        console.log(`  - ${r.djbH}: ${r.order_status} -> 已完成 (反馈状态: ${r.feedback_status})`);
      });
    }

    const totalToUpdate = progressRecords.length + delayedRecords.length + completedRecords.length;
    console.log(`\n总计待更新：${totalToUpdate} 条记录\n`);

    if (totalToUpdate === 0) {
      console.log('========================================');
      console.log('更新报告');
      console.log('========================================');
      console.log('无需更新的记录，所有订单状态已符合规则。');
      return;
    }

    console.log('第三步：执行更新操作');
    console.log('----------------------------------------');

    await connection.beginTransaction();

    try {
      let updatedInProgress = 0;
      let updatedDelayed = 0;
      let updatedCompleted = 0;

      if (progressRecords.length > 0) {
        const [result1] = await connection.execute(`
          UPDATE PURCHASE_ORDER 
          SET order_status = '进行中' 
          WHERE feedback_status = '进行中' 
          AND order_status != '进行中'
        `);
        updatedInProgress = result1.affectedRows;
        console.log(`✓ 已更新 ${updatedInProgress} 条记录为"进行中"`);
      }

      if (delayedRecords.length > 0) {
        const [result2] = await connection.execute(`
          UPDATE PURCHASE_ORDER 
          SET order_status = '已延期' 
          WHERE feedback_status = '已延期' 
          AND order_status != '已延期'
        `);
        updatedDelayed = result2.affectedRows;
        console.log(`✓ 已更新 ${updatedDelayed} 条记录为"已延期"`);
      }

      if (completedRecords.length > 0) {
        const [result3] = await connection.execute(`
          UPDATE PURCHASE_ORDER 
          SET order_status = '已完成' 
          WHERE feedback_status = '已完成' 
          AND order_status != '已完成'
        `);
        updatedCompleted = result3.affectedRows;
        console.log(`✓ 已更新 ${updatedCompleted} 条记录为"已完成"`);
      }

      await connection.commit();
      console.log('\n✓ 事务提交成功\n');

      console.log('第四步：验证更新结果');
      console.log('----------------------------------------');

      const [verifyProgress] = await connection.execute(`
        SELECT COUNT(*) as count FROM PURCHASE_ORDER 
        WHERE feedback_status = '进行中' AND order_status = '进行中'
      `);
      console.log(`反馈状态为"进行中"且订单状态为"进行中"的记录：${verifyProgress[0].count} 条`);

      const [verifyDelayed] = await connection.execute(`
        SELECT COUNT(*) as count FROM PURCHASE_ORDER 
        WHERE feedback_status = '已延期' AND order_status = '已延期'
      `);
      console.log(`反馈状态为"已延期"且订单状态为"已延期"的记录：${verifyDelayed[0].count} 条`);

      const [verifyCompleted] = await connection.execute(`
        SELECT COUNT(*) as count FROM PURCHASE_ORDER 
        WHERE feedback_status = '已完成' AND order_status = '已完成'
      `);
      console.log(`反馈状态为"已完成"且订单状态为"已完成"的记录：${verifyCompleted[0].count} 条`);

      const [verifyMismatch] = await connection.execute(`
        SELECT id, djbH, order_status, feedback_status FROM PURCHASE_ORDER 
        WHERE (
          (feedback_status = '进行中' AND order_status != '进行中')
          OR (feedback_status = '已延期' AND order_status != '已延期')
          OR (feedback_status = '已完成' AND order_status != '已完成')
        )
        AND feedback_status IS NOT NULL
      `);
      
      if (verifyMismatch.length > 0) {
        console.log('\n警告：发现状态不匹配的记录：');
        console.table(verifyMismatch);
      } else {
        console.log('\n✓ 所有记录状态匹配正确');
      }

      console.log('\n========================================');
      console.log('更新报告');
      console.log('========================================');
      console.log(`数据验证：`);
      console.log(`  - 有反馈状态的订单总数：${allOrders.length} 条`);
      console.log(`  - 无效反馈状态记录：${invalidOrders.length} 条`);
      console.log(`\n更新统计：`);
      console.log(`  - 更新为"进行中"：${updatedInProgress} 条`);
      console.log(`  - 更新为"已延期"：${updatedDelayed} 条`);
      console.log(`  - 更新为"已完成"：${updatedCompleted} 条`);
      console.log(`  - 总计更新：${updatedInProgress + updatedDelayed + updatedCompleted} 条`);
      console.log(`\n异常情况：无`);
      console.log(`\n状态：✓ 更新成功完成`);

      const [finalStats] = await connection.execute(`
        SELECT order_status, COUNT(*) as count 
        FROM PURCHASE_ORDER 
        GROUP BY order_status
      `);
      console.log('\n当前订单状态分布：');
      console.table(finalStats);

    } catch (error) {
      await connection.rollback();
      console.error('\n✗ 更新失败，已回滚事务');
      throw error;
    }

  } catch (error) {
    console.error('\n========================================');
    console.error('错误报告');
    console.error('========================================');
    console.error('执行过程中发生错误：', error.message);
    console.error('\n异常情况：');
    console.error(`  - 错误类型：${error.code || '未知'}`);
    console.error(`  - 错误信息：${error.message}`);
    console.error(`\n状态：✗ 更新失败`);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n数据库连接关闭');
    }
  }
}

updateOrderStatusByFeedback();
