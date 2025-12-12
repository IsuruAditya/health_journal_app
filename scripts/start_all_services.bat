@echo off
echo ========================================
echo Starting All Services
echo ========================================

echo.
echo [1/3] Starting AI RAG Microservice...
start "AI Microservice" cmd /k "cd ai_rag_microservice && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 5 /nobreak >nul

echo.
echo [2/3] Starting Backend...
start "Backend" cmd /k "cd health_journal_app\backend && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd health_journal_app\web && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo All Services Started!
echo ========================================
echo.
echo AI Microservice: http://localhost:8000
echo Backend API:     http://localhost:3001
echo Frontend:        http://localhost:3000
echo.
echo Press any key to run system tests...
pause >nul

echo.
echo Running System Tests...
python test_full_system.py

echo.
echo Press any key to exit...
pause >nul
