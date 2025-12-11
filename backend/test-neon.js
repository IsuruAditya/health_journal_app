// Simple Neon connection test
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Try without SSL first
});

async function testConnection() {
  try {
    console.log('Testing Neon connection...');
    console.log('URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('Time:', result.rows[0].now);
    client.release();
    
    await pool.end();
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    
    // Try with SSL
    if (!error.message.includes('SSL')) {
      console.log('\n🔄 Trying with SSL...');
      const sslPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      try {
        const client = await sslPool.connect();
        await client.query('SELECT NOW()');
        console.log('✅ SSL connection successful!');
        client.release();
        await sslPool.end();
      } catch (sslError) {
        console.log('❌ SSL connection also failed:', sslError.message);
      }
    }
  }
}

testConnection();