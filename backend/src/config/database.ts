import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'crowdfunding',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// データベース接続をテスト
export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

export default pool;
