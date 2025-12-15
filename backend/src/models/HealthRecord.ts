import { pool } from '../config/database';
import { HealthRecord, CreateHealthRecordDto } from '../types';

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

  static async update(recordId: number, userId: number, recordData: CreateHealthRecordDto): Promise<HealthRecord | null> {
    const query = `
      UPDATE health_records SET
        record_date = $1, record_time = $2, site = $3, onset = $4, character = $5,
        radiation = $6, associations = $7, time_course = $8, exacerbating_factors = $9,
        severity = $10, palliating_factors = $11, quality = $12, region = $13,
        symptoms = $14, medications = $15, diet_notes = $16, vital_signs = $17,
        personal_notes = $18, updated_at = CURRENT_TIMESTAMP
      WHERE id = $19 AND user_id = $20
      RETURNING *`;
    
    const values = [
      recordData.record_date, recordData.record_time, recordData.site, recordData.onset,
      recordData.character, recordData.radiation, recordData.associations, recordData.time_course,
      recordData.exacerbating_factors, recordData.severity, recordData.palliating_factors,
      recordData.quality, recordData.region, recordData.symptoms, recordData.medications,
      recordData.diet_notes, JSON.stringify(recordData.vital_signs), recordData.personal_notes,
      recordId, userId
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(recordId: number, userId: number): Promise<boolean> {
    const query = 'DELETE FROM health_records WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [recordId, userId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}