"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_js_1 = require("../data-source.js");
const supplier_entity_js_1 = require("../entities/supplier.entity.js");
async function checkSupplierData() {
    try {
        await data_source_js_1.AppDataSource.initialize();
        console.log('数据库连接成功');
        const supplierRepository = data_source_js_1.AppDataSource.getRepository(supplier_entity_js_1.Supplier);
        const suppliers = await supplierRepository.find();
        console.log(`共查询到 ${suppliers.length} 条供应商数据：`);
        suppliers.forEach((supplier, index) => {
            console.log(`${index + 1}. 供应商代码: ${supplier.supplierCode}, 供应商名称: ${supplier.supplierName}, 联系人: ${supplier.contactPerson}, 状态: ${supplier.status}`);
        });
    }
    catch (error) {
        console.error('查询供应商数据失败:', error);
    }
    finally {
        await data_source_js_1.AppDataSource.destroy();
        console.log('数据库连接关闭');
    }
}
checkSupplierData();
//# sourceMappingURL=check-supplier.js.map