# Vercel Deployment Guide

## Issue Fixed
The 404 error was caused by:
1. TypeScript path aliases (`@/`) not resolving at runtime
2. Missing proper Vercel configuration

## Changes Made (Industry Standard)
1. ✅ Removed TypeScript path aliases - replaced with relative imports
2. ✅ Updated `server.ts` to export app for serverless (Vercel) and run locally
3. ✅ Configured `vercel.json` to use compiled `dist/server.js`
4. ✅ Removed non-standard `api/` directory

## Deploy to Vercel

### Option 1: Vercel CLI (Recommended)
```bash
cd backend
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your Git repository
3. Set root directory to: `health_journal_app/backend`
4. Framework Preset: Other
5. Build Command: `npm install && npm run build`
6. Output Directory: Leave empty
7. Install Command: `npm install`

### Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=your_neon_postgres_url
JWT_SECRET=your_secret_key_here
AI_SERVICE_URL=your_ai_service_url
AI_API_KEY=your_ai_api_key
NODE_ENV=production
FRONTEND_URL=your_frontend_url
```

## Verify Deployment
After deployment, test these endpoints:
- `https://your-app.vercel.app/api/health` - Should return health status
- `https://your-app.vercel.app/api/auth/login` - Should accept POST requests

## Project Structure (Industry Standard)
```
backend/
├── src/
│   ├── app.ts            # Express app (no path aliases)
│   ├── server.ts         # Exports app for Vercel, runs locally
│   └── ...
├── dist/                 # Compiled output (TypeScript build)
│   ├── app.js
│   └── server.js         # Vercel entry point
├── vercel.json           # Vercel config
└── package.json
```

## Common Issues

### 404 Error
- Ensure `dist` folder exists: `npm run build`
- Vercel builds automatically use `dist/server.js`

### Module Not Found
- All imports use relative paths (no `@/` aliases)
- Run `npm install` before deploying

### Database Connection
- Add `DATABASE_URL` environment variable
- Use Neon PostgreSQL serverless connection string
