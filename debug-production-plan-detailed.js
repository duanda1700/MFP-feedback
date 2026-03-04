const mysql = require('mysql2/promise');

async function debugProductionPlan() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    // 查询生产计划数据
    const [rows] = await connection.execute(
      'SELECT id, material_code, material_desc, plan_status, remarks, purchase_details_id FROM production_plan ORDER BY create_time DESC LIMIT 10'
    );

    console.log('生产计划数据:');
    console.log(`总数: ${rows.length}`);
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}, 物料编码: ${row.material_code}, 物料描述: ${row.material_desc}, 计划状态: ${row.plan_status}, 备注: ${row.remarks}, 采购订单明细ID: ${row.purchase_details_id}`);
    });

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('查询生产计划数据时出错:', error);
  }
}

debugProductionPlan();