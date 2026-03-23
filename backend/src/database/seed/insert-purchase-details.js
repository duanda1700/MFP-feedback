const mysql = require('mysql2/promise');

async function insertPurchaseDetailsData() {
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

    // 查询所有采购订单的 bpm_cgdd_instance_id
    const [orders] = await connection.execute('SELECT bpm_cgdd_instance_id, supplier_code FROM PURCHASE_ORDER');
    console.log(`共查询到 ${orders.length} 条采购订单，每条订单将插入 10 条明细数据`);

    // 准备插入语句
    const insertQuery = `
      INSERT INTO PURCHASE_DETAILS (
        id, bpm_cgddmx_id, bpm_cgdd_instance_id, receive_company, 
        material_code, material_desc, quantity, plan_date, 
        plan_no, product_type, order_no, set_count, 
        supplier_code, detail_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        bpm_cgddmx_id = VALUES(bpm_cgddmx_id),
        receive_company = VALUES(receive_company),
        material_code = VALUES(material_code),
        material_desc = VALUES(material_desc),
        quantity = VALUES(quantity),
        plan_date = VALUES(plan_date),
        plan_no = VALUES(plan_no),
        product_type = VALUES(product_type),
        order_no = VALUES(order_no),
        set_count = VALUES(set_count),
        supplier_code = VALUES(supplier_code),
        detail_status = VALUES(detail_status)
    `;

    // 为每个采购订单插入 10 条明细数据
    console.log('开始插入采购订单明细测试数据...');
    let totalInserted = 0;
    
    for (const order of orders) {
      const { bpm_cgdd_instance_id, supplier_code } = order;
      
      for (let i = 1; i <= 10; i++) {
        // 生成 16 位 ID: PD + 时间戳后 8 位 + 序号后 4 位
        const timestamp = Date.now().toString().slice(-8);
        const seq = i.toString().padStart(4, '0');
        const id = `PD${timestamp}${seq}`.slice(0, 16);
        
        // 生成明细数据
        const detailData = [
          id,
          bpm_cgdd_instance_id * 10 + i, // bpm_cgddmx_id
          bpm_cgdd_instance_id, // 外键关联
          '测试接收公司',
          `MAT${bpm_cgdd_instance_id}${i}`, // 物料编码
          `物料${bpm_cgdd_instance_id}-${i}`, // 物料描述
          100 * i, // 数量
          new Date(), // 计划日期
          `PLAN${bpm_cgdd_instance_id}${i}`, // 计划编号
          '测试产品类型', // 产品类型
          `ORD${bpm_cgdd_instance_id}${i}`, // 订单编号
          '1', // 套数
          supplier_code, // 供应商编码
          ['待处理', '已下发', '已完成'][i % 3] // 明细状态
        ];
        
        await connection.execute(insertQuery, detailData);
        totalInserted++;
        
        if (totalInserted % 10 === 0) {
          console.log(`已插入 ${totalInserted} 条采购订单明细数据`);
        }
      }
    }

    console.log(`采购订单明细测试数据插入完成！共插入 ${totalInserted} 条数据`);

  } catch (error) {
    console.error('插入采购订单明细数据失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
insertPurchaseDetailsData();
