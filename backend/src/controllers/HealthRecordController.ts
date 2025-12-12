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
    
    const record = await HealthRecordService.getRecordById(recordId, userId);
    const analysis = await AnalysisService.analyzeHealthRecord(record);
    
    // Optionally save analysis to database
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
}