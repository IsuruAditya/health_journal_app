# Salubro - Health Technology Platform

## Overview

Salubro is a comprehensive health technology platform consisting of two main applications:

1. **Health Journal App** - A full-stack health journaling application with web and mobile interfaces
2. **AI RAG Microservice** - An AI-powered Retrieval-Augmented Generation service for health insights

## Project Structure

```
Salubro/
├── health_journal_app/     # Health journaling platform
│   ├── web/               # React PWA with Vite
│   ├── mobile/            # React Native mobile app
│   ├── backend/           # Node.js Express API
│   └── docs/              # Documentation
└── ai_rag_microservice/   # AI service for health insights
    ├── app/               # Python FastAPI application
    ├── config/            # Configuration files
    ├── docs/              # API documentation
    └── scripts/           # Deployment scripts
```

## Health Journal App

### Technology Stack
- **Frontend Web**: React 18 + TypeScript + Vite + TailwindCSS
- **Frontend Mobile**: React Native
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **PWA**: Service Worker + Web App Manifest

### Key Features
- Progressive Web App (PWA) with offline capabilities
- User authentication and authorization
- Health journal entry creation and management
- AI-powered health insights integration
- Cross-platform compatibility (web & mobile)
- Responsive design with TailwindCSS

## AI RAG Microservice

### Technology Stack
- **Framework**: Python + FastAPI
- **AI/ML**: Retrieval-Augmented Generation
- **Deployment**: Docker + Nginx
- **Cloud**: AWS EC2 ready

### Key Features
- Health-focused AI assistance
- Document retrieval and processing
- RESTful API for health insights
- Scalable microservice architecture
- Production-ready deployment

## Development Setup

### Health Journal App
```bash
# Backend
cd health_journal_app/backend
npm install && npm run dev

# Web App
cd health_journal_app/web
npm install && npm run dev

# Mobile App
cd health_journal_app/mobile
npm install && npm start
```

### AI RAG Microservice
```bash
cd ai_rag_microservice
pip install -r requirements.txt
python -m app.main
```

## Deployment

- **Health Journal**: Multi-platform deployment (web, mobile app stores)
- **AI Service**: Docker containerized with Nginx reverse proxy
- **Infrastructure**: AWS EC2 with automated setup scripts

## Integration

The Health Journal App integrates with the AI RAG Microservice to provide intelligent health insights and recommendations based on user journal entries and health data.