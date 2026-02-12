const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupRailwayDatabase() {
  console.log('🚀 Setting up Railway.app database...');
  
  // Railway provides DATABASE_URL environment variable
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found. Make sure PostgreSQL is added in Railway.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', testResult.rows[0].now);

    // Check if tables exist
    const tablesExist = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'categories'
      );
    `);

    if (!tablesExist.rows[0].exists) {
      // Read and execute schema
      console.log('📦 Creating tables...');
      const schemaSQL = fs.readFileSync(
        path.join(__dirname, '../config/database.sql'),
        'utf8'
      );
      await pool.query(schemaSQL);
      console.log('✅ Tables created successfully');

      // Seed data
      console.log('🌱 Seeding initial data...');
      const seedSQL = fs.readFileSync(
        path.join(__dirname, '../config/seed_data.sql'),
        'utf8'
      );
      await pool.query(seedSQL);
      console.log('✅ Seed data inserted');

      // Setup audit trail
      console.log('📝 Setting up audit trail...');
      const auditSQL = fs.readFileSync(
        path.join(__dirname, '../config/audit_trail.sql'),
        'utf8'
      );
      await pool.query(auditSQL);
      console.log('✅ Audit trail ready');
    } else {
      console.log('📊 Database already has tables, skipping setup');
    }
    
    console.log('\n🎉 Railway.app database setup complete!');
    
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
    console.log(`   Changes: ${stats.rows[0].changes || 0}`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupRailwayDatabase();
