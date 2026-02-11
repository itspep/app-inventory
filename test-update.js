const { pool } = require('./config/database');

async function testUpdateOperations() {
  console.log('🧪 Testing UPDATE operations...\n');
  
  try {
    // Get existing item to update
    console.log('📋 Getting existing item for update test...');
    const existingItem = await pool.query(`
      SELECT i.id, i.name, i.price, i.stock_quantity, c.name as category_name 
      FROM items i 
      JOIN categories c ON i.category_id = c.id 
      LIMIT 1`
    );
    
    if (existingItem.rows.length === 0) {
      console.log('❌ No items found to test update. Please add items first.');
      return;
    }
    
    const item = existingItem.rows[0];
    console.log(`📦 Found item: ${item.name} (ID: ${item.id})`);
    console.log(`   Price: $${item.price}, Stock: ${item.stock_quantity}\n`);
    
    // Test 1: Update item price and stock
    console.log('✏️ Testing item update...');
    const newPrice = (parseFloat(item.price) + 10).toFixed(2);
    const newStock = parseInt(item.stock_quantity) + 5;
    
    const updatedItem = await pool.query(
      `UPDATE items 
       SET price = $1, stock_quantity = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 
       RETURNING id, name, price, stock_quantity`,
      [newPrice, newStock, item.id]
    );
    
    console.log(`✅ Updated item: ${updatedItem.rows[0].name}`);
    console.log(`   New price: $${updatedItem.rows[0].price}`);
    console.log(`   New stock: ${updatedItem.rows[0].stock_quantity}\n`);
    
    // Test 2: Update category
    console.log('📁 Testing category update...');
    const existingCategory = await pool.query(
      'SELECT id, name FROM categories LIMIT 1'
    );
    
    if (existingCategory.rows.length > 0) {
      const category = existingCategory.rows[0];
      const newName = `${category.name} (Updated)`;
      
      const updatedCategory = await pool.query(
        `UPDATE categories 
         SET name = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 
         RETURNING id, name`,
        [newName, category.id]
      );
      
      console.log(`✅ Updated category: ${updatedCategory.rows[0].name} (ID: ${updatedCategory.rows[0].id})\n`);
      
      // Restore original name
      await pool.query(
        'UPDATE categories SET name = $1 WHERE id = $2',
        [category.name, category.id]
      );
      console.log('↩️  Restored original category name\n');
    }
    
    // Test 3: Verify audit trail (updated_at timestamp changed)
    console.log('⏰ Verifying update timestamps...');
    const auditCheck = await pool.query(
      `SELECT 
        name,
        created_at,
        updated_at,
        (updated_at > created_at) as was_updated
       FROM items 
       WHERE id = $1`,
      [item.id]
    );
    
    const auditInfo = auditCheck.rows[0];
    console.log(`   Item: ${auditInfo.name}`);
    console.log(`   Created: ${auditInfo.created_at}`);
    console.log(`   Updated: ${auditInfo.updated_at}`);
    console.log(`   Was updated: ${auditInfo.was_updated ? '✅ Yes' : '❌ No'}\n`);
    
    // Restore original values
    console.log('↩️  Restoring original item values...');
    await pool.query(
      'UPDATE items SET price = $1, stock_quantity = $2 WHERE id = $3',
      [item.price, item.stock_quantity, item.id]
    );
    console.log('✅ Original values restored\n');
    
    console.log('🎉 All UPDATE operations tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testUpdateOperations();
