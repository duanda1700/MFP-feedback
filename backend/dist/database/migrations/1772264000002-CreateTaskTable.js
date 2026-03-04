"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskTable1772264000002 = void 0;
class CreateTaskTable1772264000002 {
    async up(queryRunner) {
        const tableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'task'
    `);
        if (tableExists[0].count === 0) {
            await queryRunner.query(`
        CREATE TABLE task (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          task_name VARCHAR(100) NOT NULL COMMENT '任务名称',
          task_type VARCHAR(50) NOT NULL COMMENT '任务类型',
          task_status VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '任务状态',
          priority INT NOT NULL DEFAULT 0 COMMENT '优先级',
          assignee_id INT COMMENT '任务负责人ID',
          assignee_name VARCHAR(50) COMMENT '任务负责人姓名',
          start_time DATETIME COMMENT '开始时间',
          end_time DATETIME COMMENT '结束时间',
          related_order_id INT COMMENT '关联订单ID',
          related_plan_id VARCHAR(16) COMMENT '关联计划ID',
          description TEXT COMMENT '任务描述',
          create_by INT NOT NULL COMMENT '创建人ID',
          create_name VARCHAR(50) NOT NULL COMMENT '创建人姓名',
          create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
          update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
          PRIMARY KEY (id),
          INDEX idx_task_type (task_type),
          INDEX idx_task_status (task_status),
          INDEX idx_assignee_id (assignee_id),
          INDEX idx_related_order_id (related_order_id),
          INDEX idx_related_plan_id (related_plan_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS task`);
    }
}
exports.CreateTaskTable1772264000002 = CreateTaskTable1772264000002;
//# sourceMappingURL=1772264000002-CreateTaskTable.js.map