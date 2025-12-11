// Database setup script
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Setting up database...');
    
    // Read and execute schema
    const schema = fs.readFileSync('setup-database.sql', 'utf8');
    await pool.query(schema);
    
    console.log('✅ Database setup complete!');
    console.log('📊 Tables created: users, health_records');
    console.log('🔑 Test user created: test@example.com');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();