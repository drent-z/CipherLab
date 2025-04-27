@echo off
cd /d "%~dp0"
echo Installing CipherLab dependencies...
echo =================================
echo.

npm install

echo.
echo Dependencies installed successfully!
echo Now you can run start.cmd to launch the server.
echo.
pause
