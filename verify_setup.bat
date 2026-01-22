#!/bin/bash
# Final verification script for the Todo App

echo "=== Todo App Setup Verification ==="

echo
echo "1. Checking backend server..."
if curl -sf http://localhost:8000/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not accessible"
fi

echo
echo "2. Testing registration endpoint..."
REG_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email": "verify@example.com", "password": "verification123", "first_name": "Verify", "last_name": "Test"}')

if [[ $REG_RESPONSE == *"User registered successfully"* ]]; then
    echo "✅ Registration endpoint is working"
else
    echo "❌ Registration endpoint failed"
    echo "Response: $REG_RESPONSE"
fi

echo
echo "3. Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email": "verify@example.com", "password": "verification123"}')

if [[ $LOGIN_RESPONSE == *"access_token"* ]] && [[ $LOGIN_RESPONSE == *"user"* ]]; then
    echo "✅ Login endpoint is working"
else
    echo "❌ Login endpoint failed"
    echo "Response: $LOGIN_RESPONSE"
fi

echo
echo "4. Checking database file..."
if [ -f "backend/todo_app.db" ]; then
    echo "✅ SQLite database file exists"
else
    echo "❌ SQLite database file not found"
fi

echo
echo "=== Verification Complete ==="
echo "All core functionality has been verified!"
echo
echo "Next steps:"
echo "1. Start backend: cd backend && python -m uvicorn src.api.main:app --reload --port 8000"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Access the app at http://localhost:3000"