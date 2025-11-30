import { pool } from '../config/database.js';

class Analytics {
  static async logEvent(sessionId, userId, eventType, metadata = {}) {
    const result = await pool.query(
      `INSERT INTO analytics_events (session_id, user_id, event_type, metadata) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [sessionId, userId, eventType, JSON.stringify(metadata)]
    );
    return result.rows[0];
  }

  static async getEvents(filters = {}) {
    let query = `
      SELECT ae.*, u.phone_number, u.name 
      FROM analytics_events ae 
      JOIN users u ON ae.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.eventType) {
      query += ` AND ae.event_type = $${paramCount}`;
      params.push(filters.eventType);
      paramCount++;
    }

    if (filters.startDate) {
      query += ` AND ae.created_at >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND ae.created_at <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }

    query += ` ORDER BY ae.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getStats() {
    // Quiz started count
    const startedResult = await pool.query(
      "SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'quiz_started'"
    );
    const started = parseInt(startedResult.rows[0].count);

    // Quiz completed count
    const completedResult = await pool.query(
      "SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'quiz_completed'"
    );
    const completed = parseInt(completedResult.rows[0].count);

    // Drop-off analysis
    const dropoffResult = await pool.query(
      `SELECT 
        event_type,
        COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type LIKE 'dropped_off_after_question_%' 
       GROUP BY event_type 
       ORDER BY event_type`
    );

    // Question completion rates
    const questionResult = await pool.query(
      `SELECT 
        event_type,
        COUNT(*) as count 
       FROM analytics_events 
       WHERE event_type LIKE 'question_%_answered' 
       GROUP BY event_type 
       ORDER BY event_type`
    );

    // Completion rate
    const completionRate = started > 0 ? ((completed / started) * 100).toFixed(2) : 0;

    return {
      totalStarted: started,
      totalCompleted: completed,
      completionRate: parseFloat(completionRate),
      dropoffs: dropoffResult.rows,
      questionStats: questionResult.rows
    };
  }
}

export default Analytics;
