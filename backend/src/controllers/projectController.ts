import { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { ProjectModel } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const offset = (page - 1) * limit;

    const projects = await ProjectModel.findAll(limit, offset, status);

    // プロジェクト作成者情報と支援者数を取得
    const projectsWithCreator = await Promise.all(
      projects.map(async (project) => {
        const pool = (await import('../config/database')).default;
        const creatorResult = await pool.query(
          'SELECT id, username, avatar_url FROM users WHERE id = $1',
          [project.creator_id]
        );
        const pledgeCountResult = await pool.query(
          'SELECT COUNT(*) as count FROM pledges WHERE project_id = $1',
          [project.id]
        );
        return {
          ...project,
          creator: creatorResult.rows[0] || null,
          pledge_count: parseInt(pledgeCountResult.rows[0].count) || 0,
        };
      })
    );

    res.json({
      projects: projectsWithCreator,
      page,
      limit,
      total: projects.length,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const project = await ProjectModel.findById(id);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // 作成者情報を取得
    const pool = (await import('../config/database')).default;
    const creatorResult = await pool.query(
      'SELECT id, username, avatar_url, bio FROM users WHERE id = $1',
      [project.creator_id]
    );

    // 支援総額を取得
    const { PledgeModel } = await import('../models/Pledge');
    const totalPledged = await PledgeModel.getTotalByProject(id);

    res.json({
      ...project,
      creator: creatorResult.rows[0] || null,
      total_pledged: totalPledged,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId!;
    const { title, description, goal_amount, image_url, category, end_date } = req.body;

    const project = await ProjectModel.create({
      creator_id: userId,
      title,
      description,
      goal_amount: parseFloat(goal_amount),
      image_url,
      category,
      end_date: new Date(end_date),
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const id = parseInt(req.params.id);
    const userId = req.userId!;

    // プロジェクトの所有者確認
    const project = await ProjectModel.findById(id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (project.creator_id !== userId) {
      res.status(403).json({ error: 'Not authorized to update this project' });
      return;
    }

    const updates: any = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.goal_amount) updates.goal_amount = parseFloat(req.body.goal_amount);
    if (req.body.image_url !== undefined) updates.image_url = req.body.image_url;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.end_date) updates.end_date = new Date(req.body.end_date);
    if (req.body.status) updates.status = req.body.status;

    const updatedProject = await ProjectModel.update(id, updates);
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId!;

    // プロジェクトの所有者確認
    const project = await ProjectModel.findById(id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (project.creator_id !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this project' });
      return;
    }

    await ProjectModel.delete(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const projects = await ProjectModel.findByCreator(userId);
    res.json({ projects });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// バリデーションルール
export const validateCreateProject = [
  body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Title must be 3-255 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('goal_amount').isFloat({ min: 1 }).withMessage('Goal amount must be a positive number'),
  body('end_date').isISO8601().withMessage('End date must be a valid date'),
];

export const validateUpdateProject = [
  body('title').optional().trim().isLength({ min: 3, max: 255 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('goal_amount').optional().isFloat({ min: 1 }),
  body('end_date').optional().isISO8601(),
];
