"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1706892000003 = void 0;
class CreateUserTable1706892000003 {
    async up(queryRunner) {
        const tableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'user'
    `);
        if (tableExists[0].count === 0) {
            await queryRunner.query(`
        CREATE TABLE user (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          username VARCHAR(50) NOT NULL COMMENT '用户名',
          password VARCHAR(255) NOT NULL COMMENT '密码',
          name VARCHAR(50) NOT NULL COMMENT '姓名',
          role VARCHAR(50) NOT NULL COMMENT '角色',
          department VARCHAR(100) COMMENT '部门',
          is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否激活',
          create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
          update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
          PRIMARY KEY (id),
          UNIQUE INDEX UNIQ_USERNAME (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
            await queryRunner.query(`
        INSERT INTO user (username, password, name, role, department, is_active)
        VALUES ('admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '管理员', 'admin', 'IT部门', 1)
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE user`);
    }
}
exports.CreateUserTable1706892000003 = CreateUserTable1706892000003;
//# sourceMappingURL=1706892000003-CreateUserTable.js.map