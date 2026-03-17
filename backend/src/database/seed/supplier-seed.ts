import { AppDataSource } from '../data-source.js';
import { Supplier } from '../entities/supplier.entity.js';

async function seedSupplierData() {
  try {
    // 初始化数据库连接
    await AppDataSource.initialize();
    console.log('数据库连接成功');

    // 获取供应商仓库
    const supplierRepository = AppDataSource.getRepository(Supplier);

    // 插入供应商测试数据
    console.log('开始插入供应商测试数据...');
    const suppliers = [
      {
        supplierCode: 'SUP001',
        supplierName: '上海供应商A',
        contactPerson: '张三',
        contactPhone: '13800138001',
        email: 'zhangsan@supplier.com',
        address: '上海市浦东新区张江高科技园区',
        status: '启用'
      },
      {
        supplierCode: 'SUP002',
        supplierName: '北京供应商B',
        contactPerson: '李四',
        contactPhone: '13900139002',
        email: 'lisi@supplier.com',
        address: '北京市海淀区中关村',
        status: '启用'
      },
      {
        supplierCode: 'SUP003',
        supplierName: '广州供应商C',
        contactPerson: '王五',
        contactPhone: '13700137003',
        email: 'wangwu@supplier.com',
        address: '广州市天河区珠江新城',
        status: '启用'
      },
      {
        supplierCode: 'SUP004',
        supplierName: '深圳供应商D',
        contactPerson: '赵六',
        contactPhone: '13600136004',
        email: 'zhaoliu@supplier.com',
        address: '深圳市南山区科技园',
        status: '启用'
      },
      {
        supplierCode: 'SUP005',
        supplierName: '杭州供应商E',
        contactPerson: '孙七',
        contactPhone: '13500135005',
        email: 'sunqi@supplier.com',
        address: '杭州市西湖区阿里巴巴西溪园区',
        status: '启用'
      },
      {
        supplierCode: 'SUP006',
        supplierName: '苏州供应商F',
        contactPerson: '周八',
        contactPhone: '13400134006',
        email: 'zhouba@supplier.com',
        address: '苏州市工业园区',
        status: '启用'
      },
      {
        supplierCode: 'SUP007',
        supplierName: '南京供应商G',
        contactPerson: '吴九',
        contactPhone: '13300133007',
        email: 'wujin@supplier.com',
        address: '南京市江宁区',
        status: '启用'
      },
      {
        supplierCode: 'SUP008',
        supplierName: '武汉供应商H',
        contactPerson: '郑十',
        contactPhone: '13200132008',
        email: 'zhengshi@supplier.com',
        address: '武汉市东湖新技术开发区',
        status: '启用'
      },
      {
        supplierCode: 'SUP009',
        supplierName: '成都供应商I',
        contactPerson: '王一一',
        contactPhone: '13100131009',
        email: 'wangyiyi@supplier.com',
        address: '成都市高新区',
        status: '启用'
      },
      {
        supplierCode: 'SUP010',
        supplierName: '西安供应商J',
        contactPerson: '李二二',
        contactPhone: '13000130010',
        email: 'lierer@supplier.com',
        address: '西安市高新区',
        status: '启用'
      }
    ];

    for (const supplierData of suppliers) {
      const existingSupplier = await supplierRepository.findOne({ where: { supplierCode: supplierData.supplierCode } });
      if (!existingSupplier) {
        const supplier = supplierRepository.create(supplierData);
        await supplierRepository.save(supplier);
        console.log(`插入供应商: ${supplierData.supplierName}`);
      } else {
        console.log(`供应商 ${supplierData.supplierName} 已存在，跳过`);
      }
    }

    console.log('供应商测试数据插入完成！');
  } catch (error) {
    console.error('插入供应商测试数据失败:', error);
  } finally {
    // 关闭数据库连接
    await AppDataSource.destroy();
    console.log('数据库连接关闭');
  }
}

// 运行脚本
seedSupplierData();
