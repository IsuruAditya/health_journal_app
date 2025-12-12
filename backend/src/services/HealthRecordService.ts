import { HealthRecordModel } from '@/models/HealthRecord';
import { CreateHealthRecordDto, HealthRecord } from '@/types';
import { aiServiceClient } from './AIServiceClient';

export class HealthRecordService {
  static async createRecord(userId: number, recordData: CreateHealthRecordDto): Promise<HealthRecord> {
    // Validate severity range
    if (recordData.severity && (recordData.severity < 1 || recordData.severity > 10)) {
      throw new Error('Severity must be between 1 and 10');
    }

    return await HealthRecordModel.create(userId, recordData);
  }

  static async getUserRecords(userId: number, limit?: number): Promise<HealthRecord[]> {
    return await HealthRecordModel.findByUserId(userId, limit);
  }

  static async getRecordById(recordId: number, userId: number): Promise<HealthRecord> {
    const record = await HealthRecordModel.findById(recordId, userId);
    if (!record) {
      throw new Error('Health record not found');
    }
    return record;
  }

  static async updateRecordAnalysis(recordId: number, analysis: any): Promise<void> {
    await HealthRecordModel.updateAnalysis(recordId, analysis);
  }

  static async updateRecord(recordId: number, userId: number, recordData: CreateHealthRecordDto): Promise<HealthRecord> {
    // Validate severity range
    if (recordData.severity && (recordData.severity < 1 || recordData.severity > 10)) {
      throw new Error('Severity must be between 1 and 10');
    }

    const record = await HealthRecordModel.update(recordId, userId, recordData);
    if (!record) {
      throw new Error('Health record not found');
    }
    return record;
  }

  static async deleteRecord(recordId: number, userId: number): Promise<void> {
    const record = await HealthRecordModel.findById(recordId, userId);
    if (!record) {
      throw new Error('Health record not found');
    }

    // Delete from PostgreSQL (source of truth)
    const deleted = await HealthRecordModel.delete(recordId, userId);
    if (!deleted) {
      throw new Error('Failed to delete health record');
    }

    // Async delete from AI service (fire-and-forget with circuit breaker)
    aiServiceClient.deleteRecordAsync(recordId);
  }
}