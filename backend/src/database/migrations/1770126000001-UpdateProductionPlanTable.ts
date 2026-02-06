import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductionPlanTable1770126000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 检查并删除bpm_cgdd_id字段（如果存在）
    try {
      await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN DROP COLUMN IF EXISTS bpm_cgdd_id`);
    } catch (e) {
      // 字段可能不存在，忽略错误
    }

    // 检查并更改bpm_cgdd_instance_id字段名称为purchase_details_id（如果存在）
    try {
      await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN CHANGE COLUMN bpm_cgdd_instance_id purchase_details_id BIGINT NOT NULL COMMENT '采购明细表ID'`);
    } catch (e) {
      // 字段可能不存在，忽略错误
    }

    // 检查并更新索引（如果存在）
    try {
      await queryRunner.query(`DROP INDEX IF EXISTS idx_bpm_cgdd_instance_id ON PRODUCTION_PLAN`);
    } catch (e) {
      // 索引可能不存在，忽略错误
    }

    try {
      await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_purchase_details_id ON PRODUCTION_PLAN (purchase_details_id)`);
    } catch (e) {
      // 索引可能已存在，忽略错误
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚操作：将purchase_details_id字段改回bpm_cgdd_instance_id
    try {
      await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN CHANGE COLUMN purchase_details_id bpm_cgdd_instance_id BIGINT NOT NULL COMMENT 'ERP采购订单实例ID（关联采购明细表）'`);
    } catch (e) {
      // 字段可能不存在，忽略错误
    }

    // 回滚索引
    try {
      await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_details_id ON PRODUCTION_PLAN`);
    } catch (e) {
      // 索引可能不存在，忽略错误
    }

    try {
      await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bpm_cgdd_instance_id ON PRODUCTION_PLAN (bpm_cgdd_instance_id)`);
    } catch (e) {
      // 索引可能已存在，忽略错误
    }

    // 回滚添加bpm_cgdd_id字段
    try {
      await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN ADD COLUMN IF NOT EXISTS bpm_cgdd_id BIGINT NOT NULL COMMENT 'ERP采购订单ID（同步）'`);
    } catch (e) {
      // 字段可能已存在，忽略错误
    }
  }
}
