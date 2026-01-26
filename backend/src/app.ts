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
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
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
  // データベース接続をテスト
  const { testConnection } = await import('./config/database');
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.warn('Warning: Database connection failed. Retrying in 5 seconds...');
    setTimeout(async () => {
      const retryConnected = await testConnection();
      if (!retryConnected) {
        console.error('Error: Could not connect to database. Please check your database configuration.');
      }
    }, 5000);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

export default app;
