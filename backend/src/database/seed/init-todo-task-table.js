const mysql = require('mysql2/promise');

async function initTodoTaskTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    console.log('========================================');
    console.log('TODO_TASK 数据库表初始化脚本');
    console.log('========================================\n');

    console.log('数据库连接成功\n');

    console.log('创建待办任务表 TODO_TASK');
    console.log('----------------------------------------');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS TODO_TASK (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_type VARCHAR(50) NOT NULL COMMENT '任务类型',
        title VARCHAR(255) NOT NULL COMMENT '任务标题',
        content TEXT COMMENT '任务内容',
        priority VARCHAR(20) NOT NULL DEFAULT 'medium' COMMENT '优先级: low, medium, high, urgent',
        status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '状态: pending, processing, completed, cancelled',
        assignee_id INT NOT NULL COMMENT '处理人ID',
        assignee_name VARCHAR(100) NOT NULL COMMENT '处理人姓名',
        creator_id INT NOT NULL COMMENT '创建人ID',
        creator_name VARCHAR(100) NOT NULL COMMENT '创建人姓名',
        related_type VARCHAR(50) COMMENT '关联类型',
        related_id VARCHAR(100) COMMENT '关联ID',
        related_data JSON COMMENT '关联数据',
        due_date DATETIME COMMENT '截止日期',
        completed_at DATETIME COMMENT '完成时间',
        completed_by INT COMMENT '完成人ID',
        remark TEXT COMMENT '备注',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_task_type (task_type),
        INDEX idx_status (status),
        INDEX idx_assignee_id (assignee_id),
        INDEX idx_creator_id (creator_id),
        INDEX idx_related_type (related_type),
        INDEX idx_related_id (related_id),
        INDEX idx_due_date (due_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办任务表';
    `);
    console.log('✓ TODO_TASK 表创建成功\n');

    console.log('========================================');
    console.log('初始化完成');
    console.log('========================================');

  } catch (error) {
    console.error('\n========================================');
    console.error('错误报告');
    console.error('========================================');
    console.error('执行过程中发生错误：', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n数据库连接关闭');
    }
  }
}

initTodoTaskTable();
