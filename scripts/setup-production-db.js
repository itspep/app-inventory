const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupProductionDatabase() {
  console.log('🚀 Setting up production database...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Read schema file
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../config/database.sql'),
      'utf8'
    );
    
    // Read seed data
    const seedSQL = fs.readFileSync(
      path.join(__dirname, '../config/seed_data.sql'),
      'utf8'
    );
    
    // Execute schema
    console.log('📦 Creating tables...');
    await pool.query(schemaSQL);
    console.log('✅ Tables created successfully');
    
    // Execute seed data
    console.log('🌱 Seeding data...');
    await pool.query(seedSQL);
    console.log('✅ Seed data inserted successfully');
    
    // Create audit trail
    const auditSQL = fs.readFileSync(
      path.join(__dirname, '../config/audit_trail.sql'),
      'utf8'
    );
    await pool.query(auditSQL);
    console.log('✅ Audit trail setup complete');
    
    // Verify setup
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    console.log('\n📊 Database Tables:', tables.rows.map(t => t.table_name).join(', '));
    
    const counts = await pool.query(`
      SELECT 'categories' as name, COUNT(*) as count FROM categories
      UNION ALL
      SELECT 'items', COUNT(*) FROM items
      UNION ALL
      SELECT 'item_changes', COUNT(*) FROM item_changes
    `);
    
    console.log('\n📈 Record Counts:');
    counts.rows.forEach(row => {
      console.log(`   ${row.name}: ${row.count}`);
    });
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupProductionDatabase();
