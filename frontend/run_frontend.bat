@echo off
REM Script to run the frontend with network access
echo Starting Todo Application Frontend...

cd /d "%~dp0"

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    npm install
)

REM Run the Next.js development server
npm run dev -- --hostname 0.0.0.0