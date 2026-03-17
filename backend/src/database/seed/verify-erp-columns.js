const mysql = require('mysql2/promise');

async function verifyTable() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ab123=ab123',
    database: 'mfp_feedback'
  });

  console.log('purchase_order 表结构验证:\n');
  
  const [rows] = await conn.execute('DESCRIBE purchase_order');
  
  const newColumns = [
    'status', 'creatdate', 'enddate', 'xqbm', 'xqbmbh', 'shsyxhyz',
    'zdcgry', 'zdcgrzh', 'fpssry', 'fpssryzh', 'sowbh', 'rwsmc',
    'type', 'bglx', 'bgq', 'bgh', 'bgsm', 'yxqwlzt', 'yxqwlztms',
    'ccbgyx', 'bgyxms', 'sfzx', 'cgly', 'tf'
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
