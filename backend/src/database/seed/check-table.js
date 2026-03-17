const mysql = require('mysql2/promise');

async function checkTable() {
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

    // 检查 supplier 表是否存在
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'supplier'"
    );
    
    if (tables.length > 0) {
      console.log('supplier 表存在');
      
      // 查看表结构
      const [columns] = await connection.execute(
        "DESCRIBE supplier"
      );
      console.log('表结构：');
      columns.forEach(column => {
        console.log(`${column.Field}: ${column.Type} ${column.Null} ${column.Key} ${column.Default}`);
      });
    } else {
      console.log('supplier 表不存在');
    }

  } catch (error) {
    console.error('检查表结构失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
checkTable();
