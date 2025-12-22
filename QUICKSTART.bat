@echo off
REM Flynt Studio - Quick Start Script for Windows

echo.
echo 🚀 FLYNT STUDIO - Quick Start (Windows)
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Python is not installed. Please install Python 3.10+
    pause
    exit /b 1
)
echo ✓ Python is installed

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo Setting up Flynt Studio...
echo.

REM Create directories
if not exist "frontend" mkdir frontend
if not exist "data" mkdir data
if not exist "logs" mkdir logs

REM Install backend dependencies
echo Installing backend dependencies...
pip install -r requirements.txt >nul 2>&1
echo ✓ Backend dependencies installed

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install >nul 2>&1
cd ..
echo ✓ Frontend dependencies installed

REM Create .env if not exists
if not exist ".env" (
    echo Creating .env file...
    (
        echo # Flynt Studio Configuration
        echo GEMINI_API_KEY=your_gemini_key_here
        echo GROQ_API_KEY=your_groq_key_here
        echo DATABASE_URL=sqlite:///./data/flynt.db
        echo LOG_LEVEL=INFO
    ) > .env
    echo ⚠️  Please add your API keys to .env
)

echo.
echo ✓ Setup complete!
echo.
echo Next steps:
echo.
echo 1. Add API keys to .env file
echo    - Get Gemini key: https://makersuite.google.com/app/apikey
echo    - Get Groq key: https://console.groq.com/
echo.
echo 2. Start the backend (Terminal 1)
echo    python -m cli.main init
echo    python -m uvicorn main:app --reload
echo.
echo 3. Start the frontend (Terminal 2)
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open in browser
echo    http://localhost:3000
echo.
echo Happy building! 🎉
echo.
pause
