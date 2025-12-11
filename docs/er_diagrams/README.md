# System Diagrams for Salubro Health AI System

This directory contains Entity-Relationship diagrams and Context diagrams for the complete Salubro health AI system, covering both the health journal application and the RAG microservice.

## Entity-Relationship Diagrams

### 1. Main Database ER (`main_database_er.mmd`)
**PostgreSQL Database Schema**
- Core entities: Users, Health Records, Vital Signs, AI Analysis
- Relationships between user accounts and health data
- JSONB fields for flexible data storage
- Indexing strategy for performance

### 2. MongoDB RAG ER (`mongodb_rag_er.mmd`)
**RAG Microservice Data Model**
- Vector embeddings collections
- Generic and health-specific record structures
- Vector search indexes
- Query and response tracking

### 3. Integrated System ER (`integrated_system_er.mmd`)
**Complete System Architecture**
- PostgreSQL ↔ MongoDB synchronization
- API integration layer
- Analysis result caching
- Multi-tenant support structure

### 4. SOCRATES Framework ER (`socrates_framework_er.mmd`)
**Clinical Assessment Structure**
- SOCRATES symptom assessment framework
- PQRST clinical methodology
- OLDCARTS medical history taking
- Clinical assessment workflow

## Context Diagrams (C4 Model)

### 5. System Context (`system_context_diagram.mmd`)
**High-Level System Overview**
- External actors (Users, Healthcare Providers)
- System boundaries and external dependencies
- Key integrations with third-party services

### 6. Container Context (`container_context_diagram.mmd`)
**Application Architecture**
- Frontend applications (Web, Mobile)
- Backend services (API, RAG Service)
- Data storage layers
- External service dependencies

### 7. RAG Component (`rag_component_diagram.mmd`)
**RAG Microservice Internal Architecture**
- API routing and endpoints
- Core services and business logic
- Data access and vector operations
- Security and monitoring components

### 8. Data Flow Context (`data_flow_context.mmd`)
**System Data Movement**
- User interaction flows
- API communication patterns
- Data synchronization processes
- External service integrations

### 9. Deployment Context (`deployment_context.mmd`)
**Infrastructure and Runtime**
- Cloud deployment architecture
- Container orchestration
- Database services
- External API dependencies

## Use Case Diagrams

### 10. Use Case Overview (`use_case_diagram.mmd`)
**System Use Cases**
- Primary actors (Patient, Healthcare Provider)
- Core functionality use cases
- System interactions and relationships

### 11. Detailed Use Cases (`detailed_use_cases.mmd`)
**Comprehensive Use Case View**
- Detailed use case descriptions
- Actor relationships and dependencies
- Include/extend relationships
- Multi-platform access patterns

### 12. Use Case Specifications (`use_case_specifications.md`)
**Complete Use Case Documentation**
- Detailed use case flows
- Preconditions and postconditions
- System quality attributes
- Performance and security requirements

## Key Relationships

### Primary Data Flow
```
User → Health Record → RAG Sync → Vector Embeddings → AI Analysis → Cached Results
```

### Clinical Framework Integration
```
Symptoms → SOCRATES Assessment → Structured Data → Vector Search → Clinical Insights
```

## Technical Implementation

### PostgreSQL Schema
- **Users**: Authentication and user management
- **Health Records**: Core medical data with SOCRATES framework
- **Indexes**: Optimized for date-based queries and user filtering

### MongoDB Collections
- **health_records**: Vectorized health data for RAG
- **generic_records**: Flexible document storage
- **Vector Indexes**: Atlas Search for similarity matching

### Synchronization Strategy
- Real-time sync between PostgreSQL and MongoDB
- Error handling and retry mechanisms
- Data consistency validation

## Usage Notes

1. **SOCRATES Framework**: Structured symptom assessment (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating factors, Severity)

2. **Vector Embeddings**: 384-dimensional vectors using sentence-transformers/all-MiniLM-L6-v2

3. **Multi-tenancy**: Supported through tenant_id fields in MongoDB collections

4. **Caching**: AI analysis results cached with TTL for performance

## Viewing Diagrams

These Mermaid diagrams can be viewed in:
- GitHub (native Mermaid support)
- VS Code with Mermaid extension
- Mermaid Live Editor (https://mermaid.live)
- Documentation platforms supporting Mermaid

## Data Privacy & Security

- All PII is sanitized before storage
- Password hashing with bcrypt
- JWT-based authentication
- HIPAA-compliant data handling considerations