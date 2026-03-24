const mysql = require('mysql2/promise');

async function initRBACTables() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    console.log('========================================');
    console.log('RBAC 数据库表初始化脚本');
    console.log('========================================\n');

    console.log('数据库连接成功\n');

    console.log('第一步：创建角色表 ROLE');
    console.log('----------------------------------------');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ROLE (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        display_name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        status TINYINT DEFAULT 1 NOT NULL,
        sort_order INT DEFAULT 0 NOT NULL,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ ROLE 表创建成功\n');

    console.log('第二步：创建权限表 PERMISSION');
    console.log('----------------------------------------');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS PERMISSION (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(100) NOT NULL UNIQUE,
        module VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        status TINYINT DEFAULT 1 NOT NULL,
        sort_order INT DEFAULT 0 NOT NULL,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_code (code),
        INDEX idx_module (module),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ PERMISSION 表创建成功\n');

    console.log('第三步：创建用户角色关联表 USER_ROLE');
    console.log('----------------------------------------');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS USER_ROLE (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        created_by INT,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_user_role (user_id, role_id),
        INDEX idx_user_id (user_id),
        INDEX idx_role_id (role_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ USER_ROLE 表创建成功\n');

    console.log('第四步：更新角色权限关联表 ROLE_PERMISSION');
    console.log('----------------------------------------');
    const [rolePermCols] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'mfp_feedback' AND TABLE_NAME = 'ROLE_PERMISSION'
    `);
    const existingCols = rolePermCols.map(c => c.COLUMN_NAME);
    
    if (!existingCols.includes('permission_id')) {
      await connection.execute(`ALTER TABLE ROLE_PERMISSION ADD COLUMN permission_id INT`);
      console.log('✓ 添加 permission_id 列');
    }
    if (!existingCols.includes('created_by')) {
      await connection.execute(`ALTER TABLE ROLE_PERMISSION ADD COLUMN created_by INT`);
      console.log('✓ 添加 created_by 列');
    }
    
    const [rolePermIndexes] = await connection.execute(`
      SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = 'mfp_feedback' AND TABLE_NAME = 'ROLE_PERMISSION'
    `);
    const existingIndexes = rolePermIndexes.map(i => i.INDEX_NAME);
    
    if (!existingIndexes.includes('idx_permission_id')) {
      await connection.execute(`ALTER TABLE ROLE_PERMISSION ADD INDEX idx_permission_id (permission_id)`);
      console.log('✓ 添加 idx_permission_id 索引');
    }
    console.log('✓ ROLE_PERMISSION 表更新成功\n');

    console.log('第五步：更新用户表 USER');
    console.log('----------------------------------------');
    const [userCols] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'mfp_feedback' AND TABLE_NAME = 'USER'
    `);
    const existingUserCols = userCols.map(c => c.COLUMN_NAME);
    
    if (!existingUserCols.includes('email')) {
      await connection.execute(`ALTER TABLE USER ADD COLUMN email VARCHAR(100)`);
      console.log('✓ 添加 email 列');
    }
    if (!existingUserCols.includes('phone')) {
      await connection.execute(`ALTER TABLE USER ADD COLUMN phone VARCHAR(20)`);
      console.log('✓ 添加 phone 列');
    }
    if (!existingUserCols.includes('status')) {
      await connection.execute(`ALTER TABLE USER ADD COLUMN status TINYINT DEFAULT 1`);
      console.log('✓ 添加 status 列');
    }
    if (!existingUserCols.includes('last_login_time')) {
      await connection.execute(`ALTER TABLE USER ADD COLUMN last_login_time DATETIME`);
      console.log('✓ 添加 last_login_time 列');
    }
    if (!existingUserCols.includes('last_login_ip')) {
      await connection.execute(`ALTER TABLE USER ADD COLUMN last_login_ip VARCHAR(50)`);
      console.log('✓ 添加 last_login_ip 列');
    }
    console.log('✓ USER 表更新成功\n');

    console.log('第六步：插入初始角色数据');
    console.log('----------------------------------------');
    const [existingRoles] = await connection.execute('SELECT COUNT(*) as count FROM ROLE');
    if (existingRoles[0].count === 0) {
      await connection.execute(`
        INSERT INTO ROLE (name, display_name, description, sort_order) VALUES
        ('admin', '系统管理员', '拥有系统所有权限', 1),
        ('purchase_manager', '采购主管', '负责采购订单管理和下发', 2),
        ('supplier_user', '供应商用户', '供应商操作人员，可确认计划和提交反馈', 3),
        ('production_planner', '生产计划员', '负责生产计划管理', 4),
        ('company_leader', '公司领导', '查看所有数据，无编辑权限', 5)
      `);
      console.log('✓ 初始角色数据插入成功\n');
    } else {
      console.log('• 角色数据已存在，跳过插入\n');
    }

    console.log('第七步：插入初始权限数据');
    console.log('----------------------------------------');
    const [existingPermissions] = await connection.execute('SELECT COUNT(*) as count FROM PERMISSION');
    if (existingPermissions[0].count === 0) {
      await connection.execute(`
        INSERT INTO PERMISSION (name, code, module, description, sort_order) VALUES
        ('查看采购订单', 'purchase_order:read', '采购管理', '查看采购订单列表和详情', 1),
        ('创建采购订单', 'purchase_order:create', '采购管理', '创建新的采购订单', 2),
        ('编辑采购订单', 'purchase_order:update', '采购管理', '编辑采购订单信息', 3),
        ('删除采购订单', 'purchase_order:delete', '采购管理', '删除采购订单', 4),
        ('下发采购订单', 'purchase_order:issue', '采购管理', '下发采购订单给供应商', 5),
        ('查看生产计划', 'production_plan:read', '生产计划', '查看生产计划列表和详情', 10),
        ('创建生产计划', 'production_plan:create', '生产计划', '创建新的生产计划', 11),
        ('编辑生产计划', 'production_plan:update', '生产计划', '编辑生产计划信息', 12),
        ('确认生产计划', 'production_plan:confirm', '生产计划', '确认生产计划', 13),
        ('查看进度反馈', 'feedback:read', '进度反馈', '查看进度反馈列表和详情', 20),
        ('创建进度反馈', 'feedback:create', '进度反馈', '创建进度反馈', 21),
        ('提交进度反馈', 'feedback:submit', '进度反馈', '提交进度反馈', 22),
        ('查看用户', 'user:read', '系统管理', '查看用户列表和详情', 30),
        ('管理用户', 'user:manage', '系统管理', '创建、编辑、删除用户', 31),
        ('查看角色', 'role:read', '系统管理', '查看角色列表和详情', 32),
        ('管理角色', 'role:manage', '系统管理', '创建、编辑、删除角色', 33),
        ('分配权限', 'permission:assign', '系统管理', '为角色分配权限', 34),
        ('查看仪表盘', 'dashboard:read', '仪表盘', '查看仪表盘数据', 40),
        ('查看待办', 'todo:read', '待办事项', '查看待办任务', 41),
        ('处理待办', 'todo:handle', '待办事项', '处理待办任务', 42)
      `);
      console.log('✓ 初始权限数据插入成功\n');
    } else {
      console.log('• 权限数据已存在，跳过插入\n');
    }

    console.log('第八步：为角色分配默认权限');
    console.log('----------------------------------------');
    const [existingRolePermissions] = await connection.execute('SELECT COUNT(*) as count FROM ROLE_PERMISSION WHERE permission_id IS NOT NULL');
    if (existingRolePermissions[0].count === 0) {
      await connection.execute(`
        INSERT INTO ROLE_PERMISSION (role_id, permission_id)
        SELECT 1, id FROM PERMISSION
      `);
      console.log('✓ 管理员角色已分配所有权限\n');

      await connection.execute(`
        INSERT INTO ROLE_PERMISSION (role_id, permission_id)
        SELECT 2, id FROM PERMISSION WHERE code IN (
          'purchase_order:read', 'purchase_order:create', 'purchase_order:update', 'purchase_order:issue',
          'production_plan:read', 'production_plan:confirm',
          'feedback:read',
          'dashboard:read', 'todo:read', 'todo:handle'
        )
      `);
      console.log('✓ 采购主管角色权限分配成功\n');

      await connection.execute(`
        INSERT INTO ROLE_PERMISSION (role_id, permission_id)
        SELECT 3, id FROM PERMISSION WHERE code IN (
          'production_plan:read', 'production_plan:confirm',
          'feedback:read', 'feedback:create', 'feedback:submit',
          'dashboard:read', 'todo:read', 'todo:handle'
        )
      `);
      console.log('✓ 供应商用户角色权限分配成功\n');

      await connection.execute(`
        INSERT INTO ROLE_PERMISSION (role_id, permission_id)
        SELECT 5, id FROM PERMISSION WHERE code LIKE '%:read'
      `);
      console.log('✓ 公司领导角色权限分配成功\n');
    } else {
      console.log('• 角色权限数据已存在，跳过插入\n');
    }

    console.log('第九步：创建默认管理员用户');
    console.log('----------------------------------------');
    const [existingAdmin] = await connection.execute("SELECT COUNT(*) as count FROM USER WHERE username = 'admin'");
    if (existingAdmin[0].count === 0) {
      await connection.execute(`
        INSERT INTO USER (username, password, name, status) VALUES
        ('admin', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', '系统管理员', 1)
      `);
      const [adminUser] = await connection.execute("SELECT id FROM USER WHERE username = 'admin'");
      if (adminUser.length > 0) {
        await connection.execute(`
          INSERT INTO USER_ROLE (user_id, role_id) VALUES (?, 1)
        `, [adminUser[0].id]);
      }
      console.log('✓ 默认管理员用户创建成功 (用户名: admin, 密码: admin123)\n');
    } else {
      console.log('• 管理员用户已存在，跳过创建\n');
    }

    console.log('========================================');
    console.log('初始化完成');
    console.log('========================================');
    console.log('\n创建的表：');
    console.log('  - ROLE (角色表)');
    console.log('  - PERMISSION (权限表)');
    console.log('  - USER_ROLE (用户角色关联表)');
    console.log('  - ROLE_PERMISSION (角色权限关联表)');
    console.log('\n初始数据：');
    console.log('  - 5 个预设角色');
    console.log('  - 20 个预设权限');
    console.log('  - 默认管理员账号 (admin/admin123)');

  } catch (error) {
    console.error('\n========================================');
    console.error('错误报告');
    console.error('========================================');
    console.error('执行过程中发生错误：', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n数据库连接关闭');
    }
  }
}

initRBACTables();
