import { pool } from '../config/database.js';

class User {
  static async findOrCreate(phoneNumber, name = null) {
    try {
      // finding existing user
      const findResult = await pool.query(
        'SELECT * FROM users WHERE phone_number = $1',
        [phoneNumber]
      );

      if (findResult.rows.length > 0) {
        return findResult.rows[0];
      }

      // Create new user
      const insertResult = await pool.query(
        'INSERT INTO users (phone_number, name) VALUES ($1, $2) RETURNING *',
        [phoneNumber, name]
      );

      return insertResult.rows[0];
    } catch (error) {
      console.error('Error in User.findOrCreate:', error);
      throw error;
    }
  }

  static async findById(userId) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  }

  static async updateName(userId, name) {
    const result = await pool.query(
      'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, userId]
    );
    return result.rows[0];
  }
}

export default User;
