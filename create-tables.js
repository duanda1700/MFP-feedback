const mysql = require('mysql2/promise');

async function createTables() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    // 创建purchase_order_task表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS purchase_order_task (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        supplier_id INT NOT NULL,
        task_status VARCHAR(20) NOT NULL,
        issue_desc TEXT NULL,
        plan_complete_time DATETIME NULL,
        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order_id (order_id),
        INDEX idx_supplier_id (supplier_id),
        INDEX idx_task_status (task_status),
        FOREIGN KEY (order_id) REFERENCES purchase_order(id),
        FOREIGN KEY (supplier_id) REFERENCES supplier(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('成功创建purchase_order_task表');

    // 创建operation_log表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS operation_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        operation_type VARCHAR(50) NOT NULL,
        operation_desc TEXT NULL,
        operator VARCHAR(50) NOT NULL,
        operated_at DATETIME NOT NULL,
        related_id VARCHAR(50) NULL,
        ip_address VARCHAR(50) NULL,
        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_operation_type (operation_type),
        INDEX idx_operated_at (operated_at),
        INDEX idx_related_id (related_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('成功创建operation_log表');

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('创建表时出错:', error);
  }
}

createTables();