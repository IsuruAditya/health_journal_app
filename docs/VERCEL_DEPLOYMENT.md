# Vercel Deployment Guide

## Prerequisites
- Vercel account
- Vercel CLI: `npm i -g vercel`
- Neon PostgreSQL database
- AI microservice deployed

## Backend Deployment

### 1. Navigate to backend
```bash
cd health_journal_app/backend
```

### 2. Build locally to verify
```bash
npm install
npm run build
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `JWT_SECRET` - Strong random secret (use: `openssl rand -base64 32`)
- `AI_SERVICE_URL` - Your deployed AI service URL
- `FRONTEND_URL` - Your frontend Vercel URL (set after frontend deployment)
- `NODE_ENV` - production
- `PORT` - 3001

### 5. Update CORS
After frontend deployment, update `src/app.ts` CORS origin to include your frontend Vercel domain.

## Frontend Deployment

### 1. Navigate to frontend
```bash
cd health_journal_app/web
```

### 2. Build locally to verify
```bash
npm install
npm run build
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard
- `VITE_API_BASE_URL` - Your backend Vercel URL + `/api` (e.g., `https://your-backend.vercel.app/api`)
- `VITE_AI_SERVICE_URL` - Your deployed AI service URL
- `VITE_AI_API_KEY` - Your AI service API key
- `VITE_NODE_ENV` - production
- `VITE_ENABLE_AI_ANALYSIS` - true
- `VITE_ENABLE_DEBUG` - false

## Post-Deployment

### 1. Update Backend CORS
In `backend/src/app.ts`, update CORS to allow your frontend domain:
```typescript
origin: (origin, callback) => {
  const allowed = [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ];
  if (!origin || allowed.includes(origin)) {
    return callback(null, true);
  }
  callback(new Error('Not allowed by CORS'));
}
```

### 2. Redeploy Backend
```bash
cd backend
vercel --prod
```

### 3. Test the Application
- Visit your frontend URL
- Register/Login
- Create health records
- Test AI analysis

## Troubleshooting

### Backend Issues
- Check Vercel logs: `vercel logs`
- Verify DATABASE_URL is correct
- Ensure JWT_SECRET is set
- Check build output in Vercel dashboard

### Frontend Issues
- Verify VITE_API_BASE_URL points to backend
- Check browser console for CORS errors
- Ensure environment variables are set
- Clear browser cache

### Database Connection
- Test connection string locally first
- Ensure Neon database is active
- Check IP allowlist in Neon dashboard

## Architecture
```
Frontend (Vercel) → Backend (Vercel) → Neon PostgreSQL
                  ↓
            AI Microservice (Separate deployment)
```

## Notes
- Backend and frontend are separate Vercel projects
- Each has its own domain
- Environment variables must be set in Vercel dashboard
- CORS must allow frontend domain
- Database must be accessible from Vercel IPs
