# Health Journal App - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

## Quick Setup

### 1. Database Setup
```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE health_journal;

-- Connect to the health_journal database and run the schema
\c health_journal;
\i backend/src/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Web App Setup
```bash
cd web
npm install
npm run dev
```

## Environment Variables (.env)
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=health_journal
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_very_secure_secret_key_here

# Server
PORT=3001
NODE_ENV=development
```

## Features Implemented

### Medical Assessment Frameworks
- **SOCRATES**: Site, Onset, Character, Radiation, Associations, Time course, Exacerbating factors, Severity
- **OLDCARTS**: Onset, Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity
- **PQRST**: Provocation, Quality, Region, Severity, Timing

### Core Features
- ✅ User authentication (register/login)
- ✅ Health record creation with medical frameworks
- ✅ Symptom tracking with severity scale (1-10)
- ✅ Vital signs recording
- ✅ Medication tracking
- ✅ Diet notes
- ✅ AI-powered health analysis
- ✅ Historical record viewing
- ✅ Responsive design

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/health-records` - Get user's health records
- `POST /api/health-records` - Create new health record
- `GET /api/health-records/:id` - Get specific health record
- `GET /api/analysis/:recordId` - Get AI analysis for record

## Usage

1. **Register/Login**: Create account or login
2. **Create Health Record**: Click "New Record" and fill out the comprehensive form
3. **View Records**: Browse your historical health records
4. **Get Analysis**: Click "AI Analysis" on any record for insights
5. **Track Patterns**: Use the data to identify health trends

## Medical Framework Integration

The app follows established medical assessment protocols:

- **Symptom Documentation**: Uses SOCRATES framework for comprehensive symptom recording
- **Pain Assessment**: Incorporates PQRST methodology for pain evaluation
- **Clinical History**: Follows OLDCARTS structure for complete medical history

## Next Steps for Enhancement

1. **Data Visualization**: Add charts for symptom trends
2. **Export Features**: PDF reports for healthcare providers
3. **Medication Reminders**: Alert system for medication schedules
4. **Integration**: Connect with wearable devices
5. **Advanced AI**: More sophisticated health pattern analysis

## Security Notes

- All health data is encrypted and stored securely
- JWT tokens for secure authentication
- Input validation and sanitization
- HIPAA-compliant data handling practices (when deployed)

## Support

For issues or questions, refer to the documentation in each component's README file.