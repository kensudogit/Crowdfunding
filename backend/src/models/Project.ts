import pool from '../config/database';

export interface Project {
  id: number;
  creator_id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  image_url?: string;
  category?: string;
  status: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectData {
  creator_id: number;
  title: string;
  description: string;
  goal_amount: number;
  image_url?: string;
  category?: string;
  end_date: Date;
}

export class ProjectModel {
  static async findAll(limit: number = 50, offset: number = 0, status?: string): Promise<Project[]> {
    let query = 'SELECT * FROM projects';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
      query += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
      params.push(limit, offset);
    } else {
      query += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<Project | null> {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByCreator(creatorId: number): Promise<Project[]> {
    const result = await pool.query(
      'SELECT * FROM projects WHERE creator_id = $1 ORDER BY created_at DESC',
      [creatorId]
    );
    return result.rows;
  }

  static async create(projectData: CreateProjectData): Promise<Project> {
    const result = await pool.query(
      `INSERT INTO projects (creator_id, title, description, goal_amount, image_url, category, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        projectData.creator_id,
        projectData.title,
        projectData.description,
        projectData.goal_amount,
        projectData.image_url || null,
        projectData.category || null,
        projectData.end_date,
      ]
    );
    return result.rows[0];
  }

  static async update(id: number, updates: Partial<Project>): Promise<Project | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updates.description);
    }
    if (updates.goal_amount !== undefined) {
      fields.push(`goal_amount = $${paramCount++}`);
      values.push(updates.goal_amount);
    }
    if (updates.image_url !== undefined) {
      fields.push(`image_url = $${paramCount++}`);
      values.push(updates.image_url);
    }
    if (updates.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(updates.category);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }
    if (updates.end_date !== undefined) {
      fields.push(`end_date = $${paramCount++}`);
      values.push(updates.end_date);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async addAmount(id: number, amount: number): Promise<Project | null> {
    const result = await pool.query(
      `UPDATE projects SET current_amount = current_amount + $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [amount, id]
    );
    return result.rows[0] || null;
  }
}
