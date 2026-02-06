"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductionPlanTable1770126000001 = void 0;
class UpdateProductionPlanTable1770126000001 {
    async up(queryRunner) {
        try {
            await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN DROP COLUMN IF EXISTS bpm_cgdd_id`);
        }
        catch (e) {
        }
        try {
            await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN CHANGE COLUMN bpm_cgdd_instance_id purchase_details_id BIGINT NOT NULL COMMENT '采购明细表ID'`);
        }
        catch (e) {
        }
        try {
            await queryRunner.query(`DROP INDEX IF EXISTS idx_bpm_cgdd_instance_id ON PRODUCTION_PLAN`);
        }
        catch (e) {
        }
        try {
            await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_purchase_details_id ON PRODUCTION_PLAN (purchase_details_id)`);
        }
        catch (e) {
        }
    }
    async down(queryRunner) {
        try {
            await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN CHANGE COLUMN purchase_details_id bpm_cgdd_instance_id BIGINT NOT NULL COMMENT 'ERP采购订单实例ID（关联采购明细表）'`);
        }
        catch (e) {
        }
        try {
            await queryRunner.query(`DROP INDEX IF EXISTS idx_purchase_details_id ON PRODUCTION_PLAN`);
        }
        catch (e) {
        }
        try {
            await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_bpm_cgdd_instance_id ON PRODUCTION_PLAN (bpm_cgdd_instance_id)`);
        }
        catch (e) {
        }
        try {
            await queryRunner.query(`ALTER TABLE PRODUCTION_PLAN ADD COLUMN IF NOT EXISTS bpm_cgdd_id BIGINT NOT NULL COMMENT 'ERP采购订单ID（同步）'`);
        }
        catch (e) {
        }
    }
}
exports.UpdateProductionPlanTable1770126000001 = UpdateProductionPlanTable1770126000001;
//# sourceMappingURL=1770126000001-UpdateProductionPlanTable.js.map