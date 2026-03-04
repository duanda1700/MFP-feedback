import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlanClassToProductionPlan1770126000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN ADD COLUMN plan_class VARCHAR(50) NULL COMMENT '计划分类：生产计划/工序计划/制造符合性检查计划'`);
    await queryRunner.query(`CREATE INDEX idx_plan_class ON PRODUCTION_PLAN (plan_class)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_plan_class ON PRODUCTION_PLAN`);
    await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN DROP COLUMN IF EXISTS plan_class`);
  }
}
