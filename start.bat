@echo off
REM Start backend in new terminal
start cmd /k "cd /d backend && venv\Scripts\activate && uvicorn app.main:app --reload"

REM Wait for 10 seconds to let backend start
timeout /t 10 /nobreak

REM Open backend docs and API in browser
start "" "http://127.0.0.1:8000"
start "" "http://127.0.0.1:8000/api/inventory"

REM Start frontend in new terminal
start cmd /k "cd /d frontend && npm start"