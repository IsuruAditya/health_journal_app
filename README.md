# Health Journal App

A full-stack health journaling application with web and mobile interfaces.

## Architecture

- **Web App**: React with Vite
- **Mobile App**: React Native
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **AI Integration**: Configurable AI service for health insights

## Project Structure

```
health-journal-app/
├── web/          # React web application
├── mobile/       # React Native mobile app
├── backend/      # Node.js API server
└── README.md
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Web App
```bash
cd web
npm install
npm run dev
```

### Mobile App
```bash
cd mobile
npm install
npm start
```

## Features

- User authentication
- Journal entry creation and management
- AI-powered health insights
- Cross-platform compatibility (web & mobile)
- Responsive design

## Development

Each component (web, mobile, backend) can be developed independently. The backend serves both web and mobile applications through a unified API.