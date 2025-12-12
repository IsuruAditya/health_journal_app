import { HealthRecord, HealthAnalysis } from '@/types';
import { AIService } from './AIService';

export class AnalysisService {
  static async analyzeHealthRecord(healthRecord: HealthRecord, userHistory?: HealthRecord[], userId?: string): Promise<HealthAnalysis> {
    // Use AI microservice for analysis with full health history
    return await AIService.analyzeHealthRecord(healthRecord, userHistory, userId);
  }

  private static analyzeSymptomPattern(record: HealthRecord): string[] {
    const patterns: string[] = [];
    
    if (record.onset) patterns.push(`Onset: ${record.onset}`);
    if (record.character) patterns.push(`Character: ${record.character}`);
    if (record.time_course) patterns.push(`Duration: ${record.time_course}`);
    
    return patterns.length > 0 ? patterns : ['Insufficient data for pattern analysis'];
  }

  private static identifyRiskFactors(record: HealthRecord): string[] {
    const risks: string[] = [];
    
    if (record.severity && record.severity >= 8) {
      risks.push('High severity symptoms');
    }
    if (record.medications) {
      risks.push('Current medication use');
    }
    if (record.associations?.toLowerCase().includes('chest')) {
      risks.push('Chest-related symptoms require attention');
    }
    
    return risks.length > 0 ? risks : ['No immediate risk factors identified'];
  }

  private static generateRecommendations(record: HealthRecord): string[] {
    const recommendations: string[] = [];
    
    if (record.severity && record.severity >= 7) {
      recommendations.push('Consider seeking medical attention for high severity symptoms');
    }
    
    if (record.exacerbating_factors) {
      recommendations.push(`Avoid triggers: ${record.exacerbating_factors}`);
    }
    
    if (record.palliating_factors) {
      recommendations.push(`Continue helpful measures: ${record.palliating_factors}`);
    }
    
    recommendations.push('Continue monitoring symptoms and maintain regular records');
    
    return recommendations;
  }

  private static identifyRedFlags(record: HealthRecord): string[] {
    const redFlags: string[] = [];
    
    if (record.severity && record.severity >= 9) {
      redFlags.push('Severe pain level');
    }
    
    const symptoms = record.symptoms?.toLowerCase() || '';
    if (symptoms.includes('chest pain')) {
      redFlags.push('Chest pain symptoms');
    }
    if (symptoms.includes('difficulty breathing')) {
      redFlags.push('Breathing difficulties');
    }
    
    return redFlags;
  }
}