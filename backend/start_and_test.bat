@echo off
echo ================================================================
echo Starting FastAPI Backend Server
echo ================================================================
echo.

REM Start the FastAPI server in a new window
start "FastAPI Server" cmd /k "python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting for server to initialize...
timeout /t 10 /nobreak > nul

echo.
echo ================================================================
echo Running Registration Flow Tests
echo ================================================================
echo.

REM Run the test script
python test_registration_flow.py

echo.
echo ================================================================
echo Test complete!
echo ================================================================
echo.
echo Press any key to exit...
pause > nul
