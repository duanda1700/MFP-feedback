const mysql = require('mysql2/promise');

async function checkSupplierData() {
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

    // 查询所有供应商数据
    const [rows] = await connection.execute('SELECT * FROM supplier');
    console.log(`共查询到 ${rows.length} 条供应商数据：`);
    
    rows.forEach((supplier, index) => {
      console.log(`${index + 1}. 供应商代码: ${supplier.supplier_code}, 供应商名称: ${supplier.supplier_name}, 联系人: ${supplier.contact_person}, 状态: ${supplier.status}`);
    });

  } catch (error) {
    console.error('查询供应商数据失败:', error);
  } finally {
    // 关闭数据库连接
    if (connection) {
      await connection.end();
      console.log('数据库连接关闭');
    }
  }
}

// 运行脚本
checkSupplierData();
