@echo off
echo Setting up CipherLab...
echo =========================

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js (version 14 or higher).
    echo Visit https://nodejs.org/ to download and install Node.js.
    pause
    exit /b 1
)

:: Get Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_MAJOR=%%a
)
set NODE_MAJOR=%NODE_MAJOR:~1%

if %NODE_MAJOR% LSS 14 (
    echo Node.js version 14 or higher is required. Your current version is too low.
    echo Please upgrade Node.js and try again.
    pause
    exit /b 1
)

echo Node.js detected. ✓

:: Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install dependencies. Please check the error messages above.
    pause
    exit /b 1
)

echo Dependencies installed successfully. ✓

:: Instructions for starting the server
echo =========================
echo Setup complete! You can now start the development server with:
echo npm start
echo.
echo Then open your browser and navigate to: http://localhost:8080
echo =========================

:: Ask if user wants to start the server now
set /p START_SERVER="Would you like to start the development server now? (y/n): "

if /i "%START_SERVER%"=="y" (
    echo Starting development server...
    call npm start
) else (
    echo You can start the server later by running 'npm start'
    pause
)
