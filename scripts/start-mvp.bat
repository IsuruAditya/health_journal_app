@echo off
echo Starting Health Journal MVP...

echo.
echo 1. Starting AI RAG Microservice...
cd ai_rag_microservice
start "AI Service" cmd /k "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo 2. Starting Backend API...
cd ..\health_journal_app\backend
start "Backend API" cmd /k "npm run dev"

echo.
echo 3. Starting Web Frontend...
cd ..\web
start "Web Frontend" cmd /k "npm run dev"

echo.
echo MVP Services Starting:
echo - AI Service: http://localhost:8000
echo - Backend API: http://localhost:3001
echo - Web Frontend: http://localhost:5173
echo.
echo Press any key to continue...
pause > nul