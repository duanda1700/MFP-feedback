const mysql = require('mysql2/promise');

async function addDjbHColumn() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    // 添加djbH字段
    console.log('Adding djbH column to PRODUCTION_PLAN table...');
    await conn.execute(`
      ALTER TABLE PRODUCTION_PLAN 
      ADD COLUMN djbH VARCHAR(100) NULL COMMENT '订单编号' AFTER purchase_details_id
    `);
    console.log('djbH column added successfully!');

    // 添加索引
    console.log('Adding index on djbH column...');
    await conn.execute(`
      ALTER TABLE PRODUCTION_PLAN 
      ADD INDEX idx_djbH (djbH)
    `);
    console.log('Index added successfully!');

    // 查询表结构确认
    const [columns] = await conn.execute('SHOW COLUMNS FROM PRODUCTION_PLAN LIKE "djbH"');
    console.log('\nColumn info:', columns);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await conn.end();
  }
}

addDjbHColumn();
