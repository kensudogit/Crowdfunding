import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password, first_name, last_name } = req.body;

    // 既存ユーザーチェック
    let existingUser;
    let existingUsername;
    try {
      existingUser = await UserModel.findByEmail(email);
      existingUsername = await UserModel.findByUsername(username);
    } catch (dbError: any) {
      console.error('Database error during user check:', dbError);
      if (!res.headersSent) {
        res.status(503).json({
          error: 'Database connection error',
          message: 'Please try again later'
        });
      }
      return;
    }

    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    if (existingUsername) {
      res.status(400).json({ error: 'Username already taken' });
      return;
    }

    // パスワードハッシュ化
    const password_hash = await bcrypt.hash(password, 10);

    // ユーザー作成
    let user;
    try {
      user = await UserModel.create({
        username,
        email,
        password_hash,
        first_name,
        last_name,
      });
    } catch (dbError: any) {
      console.error('Database error during user creation:', dbError);
      if (!res.headersSent) {
        res.status(503).json({
          error: 'Database connection error',
          message: 'Please try again later'
        });
      }
      return;
    }

    // JWT生成
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // ユーザー検索
    let user;
    try {
      user = await UserModel.findByEmail(email);
    } catch (dbError: any) {
      console.error('Database error during login:', dbError);
      if (!res.headersSent) {
        res.status(503).json({
          error: 'Database connection error',
          message: 'Please try again later'
        });
      }
      return;
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // パスワード検証
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // JWT生成
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (userId == null) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      created_at: user.created_at,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

// バリデーションルール
export const validateRegister = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];
