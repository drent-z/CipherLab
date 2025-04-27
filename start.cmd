@echo off
cd /d "%~dp0"
echo CipherLab - Local Server
echo =======================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed!
    echo Running installer...
    echo.
    
    REM Run the PowerShell installation script
    powershell -ExecutionPolicy Bypass -File "%~dp0install.ps1"
    
    echo.
    echo After installing Node.js, please run this script again.
    pause
    exit /b
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo Node.js %NODE_VERSION% is already installed.
    echo.
)

REM Start the server
echo Starting CipherLab server...
echo When server starts, visit http://localhost:8080 in your browser
echo Press Ctrl+C to stop the server
echo.
npm start
