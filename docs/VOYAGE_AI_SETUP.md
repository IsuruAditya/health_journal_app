# Voyage AI Embeddings Setup (Free & Fast)

## Why Voyage AI?
- ✅ **100% Free**: 100M tokens/month (enough for 1M+ health records)
- ✅ **Fast**: 50ms per request (vs 2-5s for local models)
- ✅ **No Download**: API-based, works instantly
- ✅ **Better Quality**: Outperforms OpenAI embeddings
- ✅ **No Network Issues**: Direct API call, no HuggingFace dependency

## Setup Steps

### 1. Install Package
```bash
cd ai_rag_microservice
pip install voyageai
```

### 2. Get Free API Key
1. Go to: https://www.voyageai.com/
2. Click "Get Started Free"
3. Sign up with email
4. Go to Dashboard → API Keys
5. Create new API key
6. Copy the key (starts with `pa-...`)

### 3. Add to .env
```bash
# In ai_rag_microservice/.env
VOYAGE_API_KEY=pa-your-actual-key-here
```

### 4. Restart Service
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Expected Output
```
✅ Voyage AI embeddings initialized (API-based)
✅ Embeddings service ready
INFO:     Application startup complete.
```

## Comparison

| Provider | Speed | Quality | Free Tier | Download |
|----------|-------|---------|-----------|----------|
| **Voyage AI** | 50ms | Excellent | 100M tokens | ❌ No |
| HuggingFace | 2-5s | Good | Unlimited | ✅ Yes (90MB) |
| OpenAI | 100ms | Good | $5 credit | ❌ No |

## Fallback Chain
1. **Voyage AI** (API) - Primary
2. **HuggingFace** (Local) - Fallback if Voyage fails
3. **InMemory** (No embeddings) - Last resort

## Usage
Your code doesn't change! The embeddings service automatically uses Voyage AI:

```python
# Automatically uses Voyage AI
vector_store.similarity_search("chest pain", k=5)
```

## Free Tier Limits
- **100M tokens/month** = ~50M words
- **Rate limit**: 300 requests/minute
- **Models**: voyage-3-lite (free), voyage-3 (paid)

For your health journal app, this is **more than enough**! 🚀
