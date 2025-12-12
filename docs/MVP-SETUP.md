# Health Journal MVP Setup Guide

## Overview
This MVP connects the AI RAG microservice with the health journal backend and web frontend to create a working health analysis system.

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Python 3.8+ installed
- Git installed

### 2. Install Dependencies

#### AI Microservice
```bash
cd ai_rag_microservice
pip install -r requirements.txt
```

#### Backend
```bash
cd health_journal_app/backend
npm install
```

#### Web Frontend
```bash
cd health_journal_app/web
npm install
```

### 3. Start MVP (Windows)
```bash
# From project root
start-mvp.bat
```

### 4. Manual Start (Cross-platform)

#### Terminal 1 - AI Service
```bash
cd ai_rag_microservice
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2 - Backend
```bash
cd health_journal_app/backend
npm run dev
```

#### Terminal 3 - Frontend
```bash
cd health_journal_app/web
npm run dev
```

## MVP Features

### ✅ Working Features
- User registration and login
- Health record creation
- AI-powered health analysis
- Symptom pattern recognition
- Risk factor assessment
- Clinical recommendations
- Responsive web interface

### 🔧 MVP Limitations
- Uses mock database (no persistence between restarts)
- Simplified AI analysis (fallback when external AI unavailable)
- Basic authentication (no password reset, etc.)
- No mobile app integration in this MVP

## API Endpoints

### AI Microservice (Port 8000)
- `GET /api/v1/health` - Health check
- `POST /api/v1/analyze-health` - Health record analysis
- `GET /docs` - API documentation

### Backend API (Port 3001)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/health-records` - Get user's health records
- `POST /api/health-records` - Create health record
- `GET /api/analysis/{recordId}` - Get AI analysis

### Web Frontend (Port 5173)
- `/` - Dashboard
- `/login` - Login page
- `/register` - Registration page
- `/records` - Health records page

## Testing the MVP

### 1. Register a User
1. Open http://localhost:5173
2. Click "Register"
3. Enter email and password
4. Click "Create Account"

### 2. Create Health Record
1. Go to "Records" page
2. Click "Add New Record"
3. Fill in symptoms, severity, etc.
4. Click "Save Record"

### 3. Get AI Analysis
1. Click "View Analysis" on a health record
2. See AI-generated insights including:
   - Symptom patterns
   - Risk factors
   - Recommendations
   - Red flags

## Architecture

```
Web Frontend (React/Vite) → Backend API (Node.js/Express) → AI Microservice (FastAPI/Python)
     ↓                           ↓                              ↓
Local Storage              Mock Database                 Fallback Storage
```

## Configuration

### Environment Variables
- AI service uses fallback storage if MongoDB unavailable
- Backend uses mock database if PostgreSQL unavailable
- All services have sensible defaults for MVP

### Security Notes
- Change default API keys in production
- Use proper database connections in production
- Implement proper authentication in production

## Troubleshooting

### Port Conflicts
- AI Service: 8000
- Backend: 3001  
- Frontend: 5173

If ports are in use, modify the configuration files.

### AI Service Issues
- The system includes fallback analysis if external AI services are unavailable
- Check console logs for detailed error messages

### Database Issues
- MVP uses mock databases by default
- No external database setup required for testing

## Next Steps for Production

1. **Database Setup**
   - Configure PostgreSQL for backend
   - Configure MongoDB for AI service

2. **AI Service Keys**
   - Get HuggingFace API token
   - Get Groq API key

3. **Security Hardening**
   - Change all default keys
   - Implement proper CORS
   - Add rate limiting
   - Add input validation

4. **Deployment**
   - Containerize services
   - Set up CI/CD pipeline
   - Configure monitoring

## Support

For issues or questions:
1. Check console logs in browser dev tools
2. Check terminal output for service errors
3. Verify all services are running on correct ports
4. Ensure environment files are properly configured