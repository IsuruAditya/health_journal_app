import { pool } from '@/config/database';
import { User } from '@/types';

export class UserModel {
  static async create(email: string, hashedPassword: string): Promise<User> {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at';
    const result = await pool.query(query, [email, hashedPassword]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT id, email, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}