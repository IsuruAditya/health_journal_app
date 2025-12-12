# AI Analysis Storage & Retrieval System

## Overview
The system now properly stores and retrieves AI health analyses, eliminating the need to regenerate analysis every time you view a record.

## How It Works

### 1. Analysis Generation & Storage
```
User clicks "AI Analysis" 
  ↓
Backend fetches record + last 10 records (history)
  ↓
AI microservice analyzes with full context
  ↓
Backend auto-saves analysis to PostgreSQL (ai_analysis JSONB field)
  ↓
Frontend displays analysis
```

### 2. Analysis Retrieval (NEW!)
```
User views record details
  ↓
Frontend fetches record from database
  ↓
If ai_analysis exists → Display saved analysis automatically ✅
  ↓
User can click "Regenerate Analysis" to get fresh analysis
```

## Database Schema

### health_records table
```sql
CREATE TABLE health_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    -- ... other fields ...
    ai_analysis JSONB,  -- Stores complete AI analysis
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### ai_analysis JSONB structure
```json
{
  "assessment": "Overall health assessment...",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "symptomPattern": ["Pattern 1", "Pattern 2"],
  "riskFactors": ["Risk 1", "Risk 2"],
  "redFlags": ["Warning 1", "Warning 2"],
  "fullAnalysis": "Complete AI response text...",
  "differentialDiagnosis": "Possible conditions...",
  "trends": {
    "severityTrend": "increasing/stable/decreasing",
    "frequencyTrend": "more frequent/stable/less frequent"
  }
}
```

## Frontend Changes

### RecordDetailPage.tsx
**Before:**
- Fetched record without analysis
- User had to click "AI Analysis" every time
- Analysis lost when navigating away

**After:**
- Fetches record WITH saved analysis
- Displays saved analysis automatically
- Button changes to "Regenerate Analysis" if analysis exists
- Analysis persists across navigation

### HealthRecordCard.tsx
**New Features:**
- Shows green "✓ Analyzed" badge if record has saved analysis
- Button text changes: "AI Analysis" → "Re-analyze"
- Visual indicator helps users know which records have been analyzed

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER CREATES RECORD                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL (Neon Database)                      │
│  health_records: { id, symptoms, severity, ai_analysis }    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              USER CLICKS "AI ANALYSIS"                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         Backend fetches record + last 10 records             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│    AI Microservice (Groq Llama 3.3 70B + RAG + MongoDB)    │
│    - Analyzes with historical context                       │
│    - Identifies patterns and trends                         │
│    - Generates recommendations                              │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│    Backend saves analysis to PostgreSQL (ai_analysis)       │
│    UPDATE health_records SET ai_analysis = $1 WHERE id = $2 │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Frontend displays analysis                      │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         USER NAVIGATES AWAY AND RETURNS                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│    Frontend fetches record (includes ai_analysis)           │
│    Automatically displays saved analysis ✅                  │
└─────────────────────────────────────────────────────────────┘
```

## MongoDB Storage (Separate)

The AI microservice ALSO stores records in MongoDB for RAG (Retrieval-Augmented Generation):

```
MongoDB Collection: health_records
{
  "user_id": "123",
  "record_id": "456",
  "text": "Patient symptoms: headache, fever...",
  "embedding": [0.123, -0.456, 0.789, ...],  // 1024-dim vector
  "metadata": {
    "timestamp": "2025-12-12T16:04:52Z",
    "severity": 7
  }
}
```

**Purpose:** Vector similarity search to find similar past symptoms when analyzing new records.

## Key Benefits

1. **Performance:** No need to regenerate analysis every time (saves 3-8 seconds)
2. **Consistency:** Same analysis shown every time you view a record
3. **Cost Savings:** Reduces API calls to Groq/OpenRouter
4. **User Experience:** Instant analysis display on record view
5. **Historical Tracking:** Can see how AI analysis changes over time if regenerated

## API Endpoints

### Get Record (with analysis)
```
GET /api/health-records/:id
Response: {
  id: 1,
  symptoms: "headache",
  severity: 7,
  ai_analysis: { ... },  // ← Saved analysis included
  ...
}
```

### Generate/Regenerate Analysis
```
POST /api/health-records/:recordId/analysis
Response: {
  assessment: "...",
  recommendations: [...],
  ...
}
// Automatically saves to database
```

## Testing

### Verify Analysis Storage
1. Create a health record
2. Click "AI Analysis" button
3. Wait for analysis to complete
4. Navigate away from the page
5. Return to the record detail page
6. **Expected:** Analysis should display automatically without clicking button

### Verify Analysis Update
1. View a record with saved analysis
2. Click "Regenerate Analysis"
3. Wait for new analysis
4. **Expected:** New analysis replaces old one in database and UI

## Troubleshooting

### Analysis not showing after navigation
**Check:**
- Database has `ai_analysis` field (JSONB type)
- Backend returns `ai_analysis` in GET /api/health-records/:id response
- Frontend properly parses `ai_analysis` from response

### Analysis not saving
**Check:**
- `updateRecordAnalysis()` is called after AI analysis completes
- Database UPDATE query succeeds
- No errors in backend logs

## Future Enhancements

1. **Analysis History:** Track multiple versions of analysis over time
2. **Analysis Comparison:** Compare how analysis changes as symptoms evolve
3. **Batch Analysis:** Analyze multiple records at once
4. **Analysis Export:** Export analysis as PDF/CSV
5. **Analysis Sharing:** Share analysis with healthcare providers
