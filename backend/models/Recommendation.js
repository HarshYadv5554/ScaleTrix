import { pool } from '../config/database.js';

class Recommendation {
  static async create(sessionId, productName, price, reason) {
    const result = await pool.query(
      `INSERT INTO recommendations (session_id, recommended_product, product_price, recommendation_reason) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [sessionId, productName, price, reason]
    );
    return result.rows[0];
  }

  static async getBySession(sessionId) {
    const result = await pool.query(
      `SELECT * FROM recommendations 
       WHERE session_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [sessionId]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT r.*, qs.user_id, u.phone_number, u.name 
       FROM recommendations r 
       JOIN quiz_sessions qs ON r.session_id = qs.id 
       JOIN users u ON qs.user_id = u.id 
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  }
}

export default Recommendation;
