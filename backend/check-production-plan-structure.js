const mysql = require('mysql2/promise');

async function checkProductionPlanStructure() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    // 查询production_plan表结构
    const [columns] = await conn.execute('SHOW COLUMNS FROM PRODUCTION_PLAN');
    console.log('PRODUCTION_PLAN table structure:');
    columns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - ${col.Null} - ${col.Key}`);
    });

    // 查询production_plan数据
    const [plans] = await conn.execute(
      'SELECT id, djbH, plan_name, plan_status FROM PRODUCTION_PLAN LIMIT 5'
    );
    console.log('\nProduction plans:');
    plans.forEach(plan => {
      console.log(`  ID: ${plan.id}, djbH: ${plan.djbH}, plan_name: ${plan.plan_name}, status: ${plan.plan_status}`);
    });

  } catch (error) {
    console.error('Query error:', error);
  } finally {
    await conn.end();
  }
}

checkProductionPlanStructure();
