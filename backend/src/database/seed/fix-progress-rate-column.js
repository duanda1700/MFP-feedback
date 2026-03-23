const mysql = require('mysql2/promise');

async function fixProgressRateColumn() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  console.log('开始修复 progress_rate 字段...');

  try {
    await connection.execute('DROP TABLE IF EXISTS manufacture_plan_feedback_version');
    console.log('✓ 删除旧表 manufacture_plan_feedback_version');

    await connection.execute(`
      CREATE TABLE manufacture_plan_feedback_version (
        id CHAR(16) NOT NULL COMMENT '主键ID（与主表ID格式统一）',
        main_id CHAR(16) NOT NULL COMMENT '关联反馈主表ID',
        purchase_details_id CHAR(16) NOT NULL COMMENT '冗余：ERP生产计划实例ID（优化查询）',
        material_code VARCHAR(200) NOT NULL COMMENT '冗余：物料编码（优化查询）',
        version INT NOT NULL COMMENT '反馈版本号（同一主记录从1递增）',
        feedback_time DATETIME(6) NOT NULL COMMENT '本次反馈提交时间',
        finished_quantity DECIMAL(18,6) NOT NULL COMMENT '累计完成数量（模板表finished_quantity的反馈值）',
        plan_quantity DECIMAL(18,6) NOT NULL COMMENT '计划总数量（冗余字段，用于计算）',
        unfinished_quantity DECIMAL(18,6) GENERATED ALWAYS AS (plan_quantity - finished_quantity) STORED COMMENT '未完成数量（计算字段）',
        progress_rate DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN plan_quantity = 0 THEN 0 ELSE (finished_quantity/plan_quantity)*100 END) STORED COMMENT '完成进度（%，计算字段，处理除零）',
        defect_quantity DECIMAL(18,6) DEFAULT 0.000000 COMMENT '本周不良品数量',
        actual_delivery_date DATETIME DEFAULT NULL COMMENT '实际交付日期（如有）',
        adjusted_planned_date DATETIME DEFAULT NULL COMMENT '调整后计划交付日期',
        remarks VARCHAR(255) DEFAULT NULL COMMENT '本周反馈备注（供应商补充说明）',
        creator VARCHAR(100) NOT NULL COMMENT '反馈人（供应商账号）',
        create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '记录创建时间',
        PRIMARY KEY (id),
        UNIQUE KEY uk_main_version (main_id, version),
        KEY idx_purchase_details_version (purchase_details_id, version),
        KEY idx_feedback_time (feedback_time),
        KEY idx_main_id (main_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='生产计划反馈版本明细表（每周反馈记录）'
    `);
    console.log('✓ 创建新表 manufacture_plan_feedback_version（修复了除零问题）');

    console.log('修复完成！');
  } catch (error) {
    console.error('修复失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

fixProgressRateColumn().catch(console.error);
