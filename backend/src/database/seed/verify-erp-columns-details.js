const mysql = require('mysql2/promise');

async function verifyTable() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  console.log('purchase_details 表结构验证:\n');
  
  const [rows] = await conn.execute('DESCRIBE purchase_details');
  
  const newColumns = [
    'dd', 'jhrq', 'cgz', 'jldw', 'kmfplb', 'lx',
    'sowbh', 'bc', 'hxm', 'sfzz', 'wbs'
  ];

  console.log('新增列验证:');
  for (const colName of newColumns) {
    const found = rows.find(r => r.Field === colName);
    if (found) {
      console.log(`  ✓ ${colName}: ${found.Type}`);
    } else {
      console.log(`  ✗ ${colName}: 未找到`);
    }
  }

  console.log(`\n总列数: ${rows.length}`);
  
  await conn.end();
}

verifyTable();
