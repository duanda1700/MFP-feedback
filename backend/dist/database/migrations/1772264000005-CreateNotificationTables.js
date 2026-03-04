"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationTables1772264000005 = void 0;
class CreateNotificationTables1772264000005 {
    async up(queryRunner) {
        const templateTableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'notification_template'
    `);
        if (templateTableExists[0].count === 0) {
            await queryRunner.query(`
        CREATE TABLE notification_template (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          template_name VARCHAR(100) NOT NULL COMMENT '模板名称',
          template_type VARCHAR(50) NOT NULL COMMENT '模板类型',
          subject VARCHAR(255) NOT NULL COMMENT '通知主题',
          content TEXT NOT NULL COMMENT '通知内容',
          variables TEXT COMMENT '变量定义',
          is_active TINYINT NOT NULL DEFAULT 1 COMMENT '是否激活',
          create_by INT NOT NULL COMMENT '创建人ID',
          create_name VARCHAR(50) NOT NULL COMMENT '创建人姓名',
          create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
          update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
          PRIMARY KEY (id),
          INDEX idx_template_type (template_type),
          INDEX idx_is_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
        }
        const notificationTableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'notification'
    `);
        if (notificationTableExists[0].count === 0) {
            await queryRunner.query(`
        CREATE TABLE notification (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          notification_type VARCHAR(50) NOT NULL COMMENT '通知类型',
          notification_content TEXT NOT NULL COMMENT '通知内容',
          receiver_id INT NOT NULL COMMENT '接收人ID',
          receiver_type VARCHAR(50) NOT NULL COMMENT '接收人类型',
          notification_status VARCHAR(20) NOT NULL DEFAULT 'unread' COMMENT '通知状态',
          send_time DATETIME NOT NULL COMMENT '发送时间',
          read_time DATETIME COMMENT '阅读时间',
          create_by INT NOT NULL COMMENT '创建人ID',
          create_name VARCHAR(50) NOT NULL COMMENT '创建人姓名',
          create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
          update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
          PRIMARY KEY (id),
          INDEX idx_notification_type (notification_type),
          INDEX idx_receiver_id (receiver_id),
          INDEX idx_notification_status (notification_status),
          INDEX idx_send_time (send_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
        }
        const recordTableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'notification_record'
    `);
        if (recordTableExists[0].count === 0) {
            await queryRunner.query(`
        CREATE TABLE notification_record (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          notification_id INT NOT NULL COMMENT '通知ID',
          user_id INT NOT NULL COMMENT '用户ID',
          user_name VARCHAR(50) NOT NULL COMMENT '用户姓名',
          read_status VARCHAR(20) NOT NULL DEFAULT 'unread' COMMENT '阅读状态',
          read_time DATETIME COMMENT '阅读时间',
          create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
          update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
          PRIMARY KEY (id),
          INDEX idx_notification_id (notification_id),
          INDEX idx_user_id (user_id),
          INDEX idx_read_status (read_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS notification_record`);
        await queryRunner.query(`DROP TABLE IF EXISTS notification`);
        await queryRunner.query(`DROP TABLE IF EXISTS notification_template`);
    }
}
exports.CreateNotificationTables1772264000005 = CreateNotificationTables1772264000005;
//# sourceMappingURL=1772264000005-CreateNotificationTables.js.map