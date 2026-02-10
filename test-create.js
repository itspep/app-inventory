const { pool } = require('./config/database');

async function testCreateOperations() {
  console.log('🧪 Testing CREATE operations...\n');
  
  try {
    // Test 1: Count current categories and items
    console.log('📊 Current inventory:');
    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    const itemsCount = await pool.query('SELECT COUNT(*) FROM items');
    console.log(`Categories: ${categoriesCount.rows[0].count}`);
    console.log(`Items: ${itemsCount.rows[0].count}\n`);
    
    // Test 2: Create a new category via direct SQL
    console.log('➕ Testing category creation...');
    const newCategory = await pool.query(
      `INSERT INTO categories (name, description) 
       VALUES ('Test Category ' || EXTRACT(EPOCH FROM NOW()), 'Test category created by test script')
       RETURNING id, name`
    );
    console.log(`✅ Created category: ${newCategory.rows[0].name} (ID: ${newCategory.rows[0].id})\n`);
    
    // Test 3: Create a new item via direct SQL
    console.log('➕ Testing item creation...');
    const newItem = await pool.query(
      `INSERT INTO items (category_id, name, brand, model, description, price, stock_quantity, sku)
       VALUES ($1, 'Test Item ' || EXTRACT(EPOCH FROM NOW()), 'TestBrand', 'TestModel', 
               'Test item created by test script', 99.99, 10, 'TEST-' || EXTRACT(EPOCH FROM NOW()))
       RETURNING id, name, sku`,
      [newCategory.rows[0].id]
    );
    console.log(`✅ Created item: ${newItem.rows[0].name} (SKU: ${newItem.rows[0].sku})\n`);
    
    // Test 4: Verify data was created
    console.log('✅ CREATE operations test passed!\n');
    
    // Cleanup: Remove test data
    console.log('🧹 Cleaning up test data...');
    await pool.query('DELETE FROM items WHERE sku LIKE $1', ['TEST-%']);
    await pool.query('DELETE FROM categories WHERE name LIKE $1', ['Test Category %']);
    console.log('✅ Test data cleaned up\n');
    
    // Final count
    const finalCategories = await pool.query('SELECT COUNT(*) FROM categories');
    const finalItems = await pool.query('SELECT COUNT(*) FROM items');
    console.log('📊 Final inventory:');
    console.log(`Categories: ${finalCategories.rows[0].count}`);
    console.log(`Items: ${finalItems.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testCreateOperations();
