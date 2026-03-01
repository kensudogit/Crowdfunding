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

export type ProjectSort = 'newest' | 'most_funded' | 'ending_soon';

export class ProjectModel {
  static async findAll(
    limit: number = 50,
    offset: number = 0,
    opts?: { status?: string; search?: string; category?: string; sort?: ProjectSort }
  ): Promise<Project[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (opts?.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(opts.status);
    }
    if (opts?.search && opts.search.trim()) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${opts.search.trim()}%`);
      paramIndex++;
    }
    if (opts?.category && opts.category.trim()) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(opts.category.trim());
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';

    let orderClause = ' ORDER BY created_at DESC';
    if (opts?.sort === 'most_funded') {
      orderClause = ' ORDER BY current_amount DESC, created_at DESC';
    } else if (opts?.sort === 'ending_soon') {
      orderClause = ' ORDER BY end_date ASC, created_at DESC';
    }

    const query = `SELECT * FROM projects${whereClause}${orderClause} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async countAll(opts?: { status?: string; search?: string; category?: string }): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (opts?.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(opts.status);
    }
    if (opts?.search && opts.search.trim()) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${opts.search.trim()}%`);
      paramIndex++;
    }
    if (opts?.category && opts.category.trim()) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(opts.category.trim());
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(`SELECT COUNT(*) as total FROM projects${whereClause}`, params);
    return parseInt(result.rows[0]?.total || '0', 10);
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
