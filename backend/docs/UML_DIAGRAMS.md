# 🏗️ UML Diagrams - AI RAG Microservice & Backend

## 📋 Table of Contents
- [AI RAG Microservice UML Diagrams](#-ai-rag-microservice-uml-diagrams)
- [Backend UML Diagrams](#-backend-uml-diagrams)
- [Integration UML Diagrams](#-integration-uml-diagrams)
- [Deployment Diagrams](#-deployment-diagrams)

---

## 🤖 AI RAG Microservice UML Diagrams

### **1. Class Diagram - AI RAG Microservice**

```mermaid
classDiagram
    %% Core Application
    class FastAPIApp {
        +title: str
        +version: str
        +lifespan: AsyncContextManager
        +add_middleware()
        +include_router()
    }

    %% API Layer
    class HealthRouter {
        +add_record(record: HealthRecord)
        +analyze(query: AnalysisQuery)
    }

    class GenericRouter {
        +generic_analyze(query: GenericQuery)
    }

    class HealthCheckRouter {
        +health_check()
    }

    %% Models
    class HealthRecord {
        +date: str
        +symptoms: Dict[str, str]
        +lifestyle: Dict[str, str]
        +biometrics: Dict[str, Any]
        +metadata: Dict[str, str]
        +reports: Optional[str]
        +validate_date()
        +validate_symptoms()
    }

    class AnalysisQuery {
        +query: str
        +location: Optional[str]
        +validate_query()
    }

    class AnalysisResponse {
        +analysis: str
        +timestamp: Optional[float]
        +confidence: Optional[float]
    }

    %% Services
    class RAGService {
        +add_record(record: HealthRecord): Dict
        +analyze(query: AnalysisQuery): str
        -_extract_symptoms_from_query(query: str): List[str]
        -_format_record_content(record: HealthRecord): str
    }

    class DualLLMService {
        +hf_token: str
        +groq_client: Groq
        +primary_model: str
        +fallback_model: str
        +generate_response(prompt: str, max_tokens: int): str
        -_call_groq_primary(prompt: str, max_tokens: int): str
        -_call_huggingface(prompt: str, max_tokens: int): str
        -_try_alternative_model(prompt: str, max_tokens: int): str
        +get_model_info(): Dict
    }

    class MedicalGuidelinesRetriever {
        +guidelines_db: Dict
        +retrieve_guidelines(symptoms: List[str], query: str): List[Document]
        -_extract_medical_terms(text: str): List[str]
        -_initialize_guidelines(): Dict
    }

    %% Core Components
    class ContextManager {
        +encoding: tiktoken.Encoding
        +max_context_tokens: int
        +assemble_context(patient_results, guidelines_results, system_prompt, query): Tuple
        +count_tokens(text: str): int
        -_build_context_section(results, token_budget, section_name): Tuple
    }

    class TokenChunker {
        +chunk_size: int
        +overlap: int
        +encoding: tiktoken.Encoding
        +chunk_text(text: str, metadata: Dict): List[Dict]
    }

    class PluginManager {
        +processors: Dict
        +get_data_processor(): DataProcessor
        +register_processor(name: str, processor: DataProcessor)
    }

    %% Database Layer
    class DatabaseManager {
        -_client: Optional[MongoClient]
        -_embeddings: Optional[HuggingFaceEmbeddings]
        -_vector_store: Optional[MongoDBAtlasVectorSearch]
        +client: MongoClient
        +embeddings: HuggingFaceEmbeddings
        +vector_store: MongoDBAtlasVectorSearch
        +close()
    }

    class StorageFactory {
        +create_vector_store(): VectorStore
    }

    class MongoVectorStore {
        +mongo_store: MongoDBAtlasVectorSearch
        +add_documents(docs: List[Document])
        +similarity_search(query: str, k: int): List[Document]
    }

    class InMemoryVectorStore {
        +documents: List[Dict]
        +add_documents(docs: List[Document])
        +similarity_search(query: str, k: int): List[Document]
    }

    %% Security & Configuration
    class Settings {
        +mongo_uri: str
        +hf_token: str
        +groq_api_key: str
        +api_key: str
        +log_level: str
        +environment: str
        +primary_model: str
        +fallback_model: str
    }

    class SecurityService {
        +verify_api_key(api_key: str): bool
    }

    %% Relationships
    FastAPIApp --> HealthRouter
    FastAPIApp --> GenericRouter
    FastAPIApp --> HealthCheckRouter

    HealthRouter --> RAGService
    HealthRouter --> HealthRecord
    HealthRouter --> AnalysisQuery
    HealthRouter --> AnalysisResponse

    RAGService --> DualLLMService
    RAGService --> MedicalGuidelinesRetriever
    RAGService --> ContextManager
    RAGService --> DatabaseManager

    DualLLMService --> Settings
    ContextManager --> TokenChunker
    RAGService --> PluginManager

    DatabaseManager --> StorageFactory
    StorageFactory --> MongoVectorStore
    StorageFactory --> InMemoryVectorStore

    HealthRouter --> SecurityService
    SecurityService --> Settings
```

### **2. Sequence Diagram - RAG Analysis Flow**

```mermaid
sequenceDiagram
    participant Client as Client
    participant API as FastAPI Router
    participant Security as Security Service
    participant RAG as RAG Service
    participant Context as Context Manager
    participant Vector as Vector Store
    participant Guidelines as Medical Guidelines
    participant LLM as Dual LLM Service
    participant Groq as Groq API

    Client->>API: POST /api/v1/analyze
    API->>Security: verify_api_key()
    Security-->>API: ✓ Valid

    API->>RAG: analyze(query)
    
    RAG->>Vector: similarity_search(query, k=10)
    Vector-->>RAG: similar_records[]
    
    RAG->>Guidelines: retrieve_guidelines(symptoms, query)
    Guidelines-->>RAG: medical_guidelines[]
    
    RAG->>Context: assemble_context(records, guidelines, prompt, query)
    Context-->>RAG: assembled_context, stats
    
    RAG->>LLM: generate_response(full_prompt, max_tokens=800)
    LLM->>Groq: chat.completions.create()
    Groq-->>LLM: ai_response
    LLM-->>RAG: structured_analysis
    
    RAG-->>API: analysis_result
    API-->>Client: AnalysisResponse
```

### **3. Component Diagram - AI RAG Architecture**

```mermaid
graph TB
    subgraph "API Layer"
        A[FastAPI Application]
        B[Health Router]
        C[Generic Router]
        D[Health Check Router]
    end

    subgraph "Security Layer"
        E[API Key Validation]
        F[Request Logging]
        G[CORS Middleware]
    end

    subgraph "Service Layer"
        H[RAG Service]
        I[Dual LLM Service]
        J[Medical Guidelines]
    end

    subgraph "Core Components"
        K[Context Manager]
        L[Token Chunker]
        M[Plugin Manager]
        N[Deduplication]
    end

    subgraph "Database Layer"
        O[Database Manager]
        P[Storage Factory]
        Q[Mongo Vector Store]
        R[Fallback Store]
    end

    subgraph "External Services"
        S[MongoDB Atlas]
        T[Groq API]
        U[HuggingFace API]
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G

    B --> H
    H --> I
    H --> J
    H --> K
    K --> L
    H --> M

    H --> O
    O --> P
    P --> Q
    P --> R

    Q --> S
    I --> T
    I --> U

    style H fill:#e1f5fe
    style I fill:#fff3e0
    style O fill:#e8f5e8
```

---

## 🏥 Backend UML Diagrams

### **1. Class Diagram - Backend System**

```mermaid
classDiagram
    %% Express Application
    class ExpressApp {
        +app: Express
        +cors: CorsOptions
        +routes: Router
        +errorHandler: ErrorHandler
        +notFoundHandler: NotFoundHandler
    }

    %% Controllers
    class AuthController {
        +login(req: Request, res: Response): Promise~void~
        +register(req: Request, res: Response): Promise~void~
        +refreshToken(req: Request, res: Response): Promise~void~
    }

    class HealthRecordController {
        +createRecord(req: Request, res: Response): Promise~void~
        +getRecords(req: Request, res: Response): Promise~void~
        +getRecord(req: Request, res: Response): Promise~void~
        +getAnalysis(req: Request, res: Response): Promise~void~
    }

    %% Services
    class AuthService {
        +login(email: string, password: string): Promise~AuthResult~
        +register(userData: RegisterDto): Promise~User~
        +generateTokens(user: User): TokenPair
        +verifyToken(token: string): AuthTokenPayload
    }

    class HealthRecordService {
        +createRecord(userId: number, recordData: CreateHealthRecordDto): Promise~HealthRecord~
        +getUserRecords(userId: number, limit?: number): Promise~HealthRecord[]~
        +getRecordById(recordId: number, userId: number): Promise~HealthRecord~
        +updateRecordAnalysis(recordId: number, analysis: any): Promise~void~
    }

    class AIService {
        -AI_SERVICE_URL: string
        +analyzeHealthRecord(healthRecord: HealthRecord): Promise~HealthAnalysis~
        -fallbackAnalysis(record: HealthRecord): HealthAnalysis
        -extractFromAnalysis(analysis: string, keyword: string, record: HealthRecord): string[]
        -fallbackSymptomPattern(record: HealthRecord): string[]
        -fallbackRiskFactors(record: HealthRecord): string[]
        -fallbackRecommendations(record: HealthRecord): string[]
    }

    class AnalysisService {
        +analyzeHealthRecord(healthRecord: HealthRecord): Promise~HealthAnalysis~
    }

    %% Models
    class UserModel {
        +findByEmail(email: string): Promise~User | null~
        +create(userData: RegisterDto): Promise~User~
        +findById(id: number): Promise~User | null~
    }

    class HealthRecordModel {
        +create(userId: number, recordData: CreateHealthRecordDto): Promise~HealthRecord~
        +findByUserId(userId: number, limit?: number): Promise~HealthRecord[]~
        +findById(recordId: number, userId: number): Promise~HealthRecord | null~
        +updateAnalysis(recordId: number, analysis: any): Promise~void~
    }

    %% Types/Interfaces
    class User {
        +id: number
        +email: string
        +password: string
        +created_at: Date
    }

    class HealthRecord {
        +id: number
        +user_id: number
        +record_date: string
        +record_time: string
        +site?: string
        +onset?: string
        +character?: string
        +severity?: number
        +symptoms?: string
        +medications?: string
        +vital_signs?: VitalSigns
        +ai_analysis?: any
        +created_at: Date
        +updated_at: Date
    }

    class VitalSigns {
        +blood_pressure?: string
        +temperature?: string
        +pulse?: string
        +weight?: string
    }

    class HealthAnalysis {
        +recordId: number
        +analysisDate: string
        +symptomSeverity: string | number
        +symptomPattern: string[]
        +riskFactors: string[]
        +recommendations: string[]
        +trends: TrendData
        +redFlags: string[]
    }

    class CreateHealthRecordDto {
        +record_date: string
        +record_time: string
        +symptoms?: string
        +severity?: number
        +medications?: string
        +vital_signs?: VitalSigns
    }

    %% Middleware
    class AuthMiddleware {
        +authMiddleware(req: Request, res: Response, next: NextFunction): void
        +verifyToken(token: string): AuthTokenPayload
    }

    class ValidationMiddleware {
        +validateRequest(schema: Joi.Schema): RequestHandler
        +healthRecordSchema: Joi.Schema
    }

    class ErrorHandler {
        +errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void
        +notFoundHandler(req: Request, res: Response): void
        +asyncHandler(fn: Function): RequestHandler
    }

    %% Database
    class DatabaseConfig {
        +pool: Pool
        +query(text: string, params?: any[]): Promise~QueryResult~
        +getClient(): Promise~PoolClient~
    }

    %% Relationships
    ExpressApp --> AuthController
    ExpressApp --> HealthRecordController
    ExpressApp --> AuthMiddleware
    ExpressApp --> ValidationMiddleware
    ExpressApp --> ErrorHandler

    AuthController --> AuthService
    HealthRecordController --> HealthRecordService
    HealthRecordController --> AnalysisService

    AnalysisService --> AIService
    AuthService --> UserModel
    HealthRecordService --> HealthRecordModel

    UserModel --> DatabaseConfig
    HealthRecordModel --> DatabaseConfig

    HealthRecord --> VitalSigns
    AIService --> HealthAnalysis
    HealthRecordController --> CreateHealthRecordDto

    AuthMiddleware --> AuthService
    ValidationMiddleware --> CreateHealthRecordDto
```

### **2. Sequence Diagram - Health Record Creation & Analysis**

```mermaid
sequenceDiagram
    participant Client as Frontend Client
    participant Auth as Auth Middleware
    participant Controller as HealthRecord Controller
    participant Service as HealthRecord Service
    participant Model as HealthRecord Model
    participant DB as PostgreSQL
    participant Analysis as Analysis Service
    participant AI as AI Service
    participant RAG as AI RAG Microservice

    %% Health Record Creation
    Client->>Controller: POST /api/health-records
    Controller->>Auth: Verify JWT token
    Auth-->>Controller: ✓ User authenticated

    Controller->>Service: createRecord(userId, recordData)
    Service->>Service: Validate severity (1-10)
    Service->>Model: create(userId, recordData)
    Model->>DB: INSERT INTO health_records
    DB-->>Model: Return record with ID
    Model-->>Service: HealthRecord object
    Service-->>Controller: Created record
    Controller-->>Client: 201 Created

    %% Analysis Request
    Client->>Controller: GET /api/analysis/123
    Controller->>Auth: Verify JWT token
    Auth-->>Controller: ✓ User authenticated

    Controller->>Service: getRecordById(123, userId)
    Service->>Model: findById(123, userId)
    Model->>DB: SELECT * FROM health_records WHERE id=123
    DB-->>Model: Record data
    Model-->>Service: HealthRecord object

    Controller->>Analysis: analyzeHealthRecord(record)
    Analysis->>AI: analyzeHealthRecord(record)
    
    AI->>RAG: POST /api/v1/analyze
    Note over AI,RAG: {"query": "Patient symptoms..."}
    RAG-->>AI: {"analysis": "Medical analysis..."}
    
    AI->>AI: parseAIAnalysis(response)
    AI-->>Analysis: HealthAnalysis object
    Analysis-->>Controller: Analysis result

    Controller->>Service: updateRecordAnalysis(123, analysis)
    Service->>Model: updateAnalysis(123, analysis)
    Model->>DB: UPDATE health_records SET ai_analysis=...
    
    Controller-->>Client: 200 OK with analysis
```

### **3. Component Diagram - Backend Architecture**

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Frontend]
        B[Mobile App]
    end

    subgraph "API Gateway Layer"
        C[Express.js Server]
        D[CORS Middleware]
        E[Body Parser]
    end

    subgraph "Authentication Layer"
        F[JWT Middleware]
        G[Auth Controller]
        H[Auth Service]
    end

    subgraph "Business Logic Layer"
        I[Health Record Controller]
        J[Health Record Service]
        K[Analysis Service]
        L[AI Service]
    end

    subgraph "Validation Layer"
        M[Request Validation]
        N[Schema Validation]
        O[Error Handler]
    end

    subgraph "Data Access Layer"
        P[User Model]
        Q[Health Record Model]
        R[Database Config]
    end

    subgraph "External Services"
        S[PostgreSQL Database]
        T[AI RAG Microservice]
    end

    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    F --> G
    G --> H

    C --> I
    I --> J
    I --> K
    K --> L

    C --> M
    M --> N
    C --> O

    J --> Q
    H --> P
    P --> R
    Q --> R
    R --> S

    L --> T

    style L fill:#e1f5fe
    style T fill:#fff3e0
    style S fill:#e8f5e8
```

---

## 🔗 Integration UML Diagrams

### **1. System Integration Overview**

```mermaid
graph TB
    subgraph "Frontend Tier"
        A[React Web App]
        B[React Native Mobile]
    end

    subgraph "Backend Tier"
        C[Node.js Express API]
        D[Authentication Service]
        E[Health Record Service]
        F[AI Integration Service]
    end

    subgraph "AI Tier"
        G[AI RAG Microservice]
        H[Vector Search Engine]
        I[Medical Guidelines DB]
        J[Dual LLM Service]
    end

    subgraph "Data Tier"
        K[PostgreSQL]
        L[MongoDB Atlas]
        M[Redis Cache]
    end

    subgraph "External APIs"
        N[Groq API]
        O[HuggingFace API]
    end

    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    F --> G

    G --> H
    G --> I
    G --> J
    J --> N
    J --> O

    E --> K
    G --> L
    C --> M

    style F fill:#e1f5fe
    style G fill:#fff3e0
    style J fill:#f3e5f5
```

### **2. Data Flow Integration Diagram**

```mermaid
sequenceDiagram
    participant Frontend as Frontend App
    participant Backend as Backend API
    participant Auth as Auth Service
    participant HealthSvc as Health Service
    participant AISvc as AI Service
    participant RAG as AI RAG Service
    participant PostgreSQL as PostgreSQL
    participant MongoDB as MongoDB

    %% User Registration/Login
    Frontend->>Backend: POST /api/auth/login
    Backend->>Auth: authenticate(credentials)
    Auth->>PostgreSQL: SELECT user WHERE email=...
    PostgreSQL-->>Auth: User data
    Auth-->>Backend: JWT token
    Backend-->>Frontend: Authentication response

    %% Health Record Creation
    Frontend->>Backend: POST /api/health-records (with JWT)
    Backend->>HealthSvc: createRecord(userId, data)
    HealthSvc->>PostgreSQL: INSERT health record
    PostgreSQL-->>HealthSvc: Record created
    HealthSvc-->>Backend: Success response
    Backend-->>Frontend: Record created

    %% AI Analysis Request
    Frontend->>Backend: GET /api/analysis/recordId
    Backend->>HealthSvc: getRecordById(recordId)
    HealthSvc->>PostgreSQL: SELECT record
    PostgreSQL-->>HealthSvc: Record data
    
    Backend->>AISvc: analyzeHealthRecord(record)
    AISvc->>RAG: POST /api/v1/analyze
    RAG->>MongoDB: Vector similarity search
    MongoDB-->>RAG: Similar records
    RAG->>RAG: Generate AI analysis
    RAG-->>AISvc: Analysis result
    AISvc-->>Backend: Processed analysis
    
    Backend->>HealthSvc: updateRecordAnalysis(recordId, analysis)
    HealthSvc->>PostgreSQL: UPDATE record analysis
    Backend-->>Frontend: Analysis response
```

---

## 🚀 Deployment Diagrams

### **1. Development Environment**

```mermaid
graph TB
    subgraph "Developer Machine"
        A[Frontend Dev Server<br/>localhost:3000]
        B[Backend Dev Server<br/>localhost:5000]
        C[AI RAG Service<br/>localhost:8000]
    end

    subgraph "Local Databases"
        D[PostgreSQL<br/>localhost:5432]
        E[MongoDB Local<br/>localhost:27017]
    end

    subgraph "External Services"
        F[Groq API]
        G[HuggingFace API]
        H[MongoDB Atlas]
    end

    A --> B
    B --> C
    B --> D
    C --> E
    C --> H
    C --> F
    C --> G

    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fff3e0
```

### **2. Production Deployment**

```mermaid
graph TB
    subgraph "Load Balancer"
        A[Nginx/CloudFlare]
    end

    subgraph "Frontend Tier"
        B[React App<br/>CDN/Vercel]
    end

    subgraph "Backend Tier"
        C[Backend API<br/>Docker Container]
        D[Backend API<br/>Docker Container]
    end

    subgraph "AI Tier"
        E[AI RAG Service<br/>Docker Container]
        F[AI RAG Service<br/>Docker Container]
    end

    subgraph "Database Tier"
        G[PostgreSQL<br/>Managed Service]
        H[MongoDB Atlas<br/>Cloud Service]
        I[Redis Cache<br/>Managed Service]
    end

    subgraph "External APIs"
        J[Groq API]
        K[HuggingFace API]
    end

    A --> B
    A --> C
    A --> D
    C --> E
    D --> F

    C --> G
    D --> G
    C --> I
    D --> I

    E --> H
    F --> H
    E --> J
    E --> K
    F --> J
    F --> K

    style A fill:#ffebee
    style B fill:#e8f5e8
    style C fill:#f3e5f5
    style D fill:#f3e5f5
    style E fill:#fff3e0
    style F fill:#fff3e0
```

### **3. Container Architecture**

```mermaid
graph TB
    subgraph "Docker Compose Environment"
        subgraph "Frontend Container"
            A[React App<br/>nginx:alpine]
        end

        subgraph "Backend Container"
            B[Node.js API<br/>node:18-alpine]
        end

        subgraph "AI RAG Container"
            C[Python FastAPI<br/>python:3.11-slim]
        end

        subgraph "Database Containers"
            D[PostgreSQL<br/>postgres:15]
            E[Redis<br/>redis:alpine]
        end
    end

    subgraph "External Services"
        F[MongoDB Atlas]
        G[Groq API]
        H[HuggingFace API]
    end

    A --> B
    B --> C
    B --> D
    B --> E
    C --> F
    C --> G
    C --> H

    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#ffebee
```

---

## 🎯 Key UML Insights

### **AI RAG Microservice:**
- **Layered Architecture**: Clear separation between API, Service, and Data layers
- **Plugin System**: Extensible design with plugin manager
- **Fallback Mechanisms**: Multiple fallback strategies for reliability
- **Vector Processing**: Sophisticated chunking and embedding pipeline

### **Backend System:**
- **MVC Pattern**: Controllers, Services, and Models clearly separated
- **Middleware Pipeline**: Authentication, validation, and error handling
- **Service Integration**: Clean integration with AI RAG microservice
- **Database Abstraction**: Proper data access layer

### **Integration Architecture:**
- **Microservice Communication**: HTTP-based API communication
- **Data Consistency**: Separate databases with eventual consistency
- **Scalability**: Independent scaling of services
- **Fault Tolerance**: Graceful degradation and fallback mechanisms

These UML diagrams provide a comprehensive view of both systems' architecture, their interactions, and deployment strategies.