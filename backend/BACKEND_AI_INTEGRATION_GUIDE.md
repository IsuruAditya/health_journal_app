# 🏥 Backend & AI RAG Integration Guide

## 📋 Table of Contents
- [Backend Architecture Overview](#-backend-architecture-overview)
- [AI RAG Integration Flow](#-ai-rag-integration-flow)
- [Service Layer Analysis](#-service-layer-analysis)
- [API Endpoints & Data Flow](#-api-endpoints--data-flow)
- [Integration Implementation](#-integration-implementation)
- [Error Handling & Fallbacks](#-error-handling--fallbacks)
- [Complete Request-Response Cycle](#-complete-request-response-cycle)
- [Deployment & Configuration](#-deployment--configuration)

---

## 🏗️ Backend Architecture Overview

### **Technology Stack**
```
┌─────────────────────────────────────┐
│           Frontend Layer            │  ← React/Vue (Web + Mobile)
├─────────────────────────────────────┤
│         Backend API Layer           │  ← Node.js + Express + TypeScript
├─────────────────────────────────────┤
│        AI RAG Microservice          │  ← Python + FastAPI
├─────────────────────────────────────┤
│         Database Layer              │  ← PostgreSQL + MongoDB
└─────────────────────────────────────┘
```

### **Backend Structure**
```
health_journal_app/backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── AuthController.ts
│   │   └── HealthRecordController.ts
│   ├── services/             # Business logic
│   │   ├── AIService.ts      # 🤖 AI RAG Integration
│   │   ├── AnalysisService.ts
│   │   ├── AuthService.ts
│   │   └── HealthRecordService.ts
│   ├── routes/               # API endpoints
│   │   ├── analysis.ts       # 📊 AI analysis routes
│   │   ├── auth.ts
│   │   ├── healthRecords.ts  # 📝 Health record CRUD
│   │   └── index.ts
│   ├── models/               # Data models
│   │   ├── HealthRecord.ts
│   │   └── User.ts
│   ├── middleware/           # Cross-cutting concerns
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── types/                # TypeScript definitions
│   │   └── index.ts
│   └── config/               # Configuration
│       └── database.ts
```

---

## 🔄 AI RAG Integration Flow

### **High-Level Integration Architecture**

```mermaid
graph TD
    A[Frontend App] --> B[Backend API]
    B --> C[Health Record Service]
    B --> D[AI Service]
    
    C --> E[PostgreSQL Database]
    D --> F[AI RAG Microservice]
    F --> G[MongoDB Vector DB]
    F --> H[Groq/HuggingFace AI]
    
    B --> I[Analysis Service]
    I --> D
    
    style D fill:#e1f5fe
    style F fill:#fff3e0
    style I fill:#e8f5e8
```

### **Integration Points**

#### **1. Data Storage Integration**
```typescript
// Backend stores health records in PostgreSQL
// AI RAG stores vectors in MongoDB
// Both systems work independently but share data
```

#### **2. Analysis Integration**
```typescript
// Backend calls AI RAG for analysis
// AI RAG returns structured medical insights
// Backend processes and stores results
```

#### **3. Fallback Integration**
```typescript
// If AI RAG fails, backend provides basic analysis
// Graceful degradation ensures system reliability
```

---

## 🔧 Service Layer Analysis

### **1. AIService.ts - Core AI Integration**

#### **Purpose**: Bridge between backend and AI RAG microservice

```typescript
export class AIService {
  private static readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  static async analyzeHealthRecord(healthRecord: HealthRecord): Promise<HealthAnalysis> {
    try {
      // 1. Prepare data for AI microservice
      const response = await fetch(`${this.AI_SERVICE_URL}/api/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.AI_API_KEY || 'ai-rag-demo-key-2024',
        },
        body: JSON.stringify({
          query: `Patient: ${healthRecord.symptoms}. Severity: ${healthRecord.severity}...`
        })
      });

      // 2. Process AI response
      const aiResult = await response.json();
      
      // 3. Parse and structure the analysis
      return this.parseAIAnalysis(aiResult.analysis, healthRecord);
      
    } catch (error) {
      // 4. Fallback to local analysis
      return this.fallbackAnalysis(healthRecord);
    }
  }
}
```

#### **Key Functions:**

**🔄 Data Transformation**
```typescript
// Converts backend health record format to AI RAG format
const analysisData = {
  record_id: healthRecord.id,
  symptoms: healthRecord.symptoms,
  severity: healthRecord.severity,
  // ... other fields
};
```

**🤖 AI Communication**
```typescript
// Makes HTTP request to AI RAG microservice
const response = await fetch(`${AI_SERVICE_URL}/api/v1/analyze`, {
  method: 'POST',
  headers: { 'X-API-Key': process.env.AI_API_KEY },
  body: JSON.stringify({ query: formattedQuery })
});
```

**📊 Response Processing**
```typescript
// Parses AI analysis text into structured data
const symptomPattern = this.extractFromAnalysis(analysis, 'symptom', healthRecord);
const riskFactors = this.extractFromAnalysis(analysis, 'risk', healthRecord);
const recommendations = this.extractFromAnalysis(analysis, 'recommend', healthRecord);
```

**🛡️ Fallback Handling**
```typescript
// Provides basic analysis when AI service fails
private static fallbackAnalysis(record: HealthRecord): HealthAnalysis {
  return {
    recordId: record.id,
    symptomSeverity: record.severity || 'Not specified',
    recommendations: ['Continue monitoring symptoms'],
    // ... basic analysis
  };
}
```

### **2. AnalysisService.ts - Analysis Orchestration**

#### **Purpose**: Coordinates analysis workflow

```typescript
export class AnalysisService {
  static async analyzeHealthRecord(healthRecord: HealthRecord): Promise<HealthAnalysis> {
    // Delegates to AI service for analysis
    return await AIService.analyzeHealthRecord(healthRecord);
  }
}
```

### **3. HealthRecordService.ts - Data Management**

#### **Purpose**: Manages health record CRUD operations

```typescript
export class HealthRecordService {
  static async createRecord(userId: number, recordData: CreateHealthRecordDto): Promise<HealthRecord> {
    // 1. Validate data
    if (recordData.severity && (recordData.severity < 1 || recordData.severity > 10)) {
      throw new Error('Severity must be between 1 and 10');
    }

    // 2. Store in PostgreSQL
    return await HealthRecordModel.create(userId, recordData);
  }

  static async updateRecordAnalysis(recordId: number, analysis: any): Promise<void> {
    // Store AI analysis results back to database
    await HealthRecordModel.updateAnalysis(recordId, analysis);
  }
}
```

---

## 🌐 API Endpoints & Data Flow

### **Health Records API (`/api/health-records`)**

#### **POST /api/health-records - Create Record**
```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend API
    participant DB as PostgreSQL
    participant AI as AI RAG Service
    
    F->>B: POST /api/health-records
    B->>B: Validate data
    B->>DB: Store health record
    DB->>B: Return record ID
    B->>AI: Send record to AI RAG (optional)
    AI->>AI: Store in vector database
    B->>F: Return success response
```

**Request Example:**
```json
{
  "record_date": "2024-01-15",
  "record_time": "14:30",
  "symptoms": "Severe headache with dizziness",
  "severity": 8,
  "site": "temples",
  "onset": "sudden",
  "character": "throbbing",
  "medications": "ibuprofen 400mg",
  "vital_signs": {
    "blood_pressure": "140/90",
    "pulse": "85"
  }
}
```

#### **GET /api/health-records - Retrieve Records**
```typescript
// Returns user's health records from PostgreSQL
router.get('/', HealthRecordController.getRecords);
```

### **Analysis API (`/api/analysis`)**

#### **GET /api/analysis/:recordId - Get AI Analysis**
```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend API
    participant DB as PostgreSQL
    participant AI as AI RAG Service
    participant AS as AI Service
    
    F->>B: GET /api/analysis/123
    B->>DB: Fetch health record
    DB->>B: Return record data
    B->>AS: Call AIService.analyzeHealthRecord()
    AS->>AI: POST /api/v1/analyze
    AI->>AI: Vector search + AI analysis
    AI->>AS: Return structured analysis
    AS->>B: Return processed analysis
    B->>DB: Store analysis (optional)
    B->>F: Return analysis results
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "recordId": 123,
    "analysisDate": "2024-01-15T14:30:00Z",
    "symptomSeverity": "8",
    "symptomPattern": [
      "Onset: sudden",
      "Character: throbbing",
      "Duration: ongoing"
    ],
    "riskFactors": [
      "High severity symptoms",
      "Elevated blood pressure"
    ],
    "recommendations": [
      "Consider medical consultation for severe symptoms",
      "Monitor blood pressure regularly"
    ],
    "redFlags": [
      "Sudden onset severe headache"
    ]
  }
}
```

---

## 🔗 Integration Implementation

### **1. Environment Configuration**

#### **Backend .env**
```bash
# AI RAG Microservice Configuration
AI_SERVICE_URL=http://localhost:8000
AI_API_KEY=ai-rag-demo-key-2024

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/health_journal
```

#### **AI RAG .env.local**
```bash
# Matches backend API key
API_KEY=ai-rag-demo-key-2024
MONGO_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
HF_TOKEN=hf_...
```

### **2. Data Flow Integration**

#### **Health Record Creation Flow**
```typescript
// 1. Frontend submits health record
const createRecord = async (recordData) => {
  const response = await fetch('/api/health-records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recordData)
  });
  return response.json();
};

// 2. Backend processes and stores
export class HealthRecordController {
  static createRecord = async (req: Request, res: Response) => {
    const record = await HealthRecordService.createRecord(userId, recordData);
    
    // Optional: Send to AI RAG for future analysis
    // This could be done asynchronously
    
    res.status(201).json({ success: true, data: record });
  };
}
```

#### **AI Analysis Flow**
```typescript
// 1. Frontend requests analysis
const getAnalysis = async (recordId) => {
  const response = await fetch(`/api/analysis/${recordId}`);
  return response.json();
};

// 2. Backend orchestrates AI analysis
export class HealthRecordController {
  static getAnalysis = async (req: Request, res: Response) => {
    // Get record from PostgreSQL
    const record = await HealthRecordService.getRecordById(recordId, userId);
    
    // Get AI analysis from RAG service
    const analysis = await AnalysisService.analyzeHealthRecord(record);
    
    // Store analysis back to PostgreSQL
    await HealthRecordService.updateRecordAnalysis(recordId, analysis);
    
    res.json({ success: true, data: analysis });
  };
}
```

### **3. AI RAG Communication Protocol**

#### **Request Format to AI RAG**
```typescript
// Backend formats data for AI RAG
const aiRequest = {
  query: `Patient: ${symptoms}. Severity: ${severity}. Character: ${character}...`
};

// Sends to AI RAG endpoint
fetch('http://localhost:8000/api/v1/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'ai-rag-demo-key-2024'
  },
  body: JSON.stringify(aiRequest)
});
```

#### **Response Processing from AI RAG**
```typescript
// AI RAG returns structured medical analysis
const aiResponse = {
  analysis: `
    **SYMPTOM SUMMARY (OPQRST)**
    - Onset: sudden
    - Quality: throbbing
    - Severity: 8/10
    
    **DIFFERENTIAL DIAGNOSIS**
    - Most Likely: tension headache with hypertensive component
    
    **RECOMMENDATIONS**
    - Monitor blood pressure
    - Consider medical evaluation
  `,
  timestamp: 1642234567.89
};

// Backend parses and structures
const structuredAnalysis = {
  symptomPattern: extractSymptomPattern(aiResponse.analysis),
  recommendations: extractRecommendations(aiResponse.analysis),
  riskFactors: extractRiskFactors(aiResponse.analysis)
};
```

---

## 🛡️ Error Handling & Fallbacks

### **1. AI Service Unavailable**
```typescript
export class AIService {
  static async analyzeHealthRecord(healthRecord: HealthRecord): Promise<HealthAnalysis> {
    try {
      // Try AI RAG service
      const response = await fetch(`${this.AI_SERVICE_URL}/api/v1/analyze`, {
        // ... AI request
      });
      
      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }
      
      return this.parseAIResponse(await response.json());
      
    } catch (error) {
      console.error('AI service error:', error);
      // Fallback to local analysis
      return this.fallbackAnalysis(healthRecord);
    }
  }
}
```

### **2. Graceful Degradation**
```typescript
private static fallbackAnalysis(record: HealthRecord): HealthAnalysis {
  return {
    recordId: record.id,
    analysisDate: new Date().toISOString(),
    symptomSeverity: record.severity || 'Not specified',
    symptomPattern: this.basicSymptomAnalysis(record),
    riskFactors: this.basicRiskAssessment(record),
    recommendations: this.basicRecommendations(record),
    redFlags: this.basicRedFlags(record)
  };
}
```

### **3. Network Timeout Handling**
```typescript
const response = await fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data),
  signal: AbortSignal.timeout(30000) // 30 second timeout
});
```

---

## 🔄 Complete Request-Response Cycle

### **Scenario: User Creates Health Record and Gets Analysis**

#### **Step 1: Create Health Record**
```mermaid
sequenceDiagram
    participant U as User (Frontend)
    participant B as Backend API
    participant PG as PostgreSQL
    
    U->>B: POST /api/health-records
    Note over U,B: {"symptoms": "headache", "severity": 8}
    
    B->>B: Validate request
    B->>PG: INSERT health record
    PG->>B: Return record ID
    B->>U: {"success": true, "data": {...}}
```

#### **Step 2: Request AI Analysis**
```mermaid
sequenceDiagram
    participant U as User (Frontend)
    participant B as Backend API
    participant PG as PostgreSQL
    participant AI as AI RAG Service
    participant MG as MongoDB
    
    U->>B: GET /api/analysis/123
    B->>PG: SELECT record WHERE id=123
    PG->>B: Return health record
    
    B->>AI: POST /api/v1/analyze
    Note over B,AI: {"query": "Patient: headache. Severity: 8..."}
    
    AI->>MG: Vector similarity search
    MG->>AI: Return similar records
    AI->>AI: Generate medical analysis
    AI->>B: Return structured analysis
    
    B->>PG: UPDATE record SET analysis=...
    B->>U: {"success": true, "data": {...}}
```

#### **Step 3: Display Results**
```typescript
// Frontend receives and displays analysis
const analysis = await getAnalysis(recordId);

// Display structured medical insights
displaySymptomPattern(analysis.symptomPattern);
displayRecommendations(analysis.recommendations);
displayRiskFactors(analysis.riskFactors);
displayRedFlags(analysis.redFlags);
```

---

## 🚀 Deployment & Configuration

### **1. Development Setup**

#### **Start Backend**
```bash
cd health_journal_app/backend
npm install
npm run dev  # Starts on http://localhost:5000
```

#### **Start AI RAG Service**
```bash
cd ai_rag_microservice
python scripts/setup/start_service.py  # Starts on http://localhost:8000
```

#### **Environment Variables**
```bash
# Backend .env
AI_SERVICE_URL=http://localhost:8000
AI_API_KEY=ai-rag-demo-key-2024
DATABASE_URL=postgresql://localhost:5432/health_journal

# AI RAG .env.local
API_KEY=ai-rag-demo-key-2024
MONGO_URI=mongodb+srv://...
```

### **2. Production Deployment**

#### **Docker Compose Setup**
```yaml
version: '3.8'
services:
  backend:
    build: ./health_journal_app/backend
    ports:
      - "5000:5000"
    environment:
      - AI_SERVICE_URL=http://ai-rag:8000
      - AI_API_KEY=${AI_API_KEY}
    depends_on:
      - postgres
      - ai-rag

  ai-rag:
    build: ./ai_rag_microservice
    ports:
      - "8000:8000"
    environment:
      - API_KEY=${AI_API_KEY}
      - MONGO_URI=${MONGO_URI}

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=health_journal
```

### **3. API Integration Testing**

#### **Test Health Record Creation**
```bash
curl -X POST http://localhost:5000/api/health-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -d '{
    "symptoms": "severe headache",
    "severity": 8,
    "record_date": "2024-01-15"
  }'
```

#### **Test AI Analysis**
```bash
curl -X GET http://localhost:5000/api/analysis/123 \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

---

## 🎯 Key Integration Benefits

### **1. Separation of Concerns**
- **Backend**: User management, data persistence, API orchestration
- **AI RAG**: Vector storage, similarity search, AI analysis
- **Clean interfaces**: HTTP APIs for communication

### **2. Scalability**
- **Independent scaling**: Scale backend and AI service separately
- **Microservice architecture**: Each service optimized for its purpose
- **Load balancing**: Multiple instances of each service

### **3. Reliability**
- **Fallback mechanisms**: Backend works even if AI service fails
- **Error handling**: Graceful degradation at every level
- **Health checks**: Monitor service availability

### **4. Maintainability**
- **Clear boundaries**: Each service has specific responsibilities
- **Technology choice**: Best tool for each job (Node.js vs Python)
- **Independent deployment**: Update services independently

This architecture provides a robust, scalable foundation for AI-powered health analysis while maintaining system reliability and user experience.