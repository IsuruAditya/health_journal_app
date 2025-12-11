import { HealthRecord, HealthAnalysis } from '@/types';

export class AIService {
  private static readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  static async analyzeHealthRecord(healthRecord: HealthRecord): Promise<HealthAnalysis> {
    try {
      // Prepare data for AI microservice
      const analysisData = {
        record_id: healthRecord.id,
        symptoms: healthRecord.symptoms,
        severity: healthRecord.severity,
        character: healthRecord.character,
        site: healthRecord.site,
        onset: healthRecord.onset,
        medications: healthRecord.medications,
        vital_signs: healthRecord.vital_signs,
        medical_history: {
          associations: healthRecord.associations,
          time_course: healthRecord.time_course,
          exacerbating_factors: healthRecord.exacerbating_factors,
          palliating_factors: healthRecord.palliating_factors
        }
      };

      // Call AI microservice
      const response = await fetch(`${this.AI_SERVICE_URL}/api/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.AI_API_KEY || 'ai-rag-demo-key-2024',
        },
        body: JSON.stringify({
          query: `Patient: ${healthRecord.symptoms}. Severity: ${healthRecord.severity}. Character: ${healthRecord.character}. Site: ${healthRecord.site}. Onset: ${healthRecord.onset}. Medications: ${healthRecord.medications}`
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const aiResult = await response.json() as any;
      const analysis = aiResult.analysis || '';
      
      // Parse AI analysis text to extract structured data
      const symptomPattern = this.extractFromAnalysis(analysis, 'symptom', healthRecord);
      const riskFactors = this.extractFromAnalysis(analysis, 'risk', healthRecord);
      const recommendations = this.extractFromAnalysis(analysis, 'recommend', healthRecord);
      const redFlags = this.extractFromAnalysis(analysis, 'red flag', healthRecord);
      
      return {
        recordId: healthRecord.id,
        analysisDate: new Date().toISOString(),
        symptomSeverity: healthRecord.severity?.toString() || 'Not specified',
        symptomPattern: symptomPattern.length > 0 ? symptomPattern : this.fallbackSymptomPattern(healthRecord),
        riskFactors: riskFactors.length > 0 ? riskFactors : this.fallbackRiskFactors(healthRecord),
        recommendations: recommendations.length > 0 ? recommendations : this.fallbackRecommendations(healthRecord),
        trends: { severityTrend: 'stable', frequencyTrend: 'stable' },
        redFlags: redFlags.length > 0 ? redFlags : this.fallbackRedFlags(healthRecord)
      };

    } catch (error) {
      console.error('AI service error:', error);
      // Fallback to local analysis if AI service fails
      return this.fallbackAnalysis(healthRecord);
    }
  }

  // Fallback analysis methods (simplified versions)
  private static fallbackAnalysis(record: HealthRecord): HealthAnalysis {
    return {
      recordId: record.id,
      analysisDate: new Date().toISOString(),
      symptomSeverity: record.severity || 'Not specified',
      symptomPattern: this.fallbackSymptomPattern(record),
      riskFactors: this.fallbackRiskFactors(record),
      recommendations: this.fallbackRecommendations(record),
      trends: { severityTrend: 'stable', frequencyTrend: 'stable' },
      redFlags: this.fallbackRedFlags(record)
    };
  }

  private static fallbackSymptomPattern(record: HealthRecord): string[] {
    const patterns: string[] = [];
    if (record.onset) patterns.push(`Onset: ${record.onset}`);
    if (record.character) patterns.push(`Character: ${record.character}`);
    if (record.time_course) patterns.push(`Duration: ${record.time_course}`);
    return patterns.length > 0 ? patterns : ['Insufficient data'];
  }

  private static fallbackRiskFactors(record: HealthRecord): string[] {
    const risks: string[] = [];
    if (record.severity && record.severity >= 8) risks.push('High severity symptoms');
    if (record.medications) risks.push('Current medication use');
    return risks.length > 0 ? risks : ['No immediate risks identified'];
  }

  private static fallbackRecommendations(record: HealthRecord): string[] {
    const recommendations: string[] = [];
    if (record.severity && record.severity >= 7) {
      recommendations.push('Consider medical consultation');
    }
    recommendations.push('Continue monitoring symptoms');
    return recommendations;
  }

  private static fallbackRedFlags(record: HealthRecord): string[] {
    const redFlags: string[] = [];
    if (record.severity && record.severity >= 9) redFlags.push('Severe symptoms');
    const symptoms = record.symptoms?.toLowerCase() || '';
    if (symptoms.includes('chest pain')) redFlags.push('Chest pain');
    if (symptoms.includes('breathing')) redFlags.push('Breathing issues');
    return redFlags;
  }

  private static extractFromAnalysis(analysis: string, keyword: string, record: HealthRecord): string[] {
    const lines = analysis.split('\n');
    const results: string[] = [];
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes(keyword)) {
        const cleaned = line.replace(/^[\s\-\*\•]+/, '').trim();
        if (cleaned.length > 0) {
          results.push(cleaned);
        }
      }
    }
    
    return results;
  }
}