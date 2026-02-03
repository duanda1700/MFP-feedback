import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableComments1706892000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 为 alert 表添加注释
    await queryRunner.query(`
      ALTER TABLE alert
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
      MODIFY COLUMN alert_type INT NOT NULL COMMENT '预警类型',
      MODIFY COLUMN alert_level INT NOT NULL COMMENT '预警级别',
      MODIFY COLUMN alert_content TEXT NOT NULL COMMENT '预警内容',
      MODIFY COLUMN related_task_id INT NOT NULL COMMENT '关联任务ID',
      MODIFY COLUMN related_task_type VARCHAR(50) NOT NULL COMMENT '关联任务类型',
      MODIFY COLUMN alert_status INT NOT NULL COMMENT '预警状态',
      MODIFY COLUMN create_name VARCHAR(50) NOT NULL COMMENT '创建人姓名',
      MODIFY COLUMN process_by INT COMMENT '处理人ID',
      MODIFY COLUMN process_name VARCHAR(50) COMMENT '处理人姓名',
      MODIFY COLUMN process_time DATETIME COMMENT '处理时间',
      MODIFY COLUMN close_time DATETIME COMMENT '关闭时间',
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间'
    `);

    // 为 feedback_data 表添加注释
    await queryRunner.query(`
      ALTER TABLE feedback_data
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
      MODIFY COLUMN order_id INT NOT NULL COMMENT '订单ID',
      MODIFY COLUMN plan_id INT NOT NULL COMMENT '计划ID',
      MODIFY COLUMN feedback_time DATETIME NOT NULL COMMENT '反馈时间',
      MODIFY COLUMN feedback_status INT NOT NULL COMMENT '反馈状态',
      MODIFY COLUMN operator_id INT NOT NULL COMMENT '操作人ID',
      MODIFY COLUMN operator_name VARCHAR(50) NOT NULL COMMENT '操作人姓名',
      MODIFY COLUMN supplier_id INT COMMENT '供应商ID',
      MODIFY COLUMN supplier_name VARCHAR(100) COMMENT '供应商名称',
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间'
    `);

    // 为 notification 表添加注释
    await queryRunner.query(`
      ALTER TABLE notification
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
      MODIFY COLUMN notification_type INT NOT NULL COMMENT '通知类型',
      MODIFY COLUMN notification_content TEXT NOT NULL COMMENT '通知内容',
      MODIFY COLUMN receiver_id INT NOT NULL COMMENT '接收人ID',
      MODIFY COLUMN receiver_type VARCHAR(50) NOT NULL COMMENT '接收人类型',
      MODIFY COLUMN notification_status INT NOT NULL COMMENT '通知状态',
      MODIFY COLUMN send_time DATETIME NOT NULL COMMENT '发送时间',
      MODIFY COLUMN read_time DATETIME COMMENT '阅读时间',
      MODIFY COLUMN create_by INT NOT NULL COMMENT '创建人ID',
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间'
    `);

    // 为 role_permission 表添加注释
    await queryRunner.query(`
      ALTER TABLE role_permission
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
      MODIFY COLUMN role_id INT NOT NULL COMMENT '角色ID',
      MODIFY COLUMN permission_id INT NOT NULL COMMENT '权限ID',
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚操作 - 移除注释
    await queryRunner.query(`
      ALTER TABLE alert
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
      MODIFY COLUMN alert_type INT NOT NULL,
      MODIFY COLUMN alert_level INT NOT NULL,
      MODIFY COLUMN alert_content TEXT NOT NULL,
      MODIFY COLUMN related_task_id INT NOT NULL,
      MODIFY COLUMN related_task_type VARCHAR(50) NOT NULL,
      MODIFY COLUMN alert_status INT NOT NULL,
      MODIFY COLUMN create_name VARCHAR(50) NOT NULL,
      MODIFY COLUMN process_by INT,
      MODIFY COLUMN process_name VARCHAR(50),
      MODIFY COLUMN process_time DATETIME,
      MODIFY COLUMN close_time DATETIME,
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
    `);

    await queryRunner.query(`
      ALTER TABLE feedback_data
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
      MODIFY COLUMN order_id INT NOT NULL,
      MODIFY COLUMN plan_id INT NOT NULL,
      MODIFY COLUMN feedback_time DATETIME NOT NULL,
      MODIFY COLUMN feedback_status INT NOT NULL,
      MODIFY COLUMN operator_id INT NOT NULL,
      MODIFY COLUMN operator_name VARCHAR(50) NOT NULL,
      MODIFY COLUMN supplier_id INT,
      MODIFY COLUMN supplier_name VARCHAR(100),
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
    `);

    await queryRunner.query(`
      ALTER TABLE notification
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
      MODIFY COLUMN notification_type INT NOT NULL,
      MODIFY COLUMN notification_content TEXT NOT NULL,
      MODIFY COLUMN receiver_id INT NOT NULL,
      MODIFY COLUMN receiver_type VARCHAR(50) NOT NULL,
      MODIFY COLUMN notification_status INT NOT NULL,
      MODIFY COLUMN send_time DATETIME NOT NULL,
      MODIFY COLUMN read_time DATETIME,
      MODIFY COLUMN create_by INT NOT NULL,
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
    `);

    await queryRunner.query(`
      ALTER TABLE role_permission
      MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
      MODIFY COLUMN role_id INT NOT NULL,
      MODIFY COLUMN permission_id INT NOT NULL,
      MODIFY COLUMN create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      MODIFY COLUMN update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
    `);
  }
}
