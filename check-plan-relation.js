const mysql = require('mysql2/promise');

async function checkPlanRelation() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    console.log('查询生产计划及其关联的采购订单详情...\n');
    
    // 查询生产计划
    const [plans] = await connection.execute(
      'SELECT id, plan_name, purchase_details_id, material_code FROM production_plan ORDER BY create_time DESC LIMIT 10'
    );
    
    console.log('生产计划数据：');
    plans.forEach(plan => {
      console.log(`  计划ID: ${plan.id}, 计划名称: ${plan.plan_name}, 采购详情ID: ${plan.purchase_details_id}, 物料编码: ${plan.material_code}`);
    });

    console.log('\n\n尝试关联查询...');
    
    // 尝试通过 purchase_details_id 关联查询
    for (const plan of plans) {
      const [details] = await connection.execute(
        'SELECT id, bpm_cgdd_instance_id, material_code FROM purchase_details WHERE id = ?',
        [plan.purchase_details_id]
      );
      
      if (details.length > 0) {
        console.log(`\n计划 ${plan.id} 找到关联的采购详情:`);
        console.log(`  采购详情ID: ${details[0].id}, bpm实例ID: ${details[0].bpm_cgdd_instance_id}, 物料编码: ${details[0].material_code}`);
        
        // 再查询采购订单
        const [orders] = await connection.execute(
          'SELECT id, djbH, bpm_cgdd_instance_id FROM purchase_order WHERE bpm_cgdd_instance_id = ?',
          [details[0].bpm_cgdd_instance_id]
        );
        
        if (orders.length > 0) {
          console.log(`  找到关联的采购订单: ID=${orders[0].id}, 订单编号=${orders[0].djbH}`);
        }
      } else {
        console.log(`\n计划 ${plan.id} 没有找到关联的采购详情 (purchase_details_id=${plan.purchase_details_id})`);
        
        // 尝试查询所有采购详情看看ID格式
        const [allDetails] = await connection.execute(
          'SELECT id, material_code FROM purchase_details LIMIT 5'
        );
        console.log('  示例采购详情ID:');
        allDetails.forEach(d => console.log(`    ${d.id} - ${d.material_code}`));
      }
    }

    // 测试查询订单ID=17的生产计划
    console.log('\n\n测试查询订单ID=17的生产计划...');
    const [testOrder] = await connection.execute(
      'SELECT id, djbH, bpm_cgdd_instance_id FROM purchase_order WHERE id = 17'
    );
    
    if (testOrder.length > 0) {
      console.log(`订单ID=17的信息: ${testOrder[0].djbH}, bpm实例ID=${testOrder[0].bpm_cgdd_instance_id}`);
      
      // 查询该订单的所有采购详情
      const [orderDetails] = await connection.execute(
        'SELECT id, material_code FROM purchase_details WHERE bpm_cgdd_instance_id = ?',
        [testOrder[0].bpm_cgdd_instance_id]
      );
      
      console.log(`该订单有 ${orderDetails.length} 条采购详情`);
      
      // 查询这些详情关联的生产计划
      const detailIds = orderDetails.map(d => d.id);
      if (detailIds.length > 0) {
        const [relatedPlans] = await connection.execute(
          'SELECT id, plan_name, material_code FROM production_plan WHERE purchase_details_id IN (?)',
          [detailIds]
        );
        console.log(`找到 ${relatedPlans.length} 条关联的生产计划`);
        relatedPlans.forEach(p => console.log(`  ${p.id} - ${p.plan_name}`));
      }
    }

  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await connection.end();
  }
}

checkPlanRelation();
