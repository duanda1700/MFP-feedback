const mysql = require('mysql2/promise');

async function createSupplierTable() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    // 执行SQL命令创建表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS SUPPLIER (
        id INT AUTO_INCREMENT PRIMARY KEY,
        supplier_code VARCHAR(30) NOT NULL,
        supplier_name VARCHAR(100) NOT NULL,
        contact_person VARCHAR(50) NULL,
        contact_phone VARCHAR(20) NULL,
        email VARCHAR(100) NULL,
        address VARCHAR(200) NULL,
        status VARCHAR(20) NOT NULL DEFAULT '启用',
        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_supplier_code (supplier_code),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('成功创建SUPPLIER表');

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('创建表时出错:', error);
  }
}

createSupplierTable();