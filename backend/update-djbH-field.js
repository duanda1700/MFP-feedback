const mysql = require('mysql2/promise');

async function updateDjbHField() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    // 查询所有生产计划
    const [plans] = await conn.execute(
      'SELECT id, plan_name, djbH FROM PRODUCTION_PLAN'
    );
    console.log('Current production plans:');
    plans.forEach(plan => {
      console.log(`  ID: ${plan.id}, plan_name: ${plan.plan_name}, djbH: ${plan.djbH}`);
    });

    // 更新djbH字段，从plan_name中提取订单编号
    console.log('\nUpdating djbH field...');
    for (const plan of plans) {
      if (plan.plan_name && plan.plan_name.includes('-')) {
        // 从plan_name中提取djbH，格式为"计划反馈-PO-1772719659484-010"
        const parts = plan.plan_name.split('-');
        if (parts.length >= 2) {
          // 重新组合djbH，去掉"计划反馈"前缀
          const djbH = parts.slice(1).join('-');
          console.log(`  Updating plan ${plan.id}: djbH = ${djbH}`);
          await conn.execute(
            'UPDATE PRODUCTION_PLAN SET djbH = ? WHERE id = ?',
            [djbH, plan.id]
          );
        }
      }
    }

    // 验证更新结果
    const [updatedPlans] = await conn.execute(
      'SELECT id, plan_name, djbH FROM PRODUCTION_PLAN LIMIT 10'
    );
    console.log('\nUpdated production plans:');
    updatedPlans.forEach(plan => {
      console.log(`  ID: ${plan.id}, plan_name: ${plan.plan_name}, djbH: ${plan.djbH}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await conn.end();
  }
}

updateDjbHField();
