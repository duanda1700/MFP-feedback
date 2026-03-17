const mysql = require('mysql2/promise');

async function addErpColumns() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  console.log('数据库连接成功');

  const columns = [
    { name: 'status', sql: "VARCHAR(32) NULL COMMENT 'ERP流程状态（ERP同步）'" },
    { name: 'creatdate', sql: "DATE NULL COMMENT 'ERP流程创建日期（ERP）'" },
    { name: 'enddate', sql: "DATE NULL COMMENT 'ERP流程关闭日期（ERP）'" },
    { name: 'xqbm', sql: "VARCHAR(128) NULL COMMENT '需求部门（ERP同步）'" },
    { name: 'xqbmbh', sql: "VARCHAR(64) NULL COMMENT '需求部门编号（ERP同步）'" },
    { name: 'shsyxhyz', sql: "VARCHAR(64) NULL COMMENT '是否属于型号研制（ERP同步）'" },
    { name: 'zdcgry', sql: "VARCHAR(128) NULL COMMENT '指定采购人员（ERP同步）'" },
    { name: 'zdcgrzh', sql: "VARCHAR(128) NULL COMMENT '指定采购人员账号（ERP同步）'" },
    { name: 'fpssry', sql: "VARCHAR(64) NULL COMMENT '分配实施人员（ERP同步）'" },
    { name: 'fpssryzh', sql: "VARCHAR(64) NULL COMMENT '分配实施人员账号（ERP同步）'" },
    { name: 'sowbh', sql: "VARCHAR(100) NULL COMMENT '任务书编号（ERP同步）'" },
    { name: 'rwsmc', sql: "VARCHAR(200) NULL COMMENT '任务书名称（ERP同步）'" },
    { name: 'type', sql: "VARCHAR(16) NULL COMMENT '流程类型（ERP同步）'" },
    { name: 'bglx', sql: "VARCHAR(64) NULL COMMENT '变更类型（ERP同步）'" },
    { name: 'bgq', sql: "VARCHAR(4000) NULL COMMENT '变更前（ERP同步）'" },
    { name: 'bgh', sql: "VARCHAR(4000) NULL COMMENT '变更后（ERP同步）'" },
    { name: 'bgsm', sql: "VARCHAR(4000) NULL COMMENT '变更说明（ERP同步）'" },
    { name: 'yxqwlzt', sql: "VARCHAR(20) NULL COMMENT '原需求物料状态（ERP同步）'" },
    { name: 'yxqwlztms', sql: "VARCHAR(300) NULL COMMENT '原需求物料状态描述（ERP同步）'" },
    { name: 'ccbgyx', sql: "VARCHAR(40) NULL COMMENT '此次变更影响（ERP同步）'" },
    { name: 'bgyxms', sql: "VARCHAR(300) NULL COMMENT '变更影响描述（ERP同步）'" },
    { name: 'sfzx', sql: "VARCHAR(4) NULL COMMENT '是否最新（ERP同步）'" },
    { name: 'cgly', sql: "VARCHAR(30) NULL COMMENT '采购来源（ERP同步）'" },
    { name: 'tf', sql: "VARCHAR(20) NULL COMMENT '台份（采购管理驾驶舱同步）'" }
  ];

  let addedCount = 0;
  let skippedCount = 0;

  for (const col of columns) {
    try {
      await connection.execute(`ALTER TABLE purchase_order ADD COLUMN ${col.name} ${col.sql}`);
      console.log(`成功添加列: ${col.name}`);
      addedCount++;
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log(`列 ${col.name} 已存在，跳过`);
        skippedCount++;
      } else {
        console.error(`添加列 ${col.name} 失败:`, err.message);
      }
    }
  }

  console.log(`\n执行完成: 新增 ${addedCount} 列, 跳过 ${skippedCount} 列`);

  await connection.end();
  console.log('数据库连接关闭');
}

addErpColumns();
