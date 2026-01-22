# Todo Application Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- pip package manager

## Backend Setup (FastAPI)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
# On Windows:
./run_server.bat

# On Linux/Mac:
./run_server.sh
```

The backend will be available at:
- Local: http://localhost:8000
- Network: http://YOUR_LOCAL_IP:8000 (e.g., http://192.168.1.100:8000)

## Frontend Setup (Next.js)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend development server:
```bash
# On Windows:
./run_frontend.bat

# On Linux/Mac:
./run_frontend.sh
```

The frontend will be available at:
- Local: http://localhost:3000
- Network: http://YOUR_LOCAL_IP:3000

## Network Access Configuration

To access the application from other devices on the same network:

1. Find your local IP address:
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig` or `ip addr`

2. Update the frontend environment variable in `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000
```

3. Restart both servers.

## API Endpoints

- Health Check: GET /
- Health Check: GET /health
- Authentication: POST /api/v1/login, POST /api/v1/register
- Tasks: GET/POST/PUT/DELETE /api/v1/tasks
- Priorities: GET/POST /api/v1/priorities
- Tags: GET/POST /api/v1/tags

## Troubleshooting

- If you encounter database connection issues, make sure the SQLite file path is writable
- If CORS errors occur, check that the backend allows requests from your frontend origin
- For authentication issues, ensure tokens are properly stored in localStorage
- For slow reloads, check that you have sufficient system resources

## Default Credentials

Upon first run, the application will create default priorities:
- Low (green)
- Medium (yellow)
- High (orange)
- Urgent (red)