import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChangeRecordTable1772264000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'change_record'
    `);

    if (tableExists[0].count === 0) {
      await queryRunner.query(`
        CREATE TABLE change_record (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          order_id INT COMMENT '订单ID',
          plan_id VARCHAR(16) COMMENT '计划ID',
          change_type VARCHAR(50) NOT NULL COMMENT '变更类型',
          change_reason TEXT COMMENT '变更原因',
          change_content TEXT NOT NULL COMMENT '变更内容',
          old_value TEXT COMMENT '变更前值',
          new_value TEXT COMMENT '变更后值',
          operator_id INT NOT NULL COMMENT '操作人ID',
          operator_name VARCHAR(50) NOT NULL COMMENT '操作人姓名',
          change_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '变更时间',
          PRIMARY KEY (id),
          INDEX idx_order_id (order_id),
          INDEX idx_plan_id (plan_id),
          INDEX idx_change_type (change_type),
          INDEX idx_change_time (change_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS change_record`);
  }
}
