@echo off
REM Script to run the backend server with network access
echo Starting Todo Application Backend...

REM Activate the virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Install dependencies if requirements.txt is newer than the lock file
if exist "requirements.txt" (
    pip install -r requirements.txt
)

REM Run the FastAPI server binding to all interfaces for network access
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload