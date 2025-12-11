import { HealthRecordModel } from '@/models/HealthRecord';
import { CreateHealthRecordDto, HealthRecord } from '@/types';

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
}