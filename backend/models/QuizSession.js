import { pool } from '../config/database.js';

class QuizSession {
  static async create(userId) {
    const result = await pool.query(
      `INSERT INTO quiz_sessions (user_id, status, current_question) 
       VALUES ($1, 'in_progress', 1) 
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  }

  static async findById(sessionId) {
    const result = await pool.query(
      'SELECT * FROM quiz_sessions WHERE id = $1',
      [sessionId]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM quiz_sessions 
       WHERE user_id = $1 AND status = 'in_progress' 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );
    return result.rows[0];
  }

  static async updateQuestion(sessionId, questionNumber) {
    const result = await pool.query(
      `UPDATE quiz_sessions 
       SET current_question = $1 
       WHERE id = $2 
       RETURNING *`,
      [questionNumber, sessionId]
    );
    return result.rows[0];
  }

  static async complete(sessionId) {
    const result = await pool.query(
      `UPDATE quiz_sessions 
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [sessionId]
    );
    return result.rows[0];
  }

  static async abandon(sessionId, questionNumber) {
    const result = await pool.query(
      `UPDATE quiz_sessions 
       SET status = 'abandoned' 
       WHERE id = $1 
       RETURNING *`,
      [sessionId]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT qs.*, u.phone_number, u.name 
       FROM quiz_sessions qs 
       JOIN users u ON qs.user_id = u.id 
       ORDER BY qs.created_at DESC`
    );
    return result.rows;
  }
}

export default QuizSession;
