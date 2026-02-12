const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupRenderDatabase() {
  console.log('🚀 Setting up Render.com database...');
  
  // Render provides DATABASE_URL environment variable
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found. Make sure you have linked a PostgreSQL database.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', testResult.rows[0].now);

    // Read and execute schema
    console.log('📦 Creating tables...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../config/database.sql'),
      'utf8'
    );
    await pool.query(schemaSQL);
    console.log('✅ Tables created successfully');

    // Check if we need seed data
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoryCount.rows[0].count) === 0) {
      console.log('🌱 Seeding initial data...');
      const seedSQL = fs.readFileSync(
        path.join(__dirname, '../config/seed_data.sql'),
        'utf8'
      );
      await pool.query(seedSQL);
      console.log('✅ Seed data inserted');
    } else {
      console.log('📊 Database already has data, skipping seed');
    }

    // Setup audit trail
    console.log('📝 Setting up audit trail...');
    const auditSQL = fs.readFileSync(
      path.join(__dirname, '../config/audit_trail.sql'),
      'utf8'
    );
    await pool.query(auditSQL);
    console.log('✅ Audit trail ready');

    // Grant permissions
    await pool.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO inventory_admin;');
    await pool.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO inventory_admin;');
    
    console.log('\n🎉 Render.com database setup complete!');
    
    // Show stats
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM categories) as categories,
        (SELECT COUNT(*) FROM items) as items,
        (SELECT COUNT(*) FROM item_changes) as changes
    `);
    
    console.log('\n📊 Inventory Stats:');
    console.log(`   Categories: ${stats.rows[0].categories}`);
    console.log(`   Items: ${stats.rows[0].items}`);
    console.log(`   Changes: ${stats.rows[0].changes}`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupRenderDatabase();
