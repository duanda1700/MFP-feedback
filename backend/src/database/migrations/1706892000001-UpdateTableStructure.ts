import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableStructure1706892000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 先删除外键约束
    try {
      await queryRunner.query(`ALTER TABLE PURCHASE_DETAILS DROP FOREIGN KEY FK_f1a9526682d703747c0a822e178`);
    } catch (e) {
      // 外键约束可能不存在，忽略错误
    }

    // 删除旧表
    await queryRunner.query(`DROP TABLE IF EXISTS PURCHASE_ORDER`);
    await queryRunner.query(`DROP TABLE IF EXISTS PURCHASE_DETAILS`);
    await queryRunner.query(`DROP TABLE IF EXISTS PRODUCTION_PLAN`);

    // 创建新的采购订单表
    await queryRunner.query(`
      CREATE TABLE PURCHASE_ORDER (
        id INT NOT NULL AUTO_INCREMENT,
        bpm_cgdd_id BIGINT NOT NULL COMMENT 'ERP采购订单ID（同步）',
        bpm_cgdd_instance_id BIGINT NOT NULL COMMENT 'ERP采购订单实例ID（关联采购明细表）',
        djbH VARCHAR(50) NOT NULL COMMENT '订单业务编号（ERP同步）',
        apply_username VARCHAR(50) COMMENT '申请人姓名（ERP同步）',
        apply_userno VARCHAR(50) COMMENT '申请人账号（ERP同步）',
        apply_dept VARCHAR(100) COMMENT '申请人部门（ERP同步）',
        budget_no VARCHAR(50) COMMENT '预算号（ERP同步）',
        second_plan_name VARCHAR(100) COMMENT '二级计划名称（ERP同步）',
        purchase_level VARCHAR(100) COMMENT '采购级别（ERP同步）',
        actual_plan_purchase_name VARCHAR(100) COMMENT '实际计划采购名称（ERP同步）',
        is_temporary_emergency VARCHAR(100) COMMENT '是否临时紧急采购任务（ERP同步）',
        purchase_task_type VARCHAR(100) COMMENT '采购任务类型（ERP同步）',
        major VARCHAR(100) COMMENT '专业（ERP同步）',
        project VARCHAR(100) COMMENT '项目（ERP同步）',
        version VARCHAR(100) COMMENT '版本（ERP同步）',
        version_control_type VARCHAR(100) COMMENT '版本控制类型（ERP同步）',
        order_status VARCHAR(20) NOT NULL COMMENT '订单状态（待处理/已下发等）',
        set_count VARCHAR(50) COMMENT '台份（ERP同步）',
        supplier_code VARCHAR(30) COMMENT '供应商编码（ERP同步）',
        supplier_name VARCHAR(100) COMMENT '供应商名称（ERP同步）',
        purchase_manager VARCHAR(20) COMMENT '采购主管（ERP同步）',
        create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        INDEX idx_bpm_cgdd_instance_id (bpm_cgdd_instance_id),
        INDEX idx_djbH (djbH),
        INDEX idx_order_status (order_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 创建新的采购明细表
    await queryRunner.query(`
      CREATE TABLE PURCHASE_DETAILS (
        id CHAR(16) NOT NULL COMMENT '16位业务主键ID',
        bpm_cgddmx_id BIGINT NOT NULL COMMENT 'ERP采购订单明细ID（同步）',
        bpm_cgdd_instance_id BIGINT NOT NULL COMMENT '采购订单实例ID（关联主表）',
        receive_company VARCHAR(200) NOT NULL COMMENT '接收单位名称（ERP同步）',
        material_code VARCHAR(200) NOT NULL COMMENT '物料编码（ERP同步）',
        material_desc VARCHAR(200) NOT NULL COMMENT '物料描述（ERP同步）',
        material_group VARCHAR(50) COMMENT '物料组（ERP同步）',
        quantity DECIMAL(18,6) NOT NULL COMMENT '数量（ERP同步）',
        plan_date DATETIME COMMENT '计划日期（ERP同步）',
        plan_no VARCHAR(50) NOT NULL COMMENT '计划编号（ERP同步）',
        product_type VARCHAR(50) NOT NULL COMMENT '产品类型（ERP同步）',
        second_plan_no VARCHAR(200) COMMENT '二级计划编号（ERP同步）',
        second_plan_name VARCHAR(200) COMMENT '二级计划名称（ERP同步）',
        order_no VARCHAR(50) NOT NULL COMMENT '订单编号（ERP同步）',
        set_count VARCHAR(100) COMMENT '台份（ERP同步）',
        drawing_no VARCHAR(100) COMMENT '图号（ERP同步）',
        change_type VARCHAR(100) COMMENT '变更类型（ERP同步）',
        supplier_code VARCHAR(30) NOT NULL COMMENT '供应商编码（ERP同步）',
        purchase_manager VARCHAR(20) COMMENT '采购主管（ERP同步）',
        detail_status VARCHAR(20) NOT NULL COMMENT '明细状态（待处理/已下发等）',
        is_key_material VARCHAR(10) COMMENT '关键物料标记（是/否）',
        is_conformity_check VARCHAR(10) COMMENT '制造符合性检查物料标记（是/否）',
        create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        INDEX idx_bpm_cgdd_instance_id (bpm_cgdd_instance_id),
        INDEX idx_material_code (material_code),
        INDEX idx_plan_no (plan_no),
        INDEX idx_order_no (order_no),
        INDEX idx_supplier_code (supplier_code),
        INDEX idx_detail_status (detail_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 创建新的生产计划表
    await queryRunner.query(`
      CREATE TABLE PRODUCTION_PLAN (
        id CHAR(16) NOT NULL COMMENT '主键ID',
        bpm_scjh_id BIGINT NOT NULL COMMENT 'ERP生产计划ID（同步）',
        bpm_scjh_instance_id BIGINT NOT NULL COMMENT 'ERP生产计划实例ID（关联采购明细表）',
        plan_name VARCHAR(100) NOT NULL COMMENT '计划名称',
        plan_type VARCHAR(100) NOT NULL COMMENT '计划类型',
        plan_dept VARCHAR(100) NOT NULL COMMENT '计划部门',
        plan_maker VARCHAR(100) NOT NULL COMMENT '计划制定人',
        plan_date DATETIME NOT NULL COMMENT '计划日期',
        plan_status VARCHAR(20) NOT NULL COMMENT '计划状态（草稿/待审批等）',
        material_code VARCHAR(200) NOT NULL COMMENT '物料编码',
        material_desc VARCHAR(200) NOT NULL COMMENT '物料描述',
        quantity DECIMAL(18,6) NOT NULL COMMENT '数量',
        unit VARCHAR(50) COMMENT '计量单位',
        planned_date DATETIME NOT NULL COMMENT '计划日期',
        finished_quantity DECIMAL(18,6) NOT NULL COMMENT '完成数量',
        is_key_material VARCHAR(10) COMMENT '关键物料标记（是/否）',
        production_line VARCHAR(100) COMMENT '生产线',
        remarks VARCHAR(255) COMMENT '备注与说明',
        create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        INDEX idx_bpm_scjh_instance_id (bpm_scjh_instance_id),
        INDEX idx_plan_name (plan_name),
        INDEX idx_plan_status (plan_status),
        INDEX idx_material_code (material_code),
        INDEX idx_planned_date (planned_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚操作
    await queryRunner.query(`DROP TABLE IF EXISTS PURCHASE_ORDER`);
    await queryRunner.query(`DROP TABLE IF EXISTS PURCHASE_DETAILS`);
    await queryRunner.query(`DROP TABLE IF EXISTS PRODUCTION_PLAN`);
  }
}
