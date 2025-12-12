# System Testing Checklist

## Prerequisites
- [ ] AI RAG Microservice running on http://localhost:8000
- [ ] Backend API running on http://localhost:3001
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB connected (for AI service)
- [ ] PostgreSQL/Neon connected (for backend)

## Automated Tests

### Run Full System Test
```bash
python test_full_system.py
```

**Expected Results:**
- ✅ 11/11 tests pass
- ✅ User registration works
- ✅ CRUD operations work
- ✅ AI analysis completes
- ✅ MongoDB sync works

## Manual Frontend Tests

### 1. Authentication Flow
- [ ] Navigate to http://localhost:3000
- [ ] Click "Sign up" and create account
- [ ] Verify redirect to dashboard
- [ ] Logout and login again
- [ ] Verify token persistence

### 2. Dashboard
- [ ] View dashboard statistics
- [ ] Check "Total Records" count
- [ ] Check "Avg Severity" calculation
- [ ] Check "This Month" count
- [ ] Verify empty state if no records

### 3. Create Health Record
- [ ] Click "New Record" button
- [ ] Fill in all SOCRATES fields:
  - Site: "chest"
  - Onset: "sudden, 2 hours ago"
  - Character: "sharp, stabbing"
  - Severity: 8/10
- [ ] Add vital signs
- [ ] Add personal notes
- [ ] Click "Save Record"
- [ ] Verify redirect to records page
- [ ] Verify new record appears

### 4. View Records
- [ ] Navigate to "Records" page
- [ ] Verify record list displays
- [ ] Test search functionality
- [ ] Click on a record
- [ ] Verify detail page loads

### 5. AI Analysis
- [ ] Open a health record
- [ ] Click "AI Analysis" button
- [ ] Wait for analysis (10-30 seconds)
- [ ] Verify modal appears with:
  - [ ] Recommendations
  - [ ] Risk factors
  - [ ] Red flags (if applicable)
- [ ] Close modal

### 6. Edit Record
- [ ] Open a health record
- [ ] Click "Edit" button
- [ ] Modify severity to 5/10
- [ ] Update personal notes
- [ ] Click "Update Record"
- [ ] Verify changes saved

### 7. Delete Record
- [ ] Open a health record
- [ ] Click "Delete" button
- [ ] Verify confirmation modal
- [ ] Click "Delete Record"
- [ ] Verify redirect to records page
- [ ] Verify record removed from list

### 8. Responsive Design
- [ ] Resize browser window
- [ ] Test mobile view (< 768px)
- [ ] Test tablet view (768px - 1024px)
- [ ] Verify navigation works
- [ ] Verify forms are usable

## Backend API Tests

### Health Check
```bash
curl http://localhost:3001/api/health
```
Expected: `{"success": true, "message": "Health Journal API is running"}`

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

### Create Health Record
```bash
curl -X POST http://localhost:3001/api/health-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "record_date": "2024-12-12",
    "record_time": "14:30",
    "site": "chest",
    "severity": 8,
    "symptoms": "chest pain"
  }'
```

## AI Microservice Tests

### Health Check
```bash
curl http://localhost:8000/api/v1/health \
  -H "X-API-Key: ai-rag-demo-key-2024"
```

### AI Analysis
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ai-rag-demo-key-2024" \
  -d '{"query": "Patient with chest pain and high blood pressure"}'
```

## Integration Tests

### Test Full Flow
1. [ ] Create record via frontend
2. [ ] Verify in PostgreSQL database
3. [ ] Request AI analysis
4. [ ] Verify MongoDB has record
5. [ ] Delete record via frontend
6. [ ] Verify deleted from PostgreSQL
7. [ ] Verify deleted from MongoDB (if sync enabled)

### Test Error Handling
- [ ] Try creating record without auth token
- [ ] Try accessing other user's records
- [ ] Test with AI service down
- [ ] Test with database down
- [ ] Verify graceful degradation

## Performance Tests

### Response Times
- [ ] Dashboard load: < 1s
- [ ] Record creation: < 500ms
- [ ] Record list: < 1s
- [ ] AI analysis: < 30s
- [ ] Record deletion: < 500ms

### Concurrent Users
- [ ] Test with 5 simultaneous users
- [ ] Verify no conflicts
- [ ] Check database connections
- [ ] Monitor memory usage

## Security Tests

### Authentication
- [ ] Cannot access protected routes without token
- [ ] Token expires after logout
- [ ] Cannot access other users' data
- [ ] SQL injection protection
- [ ] XSS protection

### API Security
- [ ] CORS properly configured
- [ ] API key required for AI service
- [ ] Rate limiting works
- [ ] Input validation works

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)

## Test Results

**Date:** _______________
**Tester:** _______________
**Pass Rate:** _____ / _____ (____%)

**Issues Found:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
