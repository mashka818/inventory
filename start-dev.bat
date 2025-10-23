@echo off
echo ========================================
echo Inventory Checker - Development Start
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd backend
start cmd /k "npm install && npm run dev"
cd ..

timeout /t 3 /nobreak > nul

echo [2/3] Starting React Native Metro Bundler...
cd mobile
start cmd /k "npm install && npm start"
cd ..

timeout /t 5 /nobreak > nul

echo [3/3] Building and running Android app...
cd mobile
start cmd /k "npm run android"
cd ..

echo.
echo ========================================
echo All services started!
echo Backend: http://localhost:3000
echo ========================================
echo.
pause

