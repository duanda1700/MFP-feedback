const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSortOrderColumn() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'ab123=ab123',
      database: process.env.DB_DATABASE || 'mfp_feedback'
    });

    console.log('Connected to database');

    // 检查sort_order列是否已存在
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'PRODUCTION_PLAN' AND COLUMN_NAME = 'sort_order'
    `, [process.env.DB_DATABASE || 'mfp_feedback']);

    if (columns.length === 0) {
      // 添加sort_order列
      await connection.execute(`
        ALTER TABLE PRODUCTION_PLAN 
        ADD COLUMN sort_order INT NOT NULL DEFAULT 0
      `);
      console.log('Added sort_order column to PRODUCTION_PLAN table');

      // 添加索引
      await connection.execute(`
        CREATE INDEX idx_production_plan_sort_order ON PRODUCTION_PLAN(sort_order)
      `);
      console.log('Added index on sort_order column');
    } else {
      console.log('sort_order column already exists');
    }

    // 为现有数据设置sort_order值（按create_time顺序）
    const [plans] = await connection.execute(`
      SELECT id FROM PRODUCTION_PLAN ORDER BY djbH, create_time
    `);

    let currentDjbH = null;
    let sortOrder = 0;

    for (const plan of plans) {
      // 获取当前计划的djbH
      const [planData] = await connection.execute(`
        SELECT djbH FROM PRODUCTION_PLAN WHERE id = ?
      `, [plan.id]);

      if (planData.length > 0) {
        const djbH = planData[0].djbH;
        
        // 如果是新的订单，重置sort_order
        if (djbH !== currentDjbH) {
          currentDjbH = djbH;
          sortOrder = 1;
        } else {
          sortOrder++;
        }

        // 更新sort_order
        await connection.execute(`
          UPDATE PRODUCTION_PLAN SET sort_order = ? WHERE id = ?
        `, [sortOrder, plan.id]);
      }
    }

    console.log('Updated sort_order values for existing plans');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addSortOrderColumn();
