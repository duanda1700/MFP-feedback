import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSupplierTable1772264000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'mfp_feedback' 
      AND table_name = 'supplier'
    `);

    if (tableExists[0].count === 0) {
      await queryRunner.query(`
        CREATE TABLE supplier (
          id INT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
          supplier_code VARCHAR(30) NOT NULL COMMENT '供应商编码',
          supplier_name VARCHAR(100) NOT NULL COMMENT '供应商名称',
          contact_person VARCHAR(50) COMMENT '联系人',
          contact_phone VARCHAR(20) COMMENT '联系电话',
          address VARCHAR(255) COMMENT '地址',
          email VARCHAR(100) COMMENT '邮箱',
          status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态',
          create_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
          update_time DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
          PRIMARY KEY (id),
          UNIQUE INDEX UNIQ_SUPPLIER_CODE (supplier_code),
          INDEX idx_supplier_name (supplier_name),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // 创建默认供应商数据
      await queryRunner.query(`
        INSERT INTO supplier (supplier_code, supplier_name, contact_person, contact_phone, address, email, status)
        VALUES 
        ('SUP001', '供应商1', '张三', '13800138001', '北京市朝阳区', 'supplier1@example.com', 'active'),
        ('SUP002', '供应商2', '李四', '13900139002', '上海市浦东新区', 'supplier2@example.com', 'active'),
        ('SUP003', '供应商3', '王五', '13700137003', '广州市天河区', 'supplier3@example.com', 'active')
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS supplier`);
  }
}
