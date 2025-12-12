# Quick Setup Guide - Production Resilience

## Installation (5 minutes)

### Step 1: Files Already Created ✅
```
backend/src/utils/
  ├── RateLimiter.ts      # Token bucket rate limiting
  ├── Cache.ts            # In-memory LRU cache
  ├── CircuitBreaker.ts   # Netflix Hystrix pattern
  ├── Queue.ts            # Priority queue
  └── Metrics.ts          # RED metrics

backend/src/routes/
  └── metrics.ts          # Metrics endpoints

backend/src/services/
  └── AIService.ts        # Updated with resilience
```

### Step 2: Update Your Routes (2 minutes)

**File**: `backend/src/routes/healthRecords.ts`

```typescript
// Add userId to analysis call
router.post('/:id/analyze', async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || 'anonymous'; // Get from auth

  try {
    const record = await getHealthRecord(id);
    const history = await getUserHistory(userId);
    
    const analysis = await AIService.analyzeHealthRecord(
      record,
      history,
      userId  // ← Add this parameter
    );
    
    res.json(analysis);
  } catch (error) {
    if (error.message.includes('Rate limit')) {
      res.status(429).json({ 
        error: 'Too many requests. Please wait a moment.' 
      });
    } else {
      res.status(500).json({ error: 'Analysis failed' });
    }
  }
});
```

### Step 3: Add Metrics Route (1 minute)

**File**: `backend/src/index.ts` or `app.ts`

```typescript
import metricsRouter from './routes/metrics';

// Add after other routes
app.use('/api', metricsRouter);
```

### Step 4: Test It! (2 minutes)

```bash
# Start backend
cd health_journal_app/backend
npm run dev

# Test health check
curl http://localhost:3000/api/health

# Test metrics
curl http://localhost:3000/api/metrics

# Test analysis (should be cached on 2nd call)
curl -X POST http://localhost:3000/api/health-records/123/analyze
```

---

## Verification Checklist

✅ **Rate Limiting Works**
```bash
# Make 10 rapid requests - should see 429 after 5
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/health-records/123/analyze
done
```

✅ **Caching Works**
```bash
# First call: slow (45-90s)
time curl -X POST http://localhost:3000/api/health-records/123/analyze

# Second call: fast (<1s) - cached!
time curl -X POST http://localhost:3000/api/health-records/123/analyze
```

✅ **Metrics Available**
```bash
curl http://localhost:3000/api/metrics | jq
# Should show cache hit rate, request counts, etc.
```

✅ **Queue Working**
```bash
# Check queue stats in metrics
curl http://localhost:3000/api/metrics | jq '.queue'
```

---

## Expected Results

### First Request (Cache Miss)
```json
{
  "recordId": "123",
  "analysisDate": "2024-01-15T10:30:00Z",
  "symptomPattern": [...],
  "duration": "45000ms"  // Slow
}
```

### Second Request (Cache Hit)
```json
{
  "recordId": "123",
  "analysisDate": "2024-01-15T10:30:00Z",
  "symptomPattern": [...],
  "duration": "5ms"  // Fast! ⚡
}
```

### Metrics Response
```json
{
  "requests": {
    "total": 100,
    "success": 95,
    "errors": 5,
    "errorRate": 5.0
  },
  "cache": {
    "hits": 60,
    "misses": 40,
    "hitRate": 60.0  // 60% cached!
  },
  "duration": {
    "avg": 2500,
    "p95": 5000
  }
}
```

---

## Troubleshooting

### Issue: "Cannot find module '@/utils/RateLimiter'"

**Solution**: Check tsconfig.json has path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Rate limit not working

**Solution**: Ensure userId is passed:
```typescript
await AIService.analyzeHealthRecord(record, history, userId);
//                                                    ^^^^^^ Don't forget!
```

### Issue: Cache not working

**Solution**: Check query is identical:
```typescript
// These are DIFFERENT queries (won't cache):
"Symptoms: headache"
"Symptoms: Headache"  // Capital H

// Solution: Normalize in buildQuery()
```

---

## Performance Monitoring

### Watch These Metrics

**Dashboard**: `http://localhost:3000/api/metrics`

| Metric | Target | Action if Off |
|--------|--------|---------------|
| Cache Hit Rate | >60% | Increase cache size |
| Error Rate | <5% | Check AI service |
| P95 Latency | <10s | Review slow queries |
| Queue Size | <10 | Increase workers |

### Set Up Alerts (Optional)

```typescript
// Add to metrics.ts
setInterval(() => {
  const metrics = getMetrics();
  
  if (metrics.requests.errorRate > 10) {
    console.error('⚠️ HIGH ERROR RATE:', metrics.requests.errorRate);
    // Send to Slack/PagerDuty
  }
  
  if (metrics.cache.hitRate < 40) {
    console.warn('⚠️ LOW CACHE HIT RATE:', metrics.cache.hitRate);
  }
}, 60000); // Check every minute
```

---

## Next Steps

1. ✅ **Test in Development** (Today)
   - Verify all features work
   - Check metrics dashboard
   - Test rate limiting

2. ⚡ **Deploy to Staging** (This Week)
   - Monitor for 24 hours
   - Tune cache TTL
   - Adjust rate limits

3. 🚀 **Production Rollout** (Next Week)
   - Enable monitoring
   - Set up alerts
   - Document runbook

---

## Quick Reference

```typescript
// Rate Limiting
rateLimiters.getUserLimiter(userId).acquire()

// Caching
analysisCache.get(query)
analysisCache.set(query, result, ttl)

// Circuit Breaker
circuitBreakers.aiService.execute(fn)

// Queue
analysisQueue.add(id, data, Priority.URGENT)

// Metrics
metrics.recordRequest()
metrics.recordSuccess(duration)
metrics.getMetrics()
```

---

## Support

- 📖 Full docs: `RESILIENCE.md`
- 🐛 Issues: Check circuit breaker state first
- 📊 Metrics: `GET /api/metrics`
- 🏥 Health: `GET /api/health`

**You're all set! 🎉**
