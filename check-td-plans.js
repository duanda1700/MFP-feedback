const mysql = require('mysql2/promise');

async function checkTDPlans() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    console.log('查询所有生产计划数据...');
    const [plans] = await connection.execute(
      'SELECT id, plan_name, plan_status, create_time FROM production_plan ORDER BY create_time DESC LIMIT 20'
    );
    
    console.log('\n所有生产计划：');
    plans.forEach(plan => {
      console.log(`ID: ${plan.id}, 计划名称: ${plan.plan_name}, 状态: ${plan.plan_status}`);
    });

    console.log('\n\n查询 plan_name 结尾为 "td" 的生产计划：');
    const [tdPlans] = await connection.execute(
      'SELECT id, plan_name, plan_status, create_time FROM production_plan WHERE plan_name LIKE "%td" ORDER BY create_time DESC'
    );
    
    if (tdPlans.length > 0) {
      tdPlans.forEach(plan => {
        console.log(`ID: ${plan.id}, 计划名称: ${plan.plan_name}, 状态: ${plan.plan_status}`);
      });
    } else {
      console.log('没有找到 plan_name 结尾为 "td" 的生产计划');
    }

    console.log('\n\n查询 plan_name 包含 "计划反馈" 的生产计划：');
    const [feedbackPlans] = await connection.execute(
      'SELECT id, plan_name, plan_status, create_time FROM production_plan WHERE plan_name LIKE "%计划反馈%" ORDER BY create_time DESC'
    );
    
    if (feedbackPlans.length > 0) {
      feedbackPlans.forEach(plan => {
        console.log(`ID: ${plan.id}, 计划名称: ${plan.plan_name}, 状态: ${plan.plan_status}`);
      });
    } else {
      console.log('没有找到包含 "计划反馈" 的生产计划');
    }

  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await connection.end();
  }
}

checkTDPlans();
