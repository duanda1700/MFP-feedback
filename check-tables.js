const mysql = require('mysql2/promise');

async function checkTables() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    // 执行SQL命令查看表名
    const [rows] = await connection.execute(
      'SHOW TABLES'
    );

    console.log('数据库中的表名:');
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${Object.values(row)[0]}`);
    });

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('查看表名时出错:', error);
  }
}

checkTables();