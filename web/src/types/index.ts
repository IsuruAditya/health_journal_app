export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VitalSigns {
  blood_pressure?: string;
  temperature?: string;
  pulse?: string;
  weight?: string;
}

export interface HealthRecord {
  id: number;
  user_id: number;
  record_date: string;
  record_time: string;
  
  // SOCRATES Framework
  site?: string;
  onset?: string;
  character?: string;
  radiation?: string;
  associations?: string;
  time_course?: string;
  exacerbating_factors?: string;
  severity?: number;
  
  // PQRST additions
  palliating_factors?: string;
  quality?: string;
  region?: string;
  
  // General health data
  symptoms?: string;
  medications?: string;
  diet_notes?: string;
  vital_signs?: VitalSigns;
  personal_notes?: string;
  ai_analysis?: any;
  
  created_at: string;
  updated_at: string;
}

export interface CreateHealthRecordData {
  record_date: string;
  record_time: string;
  site?: string;
  onset?: string;
  character?: string;
  radiation?: string;
  associations?: string;
  time_course?: string;
  exacerbating_factors?: string;
  severity?: number;
  palliating_factors?: string;
  quality?: string;
  region?: string;
  symptoms?: string;
  medications?: string;
  diet_notes?: string;
  vital_signs?: VitalSigns;
  personal_notes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HealthAnalysis {
  recordId: number;
  analysisDate: string;
  symptomSeverity: string | number;
  symptomPattern: string[];
  riskFactors: string[];
  recommendations: string[];
  trends: {
    severityTrend: string;
    frequencyTrend: string;
  };
  redFlags: string[];
}