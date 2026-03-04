const mysql = require('mysql2/promise');

async function addColumn() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    // 执行SQL命令添加字段
    await connection.execute(
      'ALTER TABLE PURCHASE_DETAILS ADD COLUMN is_compliance_material VARCHAR(2) NULL;'
    );

    console.log('成功添加is_compliance_material字段');

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('添加字段时出错:', error);
  }
}

addColumn();