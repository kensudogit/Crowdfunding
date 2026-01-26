import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import pledgeRoutes from './routes/pledgeRoutes';
import commentRoutes from './routes/commentRoutes';

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

// エラーハンドリング
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
