"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOperationLogTable1772264000003 = void 0;
class CreateOperationLogTable1772264000003 {
    async up(queryRunner) {
        const tableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'operation_log'
    `);
        if (tableExists[0].count === 0) {
            await queryRunner.query(`
        CREATE TABLE operation_log (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          user_id INT NOT NULL COMMENT '操作用户ID',
          user_name VARCHAR(50) NOT NULL COMMENT '操作用户姓名',
          operation_type VARCHAR(50) NOT NULL COMMENT '操作类型',
          operation_module VARCHAR(50) NOT NULL COMMENT '操作模块',
          operation_content TEXT NOT NULL COMMENT '操作内容',
          operation_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '操作时间',
          ip_address VARCHAR(50) COMMENT 'IP地址',
          user_agent VARCHAR(255) COMMENT '用户代理',
          PRIMARY KEY (id),
          INDEX idx_user_id (user_id),
          INDEX idx_operation_type (operation_type),
          INDEX idx_operation_module (operation_module),
          INDEX idx_operation_time (operation_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS operation_log`);
    }
}
exports.CreateOperationLogTable1772264000003 = CreateOperationLogTable1772264000003;
//# sourceMappingURL=1772264000003-CreateOperationLogTable.js.map