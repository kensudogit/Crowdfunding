import pool from '../config/database';

export interface Pledge {
  id: number;
  project_id: number;
  user_id: number;
  amount: number;
  reward_tier?: string;
  created_at: Date;
}

export interface CreatePledgeData {
  project_id: number;
  user_id: number;
  amount: number;
  reward_tier?: string;
}

export class PledgeModel {
  static async findByProject(projectId: number): Promise<Pledge[]> {
    const result = await pool.query(
      'SELECT * FROM pledges WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows;
  }

  static async findByUser(userId: number): Promise<Pledge[]> {
    const result = await pool.query(
      'SELECT * FROM pledges WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async create(pledgeData: CreatePledgeData): Promise<Pledge> {
    const result = await pool.query(
      `INSERT INTO pledges (project_id, user_id, amount, reward_tier)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        pledgeData.project_id,
        pledgeData.user_id,
        pledgeData.amount,
        pledgeData.reward_tier || null,
      ]
    );
    return result.rows[0];
  }

  static async getTotalByProject(projectId: number): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM pledges WHERE project_id = $1',
      [projectId]
    );
    return parseFloat(result.rows[0].total);
  }
}
