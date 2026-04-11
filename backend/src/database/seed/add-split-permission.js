const mysql = require('mysql2/promise');

async function addSplitPermission() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  try {
    console.log('添加订单拆分权限...');

    // 1. 添加权限
    const [result] = await connection.execute(`
      INSERT INTO permission (name, code, description, module, sort_order, status, create_time, update_time)
      VALUES ('订单拆分', 'order:split', '允许拆分采购订单', 'order', 15, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)
    `);
    
    console.log('权限添加成功，ID:', result.insertId);

    // 2. 查询权限ID
    const [permissions] = await connection.execute(
      'SELECT id FROM permission WHERE code = ?',
      ['order:split']
    );
    
    if (permissions.length === 0) {
      throw new Error('权限未找到');
    }
    
    const permissionId = permissions[0].id;
    console.log('权限ID:', permissionId);

    // 3. 为管理员角色分配权限
    const [roles] = await connection.execute(
      'SELECT id FROM role WHERE name = ?',
      ['admin']
    );
    
    if (roles.length > 0) {
      const roleId = roles[0].id;
      
      await connection.execute(`
        INSERT IGNORE INTO role_permission (role_id, permission_id, create_time)
        VALUES (?, ?, NOW())
      `, [roleId, permissionId]);
      
      console.log('已为管理员角色分配权限');
    }

    // 4. 为采购员角色分配权限
    const [buyerRoles] = await connection.execute(
      'SELECT id FROM role WHERE name = ?',
      ['buyer']
    );
    
    if (buyerRoles.length > 0) {
      const roleId = buyerRoles[0].id;
      
      await connection.execute(`
        INSERT IGNORE INTO role_permission (role_id, permission_id, create_time)
        VALUES (?, ?, NOW())
      `, [roleId, permissionId]);
      
      console.log('已为采购员角色分配权限');
    }

    console.log('权限配置完成！');
    
    // 5. 验证结果
    const [allPermissions] = await connection.execute(`
      SELECT p.id, p.name, p.code, p.module
      FROM permission p
      WHERE p.code = 'order:split'
    `);
    
    console.log('权限详情:');
    console.table(allPermissions);

  } catch (error) {
    console.error('错误:', error);
  } finally {
    await connection.end();
  }
}

addSplitPermission();
