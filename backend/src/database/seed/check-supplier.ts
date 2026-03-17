import { AppDataSource } from '../data-source.js';
import { Supplier } from '../entities/supplier.entity.js';

async function checkSupplierData() {
  try {
    // 初始化数据库连接
    await AppDataSource.initialize();
    console.log('数据库连接成功');

    // 获取供应商仓库
    const supplierRepository = AppDataSource.getRepository(Supplier);

    // 查询所有供应商数据
    const suppliers = await supplierRepository.find();
    console.log(`共查询到 ${suppliers.length} 条供应商数据：`);
    
    suppliers.forEach((supplier, index) => {
      console.log(`${index + 1}. 供应商代码: ${supplier.supplierCode}, 供应商名称: ${supplier.supplierName}, 联系人: ${supplier.contactPerson}, 状态: ${supplier.status}`);
    });

  } catch (error) {
    console.error('查询供应商数据失败:', error);
  } finally {
    // 关闭数据库连接
    await AppDataSource.destroy();
    console.log('数据库连接关闭');
  }
}

// 运行脚本
checkSupplierData();
