@echo off
echo Starting setup process...

REM Go to backend directory
cd backend
if errorlevel 1 (
    echo Failed to enter backend directory.
    pause
    exit /b
)

REM Remove old venv if it exists
if exist venv (
    echo Removing old virtual environment...
    rmdir /s /q venv
    if errorlevel 1 (
        echo Failed to remove old virtual environment.
        pause
        exit /b
    )
)

REM Create new virtual environment
echo Creating new virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Failed to create virtual environment.
    pause
    exit /b
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
if errorlevel 1 (
    echo Failed to activate virtual environment.
    pause
    exit /b
)

REM Install backend requirements
echo Installing backend requirements...
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install backend requirements.
    pause
    exit /b
)

REM Go back to root directory
cd ..
if errorlevel 1 (
    echo Failed to return to root directory.
    pause
    exit /b
)

REM Go to frontend directory
cd frontend
if errorlevel 1 (
    echo Failed to enter frontend directory.
    pause
    exit /b
)

REM Install frontend dependencies
echo Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies.
    pause
    exit /b
)

echo.
echo Setup completed successfully!
pause