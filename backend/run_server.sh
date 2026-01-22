#!/bin/bash
# Script to run the backend server with network access
echo "Starting Todo Application Backend..."

# Activate the virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Install dependencies if requirements.txt is newer than the lock file
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi

# Run the FastAPI server binding to all interfaces for network access
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload