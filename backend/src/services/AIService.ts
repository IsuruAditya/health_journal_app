import { HealthRecord, HealthAnalysis } from '@/types';

export class AIService {
  private static readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  static async analyzeHealthRecord(healthRecord: HealthRecord, userHistory?: HealthRecord[]): Promise<HealthAnalysis> {
    try {
      // Build comprehensive query with current symptoms
      let query = `Current Symptoms Analysis:
- Symptoms: ${healthRecord.symptoms}
- Severity: ${healthRecord.severity}/10
- Location: ${healthRecord.site}
- Character: ${healthRecord.character}
- Onset: ${healthRecord.onset}
- Medications: ${healthRecord.medications || 'None'}
- Vital Signs: ${healthRecord.vital_signs || 'Not recorded'}`;

      // Add historical context if available
      if (userHistory && userHistory.length > 0) {
        query += `\n\nPrevious Health Records (for pattern analysis):\n`;
        userHistory.slice(0, 5).forEach((record, idx) => {
          query += `\n${idx + 1}. [${record.record_date}] ${record.symptoms} (Severity: ${record.severity}/10, Site: ${record.site})`;
        });
        query += `\n\nPlease analyze current symptoms in context of patient's health history. Identify patterns, trends, and potential underlying conditions.`;
      }

      // Call AI microservice with RAG
      const response = await fetch(`${this.AI_SERVICE_URL}/api/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.AI_API_KEY || 'ai-rag-demo-key-2024',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const aiResult = await response.json() as any;
      const analysis = aiResult.analysis || '';
      
      // Parse AI analysis with enhanced extraction
      const clinicalAssessment = this.extractSection(analysis, ['CLINICAL ASSESSMENT']);
      const differential = this.extractDifferentialDiagnosis(analysis);
      const clinicalReasoning = this.extractSection(analysis, ['CLINICAL REASONING', 'REASONING']);
      const recommendations = this.extractSection(analysis, ['RECOMMENDED EVALUATION', 'EVALUATION', 'NEXT STEPS']);
      const redFlags = this.extractSection(analysis, ['RED FLAGS', 'SAFETY', 'EMERGENCY']);
      const limitations = this.extractSection(analysis, ['LIMITATIONS', 'UNCERTAINTY']);
      
      return {
        recordId: healthRecord.id,
        analysisDate: new Date().toISOString(),
        symptomSeverity: healthRecord.severity?.toString() || 'Not specified',
        symptomPattern: clinicalAssessment.length > 0 ? clinicalAssessment : this.fallbackSymptomPattern(healthRecord),
        riskFactors: clinicalReasoning.length > 0 ? clinicalReasoning : this.fallbackRiskFactors(healthRecord),
        recommendations: recommendations.length > 0 ? recommendations : this.fallbackRecommendations(healthRecord),
        trends: this.analyzeTrends(healthRecord, userHistory),
        redFlags: redFlags.length > 0 ? redFlags : this.fallbackRedFlags(healthRecord),
        fullAnalysis: analysis,
        differentialDiagnosis: differential.length > 0 ? differential : ['Differential diagnosis not available']
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

  private static extractSection(analysis: string, keywords: string[]): string[] {
    const lines = analysis.split('\n');
    const results: string[] = [];
    let inSection = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      const lowerLine = trimmed.toLowerCase();
      
      // Check if we're entering a relevant section
      if (keywords.some(kw => lowerLine.includes(kw.toLowerCase()))) {
        inSection = true;
        continue;
      }
      
      // Stop at next major section (starts with **)
      if (inSection && trimmed.startsWith('**') && !keywords.some(kw => lowerLine.includes(kw.toLowerCase()))) {
        inSection = false;
      }
      
      // Extract bullet points or numbered items
      if (inSection && (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed))) {
        const cleaned = trimmed.replace(/^[\s\-\*\•\d\.]+/, '').trim();
        if (cleaned.length > 10) {
          results.push(cleaned);
        }
      }
    }
    
    return results.slice(0, 8); // Increased to capture more details
  }

  private static extractDifferentialDiagnosis(analysis: string): string[] {
    const lines = analysis.split('\n');
    const results: string[] = [];
    let inSection = false;
    let currentDiagnosis = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      const lowerLine = trimmed.toLowerCase();
      
      // Check if we're in differential diagnosis section
      if (lowerLine.includes('differential diagnosis')) {
        inSection = true;
        continue;
      }
      
      // Stop at next major section
      if (inSection && trimmed.startsWith('**') && !lowerLine.includes('differential')) {
        if (currentDiagnosis) results.push(currentDiagnosis.trim());
        break;
      }
      
      // Extract numbered diagnoses (1. MOST LIKELY:, 2. CONSIDER:, etc.)
      if (inSection && /^\d+\./.test(trimmed)) {
        if (currentDiagnosis) results.push(currentDiagnosis.trim());
        currentDiagnosis = trimmed;
      } else if (inSection && trimmed.startsWith('-') && currentDiagnosis) {
        currentDiagnosis += '\n' + trimmed;
      }
    }
    
    if (currentDiagnosis) results.push(currentDiagnosis.trim());
    return results;
  }

  private static analyzeTrends(current: HealthRecord, history?: HealthRecord[]): { severityTrend: string; frequencyTrend: string } {
    if (!history || history.length < 2) {
      return { severityTrend: 'insufficient data', frequencyTrend: 'insufficient data' };
    }

    // Analyze severity trend
    const recentSeverities = history.slice(0, 3).map(r => r.severity || 0);
    const avgRecent = recentSeverities.reduce((a, b) => a + b, 0) / recentSeverities.length;
    const currentSeverity = current.severity || 0;
    
    let severityTrend = 'stable';
    if (currentSeverity > avgRecent + 2) severityTrend = 'worsening';
    else if (currentSeverity < avgRecent - 2) severityTrend = 'improving';

    // Analyze frequency (records in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRecords = history.filter(r => new Date(r.record_date) > thirtyDaysAgo);
    
    let frequencyTrend = 'stable';
    if (recentRecords.length > 5) frequencyTrend = 'increasing';
    else if (recentRecords.length < 2) frequencyTrend = 'decreasing';

    return { severityTrend, frequencyTrend };
  }
}