import { Pool, PoolConfig } from 'pg';
import { mockPool } from './mock-database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check for database configuration
const hasDatabase = process.env.DATABASE_URL || process.env.DB_HOST;

console.log('🔍 Database config check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('DB_HOST:', process.env.DB_HOST || 'Not set');

if (process.env.DATABASE_URL) {
  // Parse the URL to check if it's valid
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('🔗 Neon connection details:');
    console.log('Host:', url.hostname);
    console.log('Database:', url.pathname.slice(1));
    console.log('SSL:', url.searchParams.get('sslmode'));
  } catch (e) {
    console.log('❌ Invalid DATABASE_URL format');
  }
}

if (!hasDatabase && process.env.NODE_ENV === 'production') {
  console.error('❌ Missing database configuration in production!');
  console.error('Please set DATABASE_URL (for Neon) or DB_HOST (for local PostgreSQL)');
  process.exit(1);
}

if (!hasDatabase) {
  console.log('⚠️  No database configured - using mock database for development');
  console.log('Set DATABASE_URL or DB_HOST in .env for real database');
}

// Neon PostgreSQL configuration (matching working test config)
const dbConfig: PoolConfig = process.env.DATABASE_URL 
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'health_journal',
      password: process.env.DB_PASSWORD || 'password',
      port: parseInt(process.env.DB_PORT || '5432'),
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 3000,
    };

// Create pool exactly like the working test
export const pool = hasDatabase ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}) : mockPool as any;

// Database connection events
if (hasDatabase) {
  pool.on('connect', () => {
    const dbType = process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'Local PostgreSQL';
    console.log(`✅ Connected to ${dbType}`);
  });

  pool.on('error', (err: Error) => {
    console.error('❌ Database connection error:', err.message);
  });
} else {
  // Mock database events
  pool.on('connect', () => {
    console.log('✅ Mock database ready');
  });
}

export default pool;