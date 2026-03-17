const mysql = require('mysql2/promise');

async function insertSupplierData() {
  let connection;
  try {
    // 创建数据库连接
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });
    console.log('数据库连接成功');

    // 准备插入语句
    const insertQuery = `
      INSERT INTO supplier (supplier_code, supplier_name, contact_person, contact_phone, email, address, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        supplier_name = VALUES(supplier_name),
        contact_person = VALUES(contact_person),
        contact_phone = VALUES(contact_phone),
        email = VALUES(email),
        address = VALUES(address),
        status = VALUES(status)
    `;

    // 供应商数据
    const suppliers = [
      ['SUP001', '上海供应商A', '张三', '13800138001', 'zhangsan@supplier.com', '上海市浦东新区张江高科技园区', '启用'],
      ['SUP002', '北京供应商B', '李四', '13900139002', 'lisi@supplier.com', '北京市海淀区中关村', '启用'],
      ['SUP003', '广州供应商C', '王五', '13700137003', 'wangwu@supplier.com', '广州市天河区珠江新城', '启用'],
      ['SUP004', '深圳供应商D', '赵六', '13600136004', 'zhaoliu@supplier.com', '深圳市南山区科技园', '启用'],
      ['SUP005', '杭州供应商E', '孙七', '13500135005', 'sunqi@supplier.com', '杭州市西湖区阿里巴巴西溪园区', '启用'],
      ['SUP006', '苏州供应商F', '周八', '13400134006', 'zhouba@supplier.com', '苏州市工业园区', '启用'],
      ['SUP007', '南京供应商G', '吴九', '13300133007', 'wujin@supplier.com', '南京市江宁区', '启用'],
      ['SUP008', '武汉供应商H', '郑十', '13200132008', 'zhengshi@supplier.com', '武汉市东湖新技术开发区', '启用'],
      ['SUP009', '成都供应商I', '王一一', '13100131009', 'wangyiyi@supplier.com', '成都市高新区', '启用'],
      ['SUP010', '西安供应商J', '李二二', '13000130010', 'lierer@supplier.com', '西安市高新区', '启用']
    ];

    // 批量插入数据
    console.log('开始插入供应商测试数据...');
    for (const supplier of suppliers) {
      await connection.execute(insertQuery, supplier);
      console.log(`插入供应商: ${supplier[1]}`);
    }

    console.log('供应商测试数据插入完成！');

  } catch (error) {
    console.error('插入供应商数据失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
insertSupplierData();
