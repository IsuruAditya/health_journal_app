import { HealthRecord, HealthAnalysis } from '@/types';
import { rateLimiters } from '@/utils/RateLimiter';
import { analysisCache } from '@/utils/Cache';
import { circuitBreakers } from '@/utils/CircuitBreaker';
import { analysisQueue, Priority } from '@/utils/Queue';
import { metrics } from '@/utils/Metrics';

export class AIService {
  private static readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  static async analyzeHealthRecord(healthRecord: HealthRecord, userHistory?: HealthRecord[], userId?: string): Promise<HealthAnalysis> {
    const startTime = Date.now();
    metrics.recordRequest();

    try {
      // 1. Rate Limiting
      if (userId) {
        const userLimiter = rateLimiters.getUserLimiter(userId);
        if (!await userLimiter.acquire()) {
          metrics.recordRateLimitHit();
          throw new Error('Rate limit exceeded. Please wait before making another request.');
        }
      }

      if (!await rateLimiters.aiService.acquire()) {
        metrics.recordRateLimitHit();
        metrics.recordQueuedRequest();
        // Queue the request instead of rejecting
        return await this.queueAnalysis(healthRecord, userHistory, userId);
      }
      // 2. Check Cache
      const query = this.buildQuery(healthRecord, userHistory);
      const cached = await analysisCache.get(query);
      if (cached) {
        metrics.recordCacheHit();
        metrics.recordSuccess(Date.now() - startTime);
        return cached;
      }
      metrics.recordCacheMiss();

      // 3. Circuit Breaker + AI Call
      const analysis = await circuitBreakers.aiService.execute(async () => {
        const result = await this.callAIService(query);
        result.recordId = healthRecord.id; // Set correct recordId
        return result;
      });

      // 4. Cache the result
      await analysisCache.set(query, analysis, 3600000); // 1 hour TTL

      metrics.recordSuccess(Date.now() - startTime);
      return analysis;

    } catch (error) {
      metrics.recordError();
      console.error('AI service error:', error);
      return this.fallbackAnalysis(healthRecord);
    }
  }

  private static buildQuery(healthRecord: HealthRecord, userHistory?: HealthRecord[]): string {
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

      return query;
  }

  private static async callAIService(query: string): Promise<HealthAnalysis> {
    // Call AI microservice with RAG (with 2 minute timeout for fallback models)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes
      
      try {
        const response = await fetch(`${this.AI_SERVICE_URL}/api/v1/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.AI_API_KEY || 'ai-rag-demo-key-2024',
          },
          body: JSON.stringify({ query }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`AI service error: ${response.statusText}`);
        }

        const aiResult = await response.json() as any;
        const analysis = aiResult.analysis || '';

        // Parse and return structured analysis
        // Extract recordId from query or use 0 as fallback
        const recordId = 0; // Will be set by caller
        return this.parseAnalysis(analysis, recordId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
  }

  private static parseAnalysis(analysis: string, recordId: number): HealthAnalysis {
        console.log('=== AI ANALYSIS RESPONSE ===');
        console.log(analysis);
        console.log('=== END RESPONSE ===');
        
        // Parse AI analysis with enhanced extraction
        const clinicalAssessment = this.extractSection(analysis, ['CLINICAL ASSESSMENT', 'ASSESSMENT', 'ANALYSIS']);
        const differential = this.extractDifferentialDiagnosis(analysis);
        const clinicalReasoning = this.extractSection(analysis, ['CLINICAL REASONING', 'REASONING', 'RATIONALE']);
        const recommendations = this.extractSection(analysis, ['RECOMMENDED', 'RECOMMENDATION', 'EVALUATION', 'NEXT STEPS', 'ACTION']);
        const redFlags = this.extractSection(analysis, ['RED FLAGS', 'WARNING', 'SAFETY', 'EMERGENCY', 'URGENT']);
        
        console.log('Parsed sections:', { 
          clinicalAssessment: clinicalAssessment.length, 
          differential: differential.length,
          clinicalReasoning: clinicalReasoning.length,
          recommendations: recommendations.length,
          redFlags: redFlags.length
        });
        
    return {
          recordId,
          analysisDate: new Date().toISOString(),
          symptomSeverity: 'Not specified',
          symptomPattern: clinicalAssessment.length > 0 ? clinicalAssessment : ['Analysis in progress'],
          riskFactors: clinicalReasoning.length > 0 ? clinicalReasoning : ['Assessment pending'],
          recommendations: recommendations.length > 0 ? recommendations : ['Recommendations pending'],
          trends: { severityTrend: 'stable', frequencyTrend: 'stable' },
          redFlags: redFlags.length > 0 ? redFlags : [],
          fullAnalysis: analysis,
          differentialDiagnosis: differential.length > 0 ? differential : ['Differential diagnosis not available']
        };
  }

  private static async queueAnalysis(healthRecord: HealthRecord, userHistory?: HealthRecord[], userId?: string): Promise<HealthAnalysis> {
    const priority = healthRecord.severity && healthRecord.severity >= 8 ? Priority.URGENT :
                     healthRecord.severity && healthRecord.severity >= 5 ? Priority.HIGH :
                     Priority.NORMAL;

    return new Promise((resolve, reject) => {
      analysisQueue.add(
        healthRecord.id.toString(),
        { healthRecord, userHistory, userId },
        priority
      ).then(() => {
        // Process queue
        analysisQueue.process(async (data) => {
          const result = await this.analyzeHealthRecord(data.healthRecord, data.userHistory, data.userId);
          resolve(result);
        });
      }).catch(reject);
    });
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
    
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      const lowerLine = trimmed.toLowerCase();
      
      // Check if we're entering a relevant section
      if (keywords.some(kw => lowerLine.includes(kw.toLowerCase()))) {
        inSection = true;
        continue;
      }
      
      // Stop at next major section (headers that DON'T match our keywords)
      if (inSection && (trimmed.startsWith('##') || /^[A-Z][A-Z\s]+$/.test(trimmed) || /^\*\*[A-Z]/.test(trimmed))) {
        if (!keywords.some(kw => lowerLine.includes(kw.toLowerCase()))) {
          break;
        }
      }
      
      // Extract content
      if (inSection && trimmed.length > 0) {
        // Skip headers but continue in section
        if (trimmed.startsWith('##') || (trimmed.startsWith('**') && trimmed.endsWith('**'))) continue;
        
        // Extract bullet points, numbered items, or plain text
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
          const cleaned = trimmed.replace(/^[\s\-\*\•\d\.]+/, '').trim();
          if (cleaned.length > 5) results.push(cleaned);
        } else if (!/^[A-Z][A-Z\s]+$/.test(trimmed)) {
          // Plain text paragraph (not all caps header)
          results.push(trimmed);
        }
      }
    }
    
    return [...new Set(results)].slice(0, 10);
  }

  private static extractDifferentialDiagnosis(analysis: string): string[] {
    const lines = analysis.split('\n');
    const results: string[] = [];
    const seen = new Set<string>();
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
      if (inSection && (trimmed.startsWith('##') || (trimmed.startsWith('**') && !lowerLine.includes('differential')))) {
        if (currentDiagnosis) {
          const normalized = currentDiagnosis.trim();
          if (!seen.has(normalized)) {
            results.push(normalized);
            seen.add(normalized);
          }
        }
        break;
      }
      
      // Extract numbered diagnoses
      if (inSection && /^\d+\./.test(trimmed)) {
        if (currentDiagnosis) {
          const normalized = currentDiagnosis.trim();
          if (!seen.has(normalized)) {
            results.push(normalized);
            seen.add(normalized);
          }
        }
        currentDiagnosis = trimmed;
      } else if (inSection && trimmed.startsWith('-') && currentDiagnosis) {
        // Only add first 3 supporting points to avoid bloat
        const points = currentDiagnosis.split('\n').filter(l => l.startsWith('-'));
        if (points.length < 3) {
          currentDiagnosis += '\n' + trimmed;
        }
      }
    }
    
    if (currentDiagnosis) {
      const normalized = currentDiagnosis.trim();
      if (!seen.has(normalized)) {
        results.push(normalized);
      }
    }
    
    return results.slice(0, 5); // Max 5 diagnoses
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