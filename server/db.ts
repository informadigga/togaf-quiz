import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

// Fallback database URL for production deployment
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:T0G4FF4GT0T0G4FF4GT0@db.doulajglyumdhshmhtlw.supabase.co:5432/postgres';

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure standard PostgreSQL connection for Supabase with longer timeout and IPv4 preference
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000, // Increased from 2000 to 30000
  // Force IPv4 to avoid IPv6 connection issues on some platforms
  host: 'db.doulajglyumdhshmhtlw.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'T0G4FF4GT0T0G4FF4GT0',
});

export const db = drizzle(pool, { schema });
export { pool };

// Test connection function
export async function testConnection() {
  try {
    const result = await pool.query('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
