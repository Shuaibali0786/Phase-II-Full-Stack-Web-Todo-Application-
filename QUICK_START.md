# Quick Start Guide - Neon PostgreSQL Todo App

## Prerequisites

- Python 3.9+ installed
- Neon PostgreSQL account (already configured)

## Setup (5 minutes)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Verify Database Connection

```bash
python verify_neon_connection.py
```

**Expected output:**
```
✅ Database connection successful!
✅ Tables created successfully!
✅ ALL VERIFICATION TESTS PASSED!
```

### 3. Start the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected startup logs:**
```
INFO:     Database connection verified successfully!
INFO:     Database tables created successfully!
INFO:     Application startup complete - Database ready!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 4. Test the API

Open http://localhost:8000 in your browser.

You should see:
```json
{
  "message": "Todo Application API is running!",
  "database": "Neon PostgreSQL",
  "version": "2.0.0"
}
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

Save the `access_token` from the response.

### Create Task
```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My first task",
    "description": "This will persist in Neon!",
    "is_completed": false
  }'
```

### Get Tasks
```bash
curl http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Verify Persistence

1. Create a task (see above)
2. Stop the server (Ctrl+C)
3. Restart the server
4. Get tasks again - your task should still be there!

## Troubleshooting

### "Database connection failed"
- Check that `.env` file exists in `backend/` directory
- Verify DATABASE_URL is correct

### "ModuleNotFoundError: No module named 'asyncpg'"
```bash
pip install asyncpg==0.29.0
```

### "Could not validate credentials"
- Access token expired (15 minutes default)
- Login again to get a new token

## Production Deployment

Before deploying to production:

1. **Change secrets in `.env`:**
   ```env
   SECRET_KEY=<generate-strong-random-32-char-key>
   BETTER_AUTH_SECRET=<generate-another-strong-key>
   ```

2. **Restrict CORS** in `src/main.py`:
   ```python
   allow_origins=["https://yourdomain.com"]
   ```

3. **Use environment variables** instead of `.env` file:
   ```bash
   export DATABASE_URL="postgresql+asyncpg://..."
   export SECRET_KEY="..."
   ```

4. **Use production ASGI server:**
   ```bash
   gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

## Support

For detailed information, see `NEON_DATABASE_FIX.md`.

Issues? Check the logs and verify:
1. Database URL is correct (`postgresql+asyncpg://...`)
2. asyncpg is installed
3. Network access to Neon is available
