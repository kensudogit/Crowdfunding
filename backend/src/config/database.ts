import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Railway で Postgres を接続すると DATABASE_URL が設定されることがある
const databaseUrl = process.env.DATABASE_URL;
const poolConfig: PoolConfig = {
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
};

if (databaseUrl) {
  poolConfig.connectionString = databaseUrl;
  // Railway の Postgres は SSL 必須のことがある
  if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
    poolConfig.ssl = process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : false;
  }
} else {
  Object.assign(poolConfig, {
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'crowdfunding',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });
}

const pool = new Pool(poolConfig);

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
