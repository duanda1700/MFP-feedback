const mysql = require('mysql2/promise');

async function insertSupplierTestData() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ab123=ab123',
      database: 'mfp_feedback'
    });

    // 测试数据
    const testData = [
      {
        supplier_code: 'SUP001',
        supplier_name: '供应商1',
        contact_person: '张三',
        contact_phone: '13800138001',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区',
        status: '启用'
      },
      {
        supplier_code: 'SUP002',
        supplier_name: '供应商2',
        contact_person: '李四',
        contact_phone: '13800138002',
        email: 'lisi@example.com',
        address: '上海市浦东新区',
        status: '启用'
      },
      {
        supplier_code: 'SUP003',
        supplier_name: '供应商3',
        contact_person: '王五',
        contact_phone: '13800138003',
        email: 'wangwu@example.com',
        address: '广州市天河区',
        status: '启用'
      },
      {
        supplier_code: 'SUP004',
        supplier_name: '供应商4',
        contact_person: '赵六',
        contact_phone: '13800138004',
        email: 'zhaoliu@example.com',
        address: '深圳市南山区',
        status: '启用'
      },
      {
        supplier_code: 'SUP005',
        supplier_name: '供应商5',
        contact_person: '钱七',
        contact_phone: '13800138005',
        email: 'qianqi@example.com',
        address: '杭州市西湖区',
        status: '启用'
      },
      {
        supplier_code: 'SUP006',
        supplier_name: '供应商6',
        contact_person: '孙八',
        contact_phone: '13800138006',
        email: 'sunba@example.com',
        address: '成都市锦江区',
        status: '启用'
      },
      {
        supplier_code: 'SUP007',
        supplier_name: '供应商7',
        contact_person: '周九',
        contact_phone: '13800138007',
        email: 'zhoujiu@example.com',
        address: '武汉市武昌区',
        status: '启用'
      },
      {
        supplier_code: 'SUP008',
        supplier_name: '供应商8',
        contact_person: '吴十',
        contact_phone: '13800138008',
        email: 'wushi@example.com',
        address: '西安市碑林区',
        status: '启用'
      },
      {
        supplier_code: 'SUP009',
        supplier_name: '供应商9',
        contact_person: '郑十一',
        contact_phone: '13800138009',
        email: 'zhengshiyi@example.com',
        address: '南京市鼓楼区',
        status: '启用'
      },
      {
        supplier_code: 'SUP010',
        supplier_name: '供应商10',
        contact_person: '王十二',
        contact_phone: '13800138010',
        email: 'wangshier@example.com',
        address: '重庆市渝中区',
        status: '启用'
      }
    ];

    // 插入测试数据
    for (const data of testData) {
      await connection.execute(
        `INSERT INTO supplier (supplier_code, supplier_name, contact_person, contact_phone, email, address, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.supplier_code, data.supplier_name, data.contact_person, data.contact_phone, data.email, data.address, data.status]
      );
    }

    console.log('成功插入10条供应商测试数据');

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('插入测试数据时出错:', error);
  }
}

insertSupplierTestData();