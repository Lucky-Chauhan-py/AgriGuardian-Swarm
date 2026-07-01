@echo off
title AgriGuardian Swarm - Starting...
color 0A

echo.
echo  ======================================================
echo   AgriGuardian Swarm - Autonomous AI OS for Farmers
echo  ======================================================
echo.

:: ---- Check Python ----
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

:: ---- Check Node.js ----
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Setting up Python virtual environment...
cd /d "%~dp0backend"
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists. Skipping.
)

echo.
echo [2/4] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
echo Python dependencies installed.

echo.
echo [3/4] Installing Node.js dependencies...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    npm install --silent
    echo Node.js dependencies installed.
) else (
    echo Node modules already exist. Skipping.
)

echo.
echo [4/4] Launching Backend and Frontend servers...
echo.

:: Launch Backend in a new terminal window
start "AgriGuardian Backend (FastAPI)" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && echo Starting FastAPI Backend on http://localhost:8000 && uvicorn app.main:app --reload --port 8000"

:: Wait 4 seconds for backend to initialize
timeout /t 4 /nobreak >nul

:: Launch Frontend in a new terminal window
start "AgriGuardian Frontend (Next.js)" cmd /k "cd /d %~dp0frontend && echo Starting Next.js Frontend on http://localhost:3000 && npm run dev"

:: Wait 5 seconds for frontend to initialize
timeout /t 5 /nobreak >nul

:: Open browser
echo Opening browser...
start "" "http://localhost:3000"

echo.
echo  ======================================================
echo   Both servers are now running!
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/docs
echo.
echo   Login with:
echo   Email:     farmer@agriguardian.com
echo   Password:  farmer123
echo  ======================================================
echo.
echo  Close the Backend and Frontend terminal windows to stop the servers.
echo.
pause
