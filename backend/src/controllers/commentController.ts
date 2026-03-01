import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CommentModel } from '../models/Comment';
import { ProjectModel } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId!;
    const projectId = parseInt(req.params.projectId);
    const { content } = req.body;

    // プロジェクトの存在確認
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // コメント作成
    const comment = await CommentModel.create({
      project_id: projectId,
      user_id: userId,
      content,
    });

    // ユーザー情報を取得
    const pool = (await import('../config/database')).default;
    const userResult = await pool.query(
      'SELECT id, username, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    res.status(201).json({
      ...comment,
      username: userResult.rows[0]?.username,
      avatar_url: userResult.rows[0]?.avatar_url,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = parseInt(req.params.projectId);
    const comments = await CommentModel.findByProject(projectId);
    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const commentId = parseInt(req.params.commentId);
    const userId = req.userId!;
    const { content } = req.body;

    // コメントの所有者確認
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (comment.user_id !== userId) {
      res.status(403).json({ error: 'Not authorized to update this comment' });
      return;
    }

    const updatedComment = await CommentModel.update(commentId, content);
    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = req.userId!;

    // コメントの所有者確認
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (comment.user_id !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this comment' });
      return;
    }

    await CommentModel.delete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// バリデーションルール
export const validateCreateComment = [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content must be 1-1000 characters'),
];

export const validateUpdateComment = [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content must be 1-1000 characters'),
];
