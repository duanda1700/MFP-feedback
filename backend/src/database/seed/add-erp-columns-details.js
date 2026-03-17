const mysql = require('mysql2/promise');

async function addErpColumnsToPurchaseDetails() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  console.log('数据库连接成功');

  const columns = [
    { name: 'dd', sql: "VARCHAR(12) NULL COMMENT '订单（ERP同步）'" },
    { name: 'jhrq', sql: "DATE NULL COMMENT '交货日期（ERP同步）'" },
    { name: 'cgz', sql: "VARCHAR(10) NULL COMMENT '采购组（ERP同步）'" },
    { name: 'jldw', sql: "VARCHAR(3) NULL COMMENT '计量单位（ERP同步）'" },
    { name: 'kmfplb', sql: "VARCHAR(128) NULL COMMENT '科目分配类别（ERP同步）'" },
    { name: 'lx', sql: "VARCHAR(100) NULL COMMENT '类型（ERP同步）'" },
    { name: 'sowbh', sql: "VARCHAR(100) NULL COMMENT 'SOW编号（ERP同步）'" },
    { name: 'bc', sql: "VARCHAR(100) NULL COMMENT '版次（ERP同步）'" },
    { name: 'hxm', sql: "INT NULL COMMENT '行项目（ERP同步）'" },
    { name: 'sfzz', sql: "VARCHAR(100) NULL COMMENT '是否自制（ERP同步）'" },
    { name: 'wbs', sql: "VARCHAR(128) NULL COMMENT 'WP名称（ERP同步）'" }
  ];

  let addedCount = 0;
  let skippedCount = 0;

  for (const col of columns) {
    try {
      await connection.execute(`ALTER TABLE purchase_details ADD COLUMN ${col.name} ${col.sql}`);
      console.log(`成功添加列: ${col.name}`);
      addedCount++;
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log(`列 ${col.name} 已存在，跳过`);
        skippedCount++;
      } else {
        console.error(`添加列 ${col.name} 失败:`, err.message);
      }
    }
  }

  console.log(`\n执行完成: 新增 ${addedCount} 列, 跳过 ${skippedCount} 列`);

  await connection.end();
  console.log('数据库连接关闭');
}

addErpColumnsToPurchaseDetails();
