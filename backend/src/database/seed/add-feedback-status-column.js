const mysql = require('mysql2/promise');

async function addFeedbackStatusColumn() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });
    
    console.log('Connected to database');
    
    // 检查列是否已存在
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'mfp_feedback' 
      AND TABLE_NAME = 'PURCHASE_ORDER' 
      AND COLUMN_NAME = 'feedback_status'
    `);
    
    if (columns.length > 0) {
      console.log('Column feedback_status already exists');
      return;
    }
    
    // 添加feedback_status列
    await connection.execute(`
      ALTER TABLE PURCHASE_ORDER 
      ADD COLUMN feedback_status VARCHAR(20) NOT NULL DEFAULT '未开始' 
      COMMENT '反馈状态：未开始、进行中、已完成、已延期'
      AFTER order_status
    `);
    
    console.log('Added feedback_status column to PURCHASE_ORDER table');
    
    // 为feedback_status添加索引
    await connection.execute(`
      CREATE INDEX idx_feedback_status ON PURCHASE_ORDER(feedback_status)
    `);
    
    console.log('Added index for feedback_status column');
    
    // 更新现有数据（可选）
    // 可以根据order_status来设置初始的feedback_status
    await connection.execute(`
      UPDATE PURCHASE_ORDER 
      SET feedback_status = CASE 
        WHEN order_status = '待下发' THEN '未开始'
        WHEN order_status = '已下发' THEN '未开始'
        WHEN order_status = '已确认' THEN '进行中'
        ELSE '未开始'
      END
    `);
    
    console.log('Updated existing records with default feedback_status values');
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// 执行迁移
addFeedbackStatusColumn().catch(console.error);
