import { Request, Response } from 'express';
import { HealthRecordService } from '@/services/HealthRecordService';
import { AnalysisService } from '@/services/AnalysisService';
import { CreateHealthRecordDto, ApiResponse } from '@/types';
import { asyncHandler } from '@/middleware/errorHandler';

export class HealthRecordController {
  static createRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const recordData: CreateHealthRecordDto = req.body;
    
    const record = await HealthRecordService.createRecord(userId, recordData);
    
    const response: ApiResponse = {
      success: true,
      data: record,
      message: 'Health record created successfully'
    };
    
    res.status(201).json(response);
  });

  static getRecords = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const records = await HealthRecordService.getUserRecords(userId, limit);
    
    const response: ApiResponse = {
      success: true,
      data: records,
      message: 'Health records retrieved successfully'
    };
    
    res.json(response);
  });

  static getRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const recordId = parseInt(req.params.id);
    
    const record = await HealthRecordService.getRecordById(recordId, userId);
    
    const response: ApiResponse = {
      success: true,
      data: record,
      message: 'Health record retrieved successfully'
    };
    
    res.json(response);
  });

  static getAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const recordId = parseInt(req.params.recordId);
    
    // Get current record and user's health history
    const record = await HealthRecordService.getRecordById(recordId, userId);
    const userHistory = await HealthRecordService.getUserRecords(userId, 10); // Last 10 records
    
    // Filter out current record from history
    const pastRecords = userHistory.filter(r => r.id !== recordId);
    
    // Analyze with full context
    const analysis = await AnalysisService.analyzeHealthRecord(record, pastRecords, userId.toString());
    
    // Auto-save analysis to database
    await HealthRecordService.updateRecordAnalysis(recordId, analysis);
    
    const response: ApiResponse = {
      success: true,
      data: analysis,
      message: 'Health analysis completed successfully'
    };
    
    res.json(response);
  });

  static updateRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const recordId = parseInt(req.params.id);
    const recordData: CreateHealthRecordDto = req.body;
    
    const record = await HealthRecordService.updateRecord(recordId, userId, recordData);
    
    const response: ApiResponse = {
      success: true,
      data: record,
      message: 'Health record updated successfully'
    };
    
    res.json(response);
  });

  static deleteRecord = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const recordId = parseInt(req.params.id);
    
    await HealthRecordService.deleteRecord(recordId, userId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Health record deleted successfully'
    };
    
    res.json(response);
  });

  static getOverallAnalysis = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    
    // Get all user records
    const records = await HealthRecordService.getUserRecords(userId, 20);
    
    if (records.length === 0) {
      const response: ApiResponse = {
        success: true,
        data: {
          summary: 'No health records available for analysis',
          totalRecords: 0,
          trends: { severityTrend: 'N/A', frequencyTrend: 'N/A' }
        },
        message: 'No records found'
      };
      res.json(response);
      return;
    }

    // Create summary query for AI
    const recentRecords = records.slice(0, 10);
    const query = `Overall Health Summary Analysis:

Patient has ${records.length} health records. Recent symptoms:
${recentRecords.map((r, i) => `${i + 1}. [${r.record_date}] ${r.symptoms} (Severity: ${r.severity}/10, Site: ${r.site})`).join('\n')}

Provide:
1. Overall health pattern analysis
2. Recurring symptoms or conditions
3. Severity trends over time
4. Key recommendations for long-term health management
5. Any concerning patterns requiring medical attention`;

    // Get AI analysis
    const analysis = await AnalysisService.analyzeHealthRecord(recentRecords[0], recentRecords.slice(1), userId.toString());
    
    const response: ApiResponse = {
      success: true,
      data: {
        ...analysis,
        totalRecords: records.length,
        dateRange: {
          earliest: records[records.length - 1]?.record_date,
          latest: records[0]?.record_date
        }
      },
      message: 'Overall health analysis completed'
    };
    
    res.json(response);
  });
}