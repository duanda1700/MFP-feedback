const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback',
    multipleStatements: true
  });

  try {
    console.log('开始执行订单拆分功能数据库迁移...');
    
    const sqlFile = path.join(__dirname, '004_create_order_split_system.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('SELECT'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✓ 执行成功:', statement.substring(0, 60) + '...');
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠ 字段已存在，跳过:', statement.substring(0, 60) + '...');
          } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('⚠ 表已存在，跳过:', statement.substring(0, 60) + '...');
          } else {
            console.error('✗ 执行失败:', statement.substring(0, 60) + '...');
            console.error('错误:', error.message);
          }
        }
      }
    }
    
    console.log('\n✅ 订单拆分功能数据库迁移完成！');
  } catch (error) {
    console.error('❌ 迁移失败:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
