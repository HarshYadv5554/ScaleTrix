import { pool } from '../config/database.js';

class QuizResponse {
  static async create(sessionId, questionNumber, questionText, answer) {
    const result = await pool.query(
      `INSERT INTO quiz_responses (session_id, question_number, question_text, answer) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [sessionId, questionNumber, questionText, answer]
    );
    return result.rows[0];
  }

  static async getBySession(sessionId) {
    const result = await pool.query(
      `SELECT * FROM quiz_responses 
       WHERE session_id = $1 
       ORDER BY question_number ASC`,
      [sessionId]
    );
    return result.rows;
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT qr.*, qs.user_id, u.phone_number 
       FROM quiz_responses qr 
       JOIN quiz_sessions qs ON qr.session_id = qs.id 
       JOIN users u ON qs.user_id = u.id 
       ORDER BY qr.answered_at DESC`
    );
    return result.rows;
  }
}

export default QuizResponse;
