const mysql = require('mysql2/promise');

async function checkPurchaseDetailsData() {
  let connection;
  try {
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });
    console.log('数据库连接成功');

    // 查询每个采购订单的明细数量
    const [orderDetailsCount] = await connection.execute(`
      SELECT bpm_cgdd_instance_id, COUNT(*) as detail_count 
      FROM PURCHASE_DETAILS 
      GROUP BY bpm_cgdd_instance_id 
      ORDER BY bpm_cgdd_instance_id
    `);

    console.log('每个采购订单的明细数量：');
    let totalDetails = 0;
    orderDetailsCount.forEach((item, index) => {
      console.log(`${index + 1}. 采购订单实例ID: ${item.bpm_cgdd_instance_id}, 明细数量: ${item.detail_count}`);
      totalDetails += item.detail_count;
    });

    console.log(`\n总计：共 ${orderDetailsCount.length} 个采购订单，${totalDetails} 条明细数据`);

    // 随机查询 5 条明细数据，验证数据结构
    const [sampleDetails] = await connection.execute(`
      SELECT id, bpm_cgdd_instance_id, material_code, material_desc, quantity, detail_status 
      FROM PURCHASE_DETAILS 
      ORDER BY RAND() 
      LIMIT 5
    `);

    console.log('\n随机采样的 5 条明细数据：');
    sampleDetails.forEach((detail, index) => {
      console.log(`${index + 1}. ID: ${detail.id}, 订单实例ID: ${detail.bpm_cgdd_instance_id}, 物料编码: ${detail.material_code}, 物料描述: ${detail.material_desc}, 数量: ${detail.quantity}, 状态: ${detail.detail_status}`);
    });

  } catch (error) {
    console.error('查询采购订单明细数据失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
checkPurchaseDetailsData();
