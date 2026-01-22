# Full-Stack Todo Application

This is a modern full-stack todo application built with:
- **Frontend**: Next.js (React) with TypeScript
- **Backend**: FastAPI with SQLModel and SQLite
- **Authentication**: JWT-based authentication
- **UI**: Responsive, mobile-friendly dashboard

## Features

✅ **Core Todo Functionality**:
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Set priorities and tags for tasks
- Filter and sort tasks

✅ **User Management**:
- User registration and login
- Profile management
- Secure authentication with JWT tokens

✅ **Advanced Features**:
- Priority levels with color coding
- Custom tags for organization
- Mobile-responsive dashboard
- Real-time updates

✅ **Network Access**:
- Accessible from desktop browsers
- Accessible from mobile browsers
- Accessible from other devices on the same network

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- pip package manager

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
./run_server.bat  # Windows
./run_server.sh   # Linux/Mac
```

Backend will be available at:
- Local: http://localhost:8000
- Network: http://YOUR_LOCAL_IP:8000

### Frontend Setup
```bash
cd frontend
npm install
./run_frontend.bat  # Windows
./run_frontend.sh   # Linux/Mac
```

Frontend will be available at:
- Local: http://localhost:3000
- Network: http://YOUR_LOCAL_IP:3000

## API Endpoints

### Authentication
- `POST /api/v1/login` - User login
- `POST /api/v1/register` - User registration
- `POST /api/v1/logout` - User logout
- `POST /api/v1/refresh` - Token refresh

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{id}` - Get specific task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `PATCH /api/v1/tasks/{id}/complete` - Toggle completion

### Priorities & Tags
- `GET /api/v1/priorities` - Get all priorities
- `POST /api/v1/priorities` - Create priority
- `GET /api/v1/tags` - Get all tags
- `POST /api/v1/tags` - Create tag

## Mobile Access

The application is designed to be accessible from mobile devices:
1. Start the backend server with network access enabled
2. Update the frontend's API URL to point to your local IP address
3. Access the frontend from any device on the same network

## Default Priorities

On first run, the application creates these default priority levels:
- Low (Green)
- Medium (Yellow)
- High (Orange)
- Urgent (Red)

## Troubleshooting

- If CORS errors occur, ensure the backend is running and accessible
- For authentication issues, check that tokens are properly stored in localStorage
- For database issues, verify the SQLite file has proper read/write permissions