import { pool } from '@/config/database';
import { HealthRecord, CreateHealthRecordDto } from '@/types';

export class HealthRecordModel {
  static async create(userId: number, recordData: CreateHealthRecordDto): Promise<HealthRecord> {
    const query = `
      INSERT INTO health_records (
        user_id, record_date, record_time, site, onset, character, radiation,
        associations, time_course, exacerbating_factors, severity, palliating_factors,
        quality, region, symptoms, medications, diet_notes, vital_signs, personal_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`;
    
    const values = [
      userId,
      recordData.record_date,
      recordData.record_time,
      recordData.site,
      recordData.onset,
      recordData.character,
      recordData.radiation,
      recordData.associations,
      recordData.time_course,
      recordData.exacerbating_factors,
      recordData.severity,
      recordData.palliating_factors,
      recordData.quality,
      recordData.region,
      recordData.symptoms,
      recordData.medications,
      recordData.diet_notes,
      JSON.stringify(recordData.vital_signs),
      recordData.personal_notes
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId: number, limit: number = 50): Promise<HealthRecord[]> {
    const query = `
      SELECT * FROM health_records 
      WHERE user_id = $1 
      ORDER BY record_date DESC, record_time DESC 
      LIMIT $2`;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  static async findById(recordId: number, userId: number): Promise<HealthRecord | null> {
    const query = 'SELECT * FROM health_records WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [recordId, userId]);
    return result.rows[0] || null;
  }

  static async updateAnalysis(recordId: number, analysis: any): Promise<void> {
    const query = 'UPDATE health_records SET ai_analysis = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [JSON.stringify(analysis), recordId]);
  }
}