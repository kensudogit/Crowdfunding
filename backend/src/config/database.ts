import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Railway では DATABASE_URL または DATABASE_URI が設定されることがある
const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URI;
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

// 01_init.sql と同等のスキーマ（Railway 等でテーブル未作成時に自動実行）
const INIT_SQL = `
-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- プロジェクトテーブル
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    goal_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    image_url TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 支援テーブル
CREATE TABLE IF NOT EXISTS pledges (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    reward_tier VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- コメントテーブル
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- インデックス
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_pledges_project ON pledges(project_id);
CREATE INDEX IF NOT EXISTS idx_pledges_user ON pledges(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);
`;

/** テーブルが無い場合のみ 01_init.sql 相当のスキーマを実行（Railway 等で初回デプロイ時に解消） */
export const ensureSchema = async (): Promise<void> => {
  try {
    const r = await pool.query(
      "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users' LIMIT 1"
    );
    if (r.rows.length > 0) {
      return; // 既にテーブルあり
    }
    console.log('Tables not found. Running init schema (users, projects, pledges, comments)...');
    await pool.query(INIT_SQL);
    console.log('Init schema completed.');
  } catch (err) {
    console.error('ensureSchema error:', err);
    throw err;
  }
};

export default pool;
