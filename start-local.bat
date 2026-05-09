@echo off
echo Starting Cholojai Backend...
start cmd /k "cd backend && npm start"

echo Starting Cholojai Frontend...
start cmd /k "cd frontend && npm run dev"

echo Waiting for Vite to start...
timeout /t 3 /nobreak > NUL
start http://localhost:5173
