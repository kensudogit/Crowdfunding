import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PledgeModel } from '../models/Pledge';
import { ProjectModel } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const createPledge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId!;
    const projectId = parseInt(req.params.projectId);
    const { amount, reward_tier } = req.body;

    // プロジェクトの存在確認
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (project.status !== 'active') {
      res.status(400).json({ error: 'Project is not active' });
      return;
    }

    // 支援作成
    const pledge = await PledgeModel.create({
      project_id: projectId,
      user_id: userId,
      amount: parseFloat(amount),
      reward_tier,
    });

    // プロジェクトの現在金額を更新
    await ProjectModel.addAmount(projectId, parseFloat(amount));

    res.status(201).json(pledge);
  } catch (error) {
    console.error('Create pledge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectPledges = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = parseInt(req.params.projectId);
    const pledges = await PledgeModel.findByProject(projectId);

    // ユーザー情報を取得
    const pool = (await import('../config/database')).default;
    const pledgesWithUsers = await Promise.all(
      pledges.map(async (pledge) => {
        const userResult = await pool.query(
          'SELECT id, username, avatar_url FROM users WHERE id = $1',
          [pledge.user_id]
        );
        return {
          ...pledge,
          user: userResult.rows[0] || null,
        };
      })
    );

    res.json({ pledges: pledgesWithUsers });
  } catch (error) {
    console.error('Get pledges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyPledges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const pledges = await PledgeModel.findByUser(userId);

    // プロジェクト情報を取得
    const pool = (await import('../config/database')).default;
    const pledgesWithProjects = await Promise.all(
      pledges.map(async (pledge) => {
        const projectResult = await pool.query(
          'SELECT id, title, image_url FROM projects WHERE id = $1',
          [pledge.project_id]
        );
        return {
          ...pledge,
          project: projectResult.rows[0] || null,
        };
      })
    );

    res.json({ pledges: pledgesWithProjects });
  } catch (error) {
    console.error('Get my pledges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// バリデーションルール
export const validateCreatePledge = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('reward_tier').optional().trim(),
];
