import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import pledgeRoutes from './routes/pledgeRoutes';
import commentRoutes from './routes/commentRoutes';
import sampleDataRoutes from './routes/sampleDataRoutes';

// 環境変数を読み込む
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// ミドルウェア
// Helmet設定を緩和（開発環境）
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

// CORS設定
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // 開発環境ではすべてのオリジンを許可
    if (process.env.NODE_ENV === 'development' || !origin) {
      callback(null, true);
    } else {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.CORS_ORIGIN,
        'http://localhost:3000',
        'http://localhost:3001',
      ].filter(Boolean);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // 開発環境ではすべて許可
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルート
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Crowdfunding API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// APIルート
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/sample-data', sampleDataRoutes);

// 404ハンドリング
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// エラーハンドリングミドルウェア（最後に配置）
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// サーバー起動
const startServer = async () => {
  try {
    // サーバーを先に起動（データベース接続エラーでもサーバーは起動する）
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ Listening on 0.0.0.0:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
      console.log('='.repeat(50));
    });

    // サーバーエラーハンドリング
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    // データベース接続をテスト（非ブロッキング）
    setTimeout(async () => {
      try {
        const { testConnection } = await import('./config/database');
        const isConnected = await testConnection();
        
        if (!isConnected) {
          console.warn('⚠ Warning: Database connection failed. Retrying in 5 seconds...');
          setTimeout(async () => {
            const retryConnected = await testConnection();
            if (!retryConnected) {
              console.error('✗ Error: Could not connect to database. Please check your database configuration.');
              console.error('  Server is still running, but database operations will fail.');
            } else {
              console.log('✓ Database connection established after retry.');
            }
          }, 5000);
        } else {
          console.log('✓ Database connection successful.');
        }
      } catch (error) {
        console.error('✗ Error during database connection test:', error);
        console.error('  Server is still running, but database operations may fail.');
      }
    }, 1000); // サーバー起動後1秒待ってからDB接続テスト

  } catch (error) {
    console.error('✗ Fatal error starting server:', error);
    process.exit(1);
  }
};

// 未処理のエラーをキャッチ
process.on('uncaughtException', (error) => {
  console.error('✗ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export default app;
