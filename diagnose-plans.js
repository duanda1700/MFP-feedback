const mysql = require('mysql2/promise');

async function diagnosePlans() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    console.log('=== 诊断生产计划关联问题 ===\n');
    
    // 1. 获取最近的几条采购订单
    console.log('1. 获取最近的采购订单：');
    const [orders] = await connection.execute(
      'SELECT id, djbH, bpm_cgdd_instance_id, order_status FROM purchase_order ORDER BY create_time DESC LIMIT 5'
    );
    
    orders.forEach(order => {
      console.log(`   订单ID: ${order.id}, 编号: ${order.djbH}, BPM实例ID: ${order.bpm_cgdd_instance_id}, 状态: ${order.order_status}`);
    });

    // 2. 选择一个订单进行详细分析（选择第一个）
    if (orders.length > 0) {
      const testOrderId = orders[0].id;
      console.log(`\n2. 详细分析订单 ID=${testOrderId} (${orders[0].djbH})：`);
      
      // 获取该订单的采购详情
      const [details] = await connection.execute(
        'SELECT id, bpm_cgdd_instance_id, material_code FROM purchase_details WHERE bpm_cgdd_instance_id = ?',
        [orders[0].bpm_cgdd_instance_id]
      );
      
      console.log(`   该订单有 ${details.length} 条采购详情：`);
      details.forEach(d => {
        console.log(`     - 详情ID: ${d.id}, 物料: ${d.material_code}`);
      });

      // 获取该订单的生产计划（通过采购详情关联）
      const detailIds = details.map(d => d.id);
      if (detailIds.length > 0) {
        const [plans] = await connection.execute(
          'SELECT id, plan_name, purchase_details_id, material_code FROM production_plan WHERE purchase_details_id IN (?)',
          [detailIds]
        );
        
        console.log(`\n   找到 ${plans.length} 条关联的生产计划：`);
        plans.forEach(p => {
          console.log(`     - 计划ID: ${p.id}, 名称: ${p.plan_name}, 关联详情ID: ${p.purchase_details_id}`);
        });

        // 3. 测试后端的查询逻辑
        console.log('\n3. 测试后端查询逻辑：');
        
        // 模拟后端的查询方式1：通过 bpm_cgdd_instance_id
        console.log('   查询方式1: 通过 bpm_cgdd_instance_id 关联');
        const [plansByBpm] = await connection.execute(`
          SELECT plan.* 
          FROM production_plan plan
          INNER JOIN purchase_details details ON plan.purchase_details_id = details.id
          WHERE details.bpm_cgdd_instance_id = ?
        `, [orders[0].bpm_cgdd_instance_id]);
        
        console.log(`   结果: 找到 ${plansByBpm.length} 条生产计划`);

        // 检查是否有 purchase_details_id = '0' 的计划
        console.log('\n4. 检查异常数据：');
        const [zeroPlans] = await connection.execute(
          'SELECT id, plan_name, purchase_details_id FROM production_plan WHERE purchase_details_id = "0" OR purchase_details_id = 0'
        );
        console.log(`   找到 ${zeroPlans.length} 条 purchase_details_id 为 0 的生产计划`);
        zeroPlans.forEach(p => {
          console.log(`     - ${p.id}: ${p.plan_name}`);
        });

        // 5. 测试使用 plan_name 来查找
        console.log('\n5. 通过 plan_name 查找（包含订单编号）：');
        const orderNumber = orders[0].djbH;
        const [plansByName] = await connection.execute(
          'SELECT id, plan_name FROM production_plan WHERE plan_name LIKE ?',
          [`%${orderNumber}%`]
        );
        console.log(`   找到 ${plansByName.length} 条 plan_name 包含 "${orderNumber}" 的计划`);
        plansByName.forEach(p => {
          console.log(`     - ${p.id}: ${p.plan_name}`);
        });
      }
    }

  } catch (error) {
    console.error('诊断失败:', error);
  } finally {
    await connection.end();
  }
}

diagnosePlans();
