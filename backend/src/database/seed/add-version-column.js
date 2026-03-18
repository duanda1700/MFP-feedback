const mysql = require('mysql2/promise');

async function addVersionColumn() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    console.log('Adding version column to PRODUCTION_PLAN table...');
    
    // 检查字段是否已存在
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = 'mfp_feedback' 
       AND TABLE_NAME = 'PRODUCTION_PLAN' 
       AND COLUMN_NAME = 'version'`
    );
    
    if (columns.length === 0) {
      // 添加version字段
      await connection.execute(`
        ALTER TABLE PRODUCTION_PLAN 
        ADD COLUMN version INT NOT NULL DEFAULT 1
      `);
      
      // 添加索引
      await connection.execute(`
        CREATE INDEX idx_production_plan_version ON PRODUCTION_PLAN(version)
      `);
      
      console.log('Successfully added version column with default value 1');
    } else {
      console.log('version column already exists');
    }
    
  } catch (error) {
    console.error('Error adding version column:', error);
  } finally {
    await connection.end();
  }
}

addVersionColumn();
