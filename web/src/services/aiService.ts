import axios from 'axios'
import type { HealthRecord } from '@/types'

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000'
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || 'ai-rag-demo-key-2024'

// Create axios instance for AI service
const aiApi = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': AI_API_KEY,
  },
  timeout: 30000, // 30 second timeout for AI operations
})

// Request interceptor for logging
aiApi.interceptors.request.use((config) => {
  console.log(`AI Service Request: ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Response interceptor for error handling
aiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AI Service Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface AIAnalysisRequest {
  query: string
  location?: string
  context?: {
    symptoms: string
    severity: number
    medications?: string
    vital_signs?: any
  }
}

export interface AIAnalysisResponse {
  analysis: string
  timestamp: number
  confidence?: number
  context_used?: number
}

export const aiService = {
  // Health check for AI service
  async healthCheck(): Promise<boolean> {
    try {
      const response = await aiApi.get('/api/v1/health/health')
      return response.data.status === 'healthy'
    } catch (error) {
      console.error('AI service health check failed:', error)
      return false
    }
  },

  // Analyze health record using AI RAG service
  async analyzeHealthRecord(record: HealthRecord): Promise<AIAnalysisResponse> {
    try {
      // Prepare comprehensive query for AI analysis
      const query = this.buildAnalysisQuery(record)
      
      const response = await aiApi.post<AIAnalysisResponse>('/api/v1/analyze', {
        query,
        location: 'general',
        context: {
          symptoms: record.symptoms || '',
          severity: record.severity || 0,
          medications: record.medications || '',
          vital_signs: record.vital_signs
        }
      })

      return response.data
    } catch (error: any) {
      console.error('AI analysis failed:', error)
      throw new Error(
        error.response?.data?.detail || 
        'AI analysis service is currently unavailable. Please try again later.'
      )
    }
  },

  // Add health record to AI knowledge base
  async addHealthRecord(record: HealthRecord): Promise<void> {
    try {
      const recordData = {
        date: record.record_date,
        symptoms: this.buildSymptomsDict(record),
        lifestyle: {
          medications: record.medications || '',
          diet_notes: record.diet_notes || ''
        },
        biometrics: record.vital_signs || {},
        metadata: {
          record_id: record.id.toString(),
          user_id: record.user_id.toString(),
          created_at: record.created_at
        },
        reports: record.personal_notes || ''
      }

      await aiApi.post('/api/v1/health/records', recordData)
      console.log('Health record added to AI knowledge base')
    } catch (error) {
      console.error('Failed to add record to AI service:', error)
      // Don't throw error - this is not critical for user workflow
    }
  },

  // Build SOCRATES-based symptoms dictionary
  buildSymptomsDict(record: HealthRecord): Record<string, string> {
    return {
      site: record.site || '',
      onset: record.onset || '',
      character: record.character || '',
      radiation: record.radiation || '',
      associations: record.associations || '',
      time_course: record.time_course || '',
      exacerbating_factors: record.exacerbating_factors || '',
      severity: record.severity?.toString() || '0',
      palliating_factors: record.palliating_factors || '',
      quality: record.quality || '',
      region: record.region || '',
      general_symptoms: record.symptoms || ''
    }
  },

  // Build comprehensive analysis query
  buildAnalysisQuery(record: HealthRecord): string {
    const parts = []
    
    if (record.symptoms) {
      parts.push(`Primary symptoms: ${record.symptoms}`)
    }
    
    if (record.site) {
      parts.push(`Location: ${record.site}`)
    }
    
    if (record.character) {
      parts.push(`Character: ${record.character}`)
    }
    
    if (record.severity) {
      parts.push(`Severity: ${record.severity}/10`)
    }
    
    if (record.onset) {
      parts.push(`Onset: ${record.onset}`)
    }
    
    if (record.medications) {
      parts.push(`Current medications: ${record.medications}`)
    }
    
    if (record.vital_signs) {
      const vitals = Object.entries(record.vital_signs)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
      if (vitals) {
        parts.push(`Vital signs: ${vitals}`)
      }
    }

    return parts.join('. ') + '. Please provide a comprehensive health analysis with recommendations.'
  }
}

export default aiService