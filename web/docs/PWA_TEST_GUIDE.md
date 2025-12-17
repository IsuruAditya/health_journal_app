# PWA Testing Guide

## How to Test Your PWA

### 1. Development Testing
```bash
cd health_journal_app/web
npm run dev
```

### 2. Production Build Testing
```bash
npm run build
npm run preview
```

### 3. PWA Checklist

#### Browser DevTools (F12)
1. **Application Tab** → **Manifest**
   - ✅ Manifest should load without errors
   - ✅ Icons should be present (192x192, 512x512)
   - ✅ Name: "Health Journal"
   - ✅ Start URL: "/"

2. **Application Tab** → **Service Workers**
   - ✅ Service worker should be registered
   - ✅ Status should be "activated and running"

3. **Lighthouse Audit**
   - Run Lighthouse PWA audit
   - Should score 90+ for PWA criteria

#### Manual Tests

1. **Install Prompt**
   - Chrome: Look for install icon in address bar
   - Edge: Three dots menu → "Install Health Journal"

2. **Offline Functionality**
   - Install the app
   - Disconnect internet
   - App should still load (cached resources)

3. **Add to Home Screen** (Mobile)
   - Open in mobile browser
   - "Add to Home Screen" option should appear
   - Icon should appear on home screen

### 4. Add PWA Test Component

Add this to any page to see PWA status:

```tsx
import { PWATest } from '@/components/PWATest';

// In your component
<PWATest />
```

### 5. Common Issues & Fixes

#### Manifest Not Loading
- Check `public/` folder has manifest icons
- Verify Vite config includes PWA plugin

#### Service Worker Not Registering
- Check `src/registerSW.ts` is imported in `main.tsx`
- Build in production mode (`npm run build`)

#### Install Prompt Not Showing
- Must be HTTPS (or localhost)
- Must have valid manifest
- Must have service worker
- User hasn't dismissed it before

### 6. Testing Commands

```bash
# Check if icons exist
ls public/icons/

# Build and test
npm run build
npm run preview

# Check service worker in browser console
navigator.serviceWorker.getRegistrations()
```

### 7. PWA Requirements Met ✅

- ✅ Web App Manifest configured
- ✅ Service Worker with Workbox
- ✅ Icons (192x192, 512x512, maskable)
- ✅ HTTPS ready (works on localhost)
- ✅ Responsive design
- ✅ Offline functionality
- ✅ Install prompts