import pool from '../config/database';

export interface Comment {
  id: number;
  project_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCommentData {
  project_id: number;
  user_id: number;
  content: string;
}

export class CommentModel {
  static async findByProject(projectId: number): Promise<Comment[]> {
    const result = await pool.query(
      `SELECT c.*, u.username, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.project_id = $1
       ORDER BY c.created_at DESC`,
      [projectId]
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Comment | null> {
    const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(commentData: CreateCommentData): Promise<Comment> {
    const result = await pool.query(
      `INSERT INTO comments (project_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [commentData.project_id, commentData.user_id, commentData.content]
    );
    return result.rows[0];
  }

  static async update(id: number, content: string): Promise<Comment | null> {
    const result = await pool.query(
      `UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [content, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
