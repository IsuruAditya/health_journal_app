# Health Journal Backend - MVP

## 🎯 Minimal Viable Product

Industry-standard Node.js/Express + TypeScript backend with:
- **Neon PostgreSQL** cloud database
- **AI Microservice** integration ready
- **Medical frameworks** (SOCRATES, OLDCARTS, PQRST)
- **JWT Authentication**
- **Clean Architecture**

## 📁 Structure
```
src/
├── config/          # Database (Neon PostgreSQL)
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, errors
├── models/          # Data access layer
├── routes/          # API endpoints
├── services/        # Business logic + AI integration
└── types/           # TypeScript definitions
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Set up PostgreSQL database:
```sql
CREATE DATABASE health_journal;
\c health_journal;
\i src/schema.sql
```

4. Development:
```bash
npm run dev          # Start with hot reload
npm run dev:watch    # Start with file watching
```

5. Production:
```bash
npm run build        # Compile TypeScript
npm start            # Run compiled JavaScript
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Health Records
- GET `/api/health-records` - Get user's health records
- POST `/api/health-records` - Create new health record
- GET `/api/health-records/:id` - Get specific health record

### AI Analysis
- GET `/api/analysis/:recordId` - Get AI analysis for health record

### Health Check
- GET `/api/health` - API health status

## Features

- ✅ TypeScript with strict type checking
- ✅ Industry-standard folder structure
- ✅ JWT authentication with middleware
- ✅ Request validation with Joi
- ✅ Error handling middleware
- ✅ Rate limiting and security headers
- ✅ Database connection pooling
- ✅ Graceful shutdown handling
- ✅ Path mapping for clean imports
- ✅ Medical assessment frameworks (SOCRATES, OLDCARTS, PQRST)