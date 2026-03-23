const mysql = require('mysql2/promise');

async function createFeedbackTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  console.log('开始创建生产计划反馈表...');

  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS manufacture_plan_feedback_main (
        id CHAR(16) NOT NULL COMMENT '主键ID（与模板表ID格式统一）',
        purchase_details_id CHAR(16) NOT NULL COMMENT '关联ERP生产计划实例ID（模板表的purchase_details_id）',
        djbH VARCHAR(100) NOT NULL COMMENT '订单编号（模板表的djbH）',
        plan_name VARCHAR(100) NOT NULL COMMENT '计划名称（模板表的plan_name）',
        plan_type VARCHAR(100) NOT NULL COMMENT '计划类型（装机/补投/试验件计划）',
        material_code VARCHAR(200) NOT NULL COMMENT '物料编码（模板表的material_code）',
        material_desc VARCHAR(200) NOT NULL COMMENT '物料描述（模板表的material_desc）',
        plan_quantity DECIMAL(18,6) NOT NULL COMMENT '计划总数量（模板表的quantity）',
        unit VARCHAR(50) DEFAULT NULL COMMENT '计量单位（模板表的unit）',
        planned_date DATETIME NOT NULL COMMENT '计划交付日期（模板表的planned_date）',
        is_key_material VARCHAR(10) DEFAULT NULL COMMENT '关键物料标记（是/否）',
        production_line VARCHAR(100) DEFAULT NULL COMMENT '生产线（模板表的production_line）',
        plan_class VARCHAR(50) DEFAULT NULL COMMENT '计划分类（生产/工序/制造符合性检查计划）',
        supplier_code VARCHAR(32) NOT NULL COMMENT '供应商编码（反馈方标识）',
        feedback_cycle_type VARCHAR(20) NOT NULL DEFAULT '周度' COMMENT '反馈周期类型（周度/月度）',
        feedback_cycle VARCHAR(32) NOT NULL COMMENT '反馈周期（如：2026W12）',
        latest_version INT NOT NULL DEFAULT 1 COMMENT '最新反馈版本号（快速定位最新进度）',
        feedback_status VARCHAR(20) NOT NULL DEFAULT '正常' COMMENT '反馈状态（正常/作废/暂停）',
        creator VARCHAR(100) NOT NULL COMMENT '创建人',
        create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
        update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
        PRIMARY KEY (id),
        UNIQUE KEY uk_purchase_details_cycle (purchase_details_id, feedback_cycle),
        KEY idx_material_code (material_code),
        KEY idx_supplier_cycle (supplier_code, feedback_cycle),
        KEY idx_djbH (djbH),
        KEY idx_planned_date (planned_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='生产计划反馈主表（关联模板表，存不变信息）'
    `);
    console.log('✓ manufacture_plan_feedback_main 表创建成功');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS manufacture_plan_feedback_version (
        id CHAR(16) NOT NULL COMMENT '主键ID（与主表ID格式统一）',
        main_id CHAR(16) NOT NULL COMMENT '关联反馈主表ID',
        purchase_details_id CHAR(16) NOT NULL COMMENT '冗余：ERP生产计划实例ID（优化查询）',
        material_code VARCHAR(200) NOT NULL COMMENT '冗余：物料编码（优化查询）',
        version INT NOT NULL COMMENT '反馈版本号（同一主记录从1递增）',
        feedback_time DATETIME(6) NOT NULL COMMENT '本次反馈提交时间',
        finished_quantity DECIMAL(18,6) NOT NULL COMMENT '累计完成数量（模板表finished_quantity的反馈值）',
        plan_quantity DECIMAL(18,6) NOT NULL COMMENT '计划总数量（冗余字段，用于计算）',
        unfinished_quantity DECIMAL(18,6) GENERATED ALWAYS AS (plan_quantity - finished_quantity) STORED COMMENT '未完成数量（计算字段）',
        progress_rate DECIMAL(5,2) GENERATED ALWAYS AS ((finished_quantity/plan_quantity)*100) STORED COMMENT '完成进度（%，计算字段）',
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
    console.log('✓ manufacture_plan_feedback_version 表创建成功');

    console.log('所有表创建完成！');
  } catch (error) {
    console.error('创建表失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createFeedbackTables().catch(console.error);
