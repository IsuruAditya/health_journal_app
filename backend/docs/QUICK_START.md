# Health Journal Backend - Quick Start

## 🚀 MVP Setup Options

### Option A: Quick Test (No Database)
```bash
npm install
npm run dev  # Uses mock database
```

### Option B: Neon PostgreSQL (Recommended)
1. Go to [Neon Console](https://console.neon.tech)
2. Create project: "health-journal"
3. Copy connection string
4. Run SQL from `scripts/setup-neon.sql`
5. Update `.env`:
```env
DATABASE_URL=your_neon_connection_string
```
6. `npm run dev`

### Option C: Local PostgreSQL
1. Install PostgreSQL locally
2. Create database: `CREATE DATABASE health_journal;`
3. Run `scripts/setup-neon.sql`
4. Update `.env` with local DB settings
5. `npm run dev`

### Test API
```bash
curl http://localhost:3001/api/health
```

## 🔗 AI Microservice Integration

Your AI service at `/d/Projecto/Salubro/ai_rag_microservice` will be called via:
- Endpoint: `POST /analyze-health`
- Expected response format:
```json
{
  "symptom_patterns": ["..."],
  "risk_factors": ["..."],
  "recommendations": ["..."],
  "red_flags": ["..."],
  "trends": {...}
}
```

## 📋 MVP Features Ready
- ✅ User authentication (JWT)
- ✅ Health record CRUD
- ✅ SOCRATES/OLDCARTS/PQRST framework
- ✅ AI service integration
- ✅ Neon PostgreSQL support
- ✅ TypeScript with industry structure

## 🔧 Environment Variables
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/health_journal?sslmode=require
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_secret_key
PORT=3001
```

Ready for production deployment! 🎉