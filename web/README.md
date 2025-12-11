# Health Journal Web Application

A modern, professional React-based web application for health tracking and AI-powered analysis.

## 🚀 Features

### Core Functionality
- **Health Record Management**: Create, view, edit, and delete health records
- **SOCRATES Framework**: Structured symptom assessment (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating factors, Severity)
- **AI-Powered Analysis**: Integration with RAG microservice for intelligent health insights
- **Real-time Sync**: Automatic synchronization with AI knowledge base
- **Trend Analysis**: Visual health metrics and pattern recognition

### Modern UI/UX
- **Professional Design**: Clean, modern interface with consistent design system
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Dark Mode Ready**: CSS variables for easy theme switching
- **Smooth Animations**: Framer Motion for enhanced user experience

### Technical Excellence
- **TypeScript**: Full type safety and better developer experience
- **State Management**: Zustand for efficient, scalable state handling
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Code splitting, lazy loading, and optimized bundles
- **Testing Ready**: Jest and React Testing Library setup

## 🛠 Technology Stack

### Frontend Framework
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server

### UI Components
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Beautiful, customizable icons
- **Framer Motion**: Production-ready motion library

### State & Data
- **Zustand**: Lightweight state management
- **React Query**: Server state management (ready for integration)
- **Axios**: HTTP client with interceptors

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality assurance

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── AnalysisModal.tsx
│   ├── ErrorBoundary.tsx
│   ├── HealthMetrics.tsx
│   └── LoadingSpinner.tsx
├── hooks/              # Custom React hooks
│   ├── useHealthRecords.ts
│   └── useToast.ts
├── lib/                # Utility functions
│   └── utils.ts
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── NewRecordPage.tsx
│   └── ...
├── services/           # API services
│   ├── api.ts
│   └── aiService.ts
├── store/              # State management
│   └── useHealthStore.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── layouts/            # Layout components
    └── AppLayout.tsx
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 3001
- AI RAG microservice running on port 8000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_AI_SERVICE_URL=http://localhost:8000
   VITE_AI_API_KEY=ai-rag-demo-key-2024
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Integration
The application integrates with two backend services:

1. **Health Journal API** (Node.js/Express)
   - User authentication
   - Health record CRUD operations
   - PostgreSQL database

2. **AI RAG Microservice** (Python/FastAPI)
   - AI-powered health analysis
   - Vector similarity search
   - MongoDB Atlas vector store

### Environment Variables
- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_AI_SERVICE_URL`: AI microservice endpoint
- `VITE_AI_API_KEY`: API key for AI service
- `VITE_ENABLE_AI_ANALYSIS`: Feature flag for AI features

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Warning**: Orange (#d97706)
- **Error**: Red (#dc2626)

### Typography
- **Font**: Inter (system fallback)
- **Headings**: Semibold weights
- **Body**: Regular weight

### Components
All components follow consistent patterns:
- Proper TypeScript interfaces
- Accessible markup
- Responsive design
- Loading and error states

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized inputs and outputs
- **CORS Configuration**: Proper cross-origin setup
- **Error Handling**: No sensitive data in error messages

## 📊 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Optimized chunk sizes
- **Image Optimization**: Responsive images
- **Caching**: Service worker ready
- **Tree Shaking**: Unused code elimination

## 🧪 Testing Strategy

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User workflow testing
- **Accessibility Tests**: WCAG compliance testing

## 🚀 Deployment

### Build Process
```bash
npm run build
npm run preview  # Test production build
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📈 Monitoring & Analytics

- **Error Tracking**: Error boundary integration
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Privacy-compliant tracking
- **Health Checks**: Service availability monitoring

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use conventional commit messages
3. Add tests for new features
4. Update documentation
5. Ensure accessibility compliance

## 📄 License

This project is part of the Salubro Health AI Platform.