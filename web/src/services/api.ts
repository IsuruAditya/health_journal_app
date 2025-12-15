import axios from 'axios';
import type { AuthResponse, HealthRecord, CreateHealthRecordData, ApiResponse, HealthAnalysis } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://health-journal-backend.vercel.app/api' : 'http://localhost:3001/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for AI analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    const { token } = response.data.data!;
    localStorage.setItem('authToken', token);
    return response.data.data!;
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', { email, password });
    const { token } = response.data.data!;
    localStorage.setItem('authToken', token);
    return response.data.data!;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },
};

export const healthRecordsApi = {
  getRecords: async (): Promise<HealthRecord[]> => {
    const response = await api.get<ApiResponse<HealthRecord[]>>('/health-records');
    return response.data.data!;
  },

  createRecord: async (data: CreateHealthRecordData): Promise<HealthRecord> => {
    const response = await api.post<ApiResponse<HealthRecord>>('/health-records', data);
    const newRecord = response.data.data!;
    
    // Automatically add to AI knowledge base
    try {
      const { aiService } = await import('./aiService');
      await aiService.addHealthRecord(newRecord);
    } catch (error) {
      console.warn('Failed to sync with AI service:', error);
    }
    
    return newRecord;
  },

  getRecord: async (id: number): Promise<HealthRecord> => {
    const response = await api.get<ApiResponse<HealthRecord>>(`/health-records/${id}`);
    return response.data.data!;
  },

  getAnalysis: async (recordId: number): Promise<HealthAnalysis> => {
    const response = await api.get<ApiResponse<HealthAnalysis>>(`/analysis/${recordId}`);
    return response.data.data!;
  },

  // Enhanced analysis using direct AI service
  getAIAnalysis: async (record: HealthRecord): Promise<HealthAnalysis> => {
    try {
      const { aiService } = await import('./aiService');
      const aiResponse = await aiService.analyzeHealthRecord(record);
      
      // Transform AI response to HealthAnalysis format
      return {
        recordId: record.id,
        analysisDate: new Date().toISOString(),
        symptomSeverity: record.severity || 'Not specified',
        symptomPattern: aiResponse.analysis.includes('pattern') ? 
          aiResponse.analysis.split('\n').filter(line => line.includes('pattern')) : 
          [`Severity: ${record.severity}/10`, `Character: ${record.character || 'Not specified'}`],
        riskFactors: aiResponse.analysis.includes('risk') ? 
          aiResponse.analysis.split('\n').filter(line => line.includes('risk')) : 
          record.severity && record.severity >= 7 ? ['High severity symptoms'] : ['No immediate risks identified'],
        recommendations: aiResponse.analysis.includes('recommend') ? 
          aiResponse.analysis.split('\n').filter(line => line.includes('recommend')) : 
          ['Continue monitoring symptoms', 'Consult healthcare provider if symptoms worsen'],
        trends: {
          severityTrend: 'stable',
          frequencyTrend: 'stable'
        },
        redFlags: aiResponse.analysis.includes('urgent') || aiResponse.analysis.includes('emergency') ? 
          ['Requires medical attention'] : []
      };
    } catch (error) {
      console.error('Direct AI analysis failed, falling back to backend:', error);
      return await healthRecordsApi.getAnalysis(record.id);
    }
  },

  updateRecord: async (id: number, data: CreateHealthRecordData): Promise<HealthRecord> => {
    const response = await api.put<ApiResponse<HealthRecord>>(`/health-records/${id}`, data);
    return response.data.data!;
  },

  deleteRecord: async (id: number): Promise<void> => {
    await api.delete(`/health-records/${id}`);
  },

  getOverallAnalysis: async (): Promise<HealthAnalysis & { totalRecords: number; dateRange: any }> => {
    const response = await api.get<ApiResponse<any>>('/health-records/analysis/overall');
    return response.data.data!;
  },
};

export default api;