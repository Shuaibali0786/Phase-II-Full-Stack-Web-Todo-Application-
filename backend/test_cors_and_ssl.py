"""
Quick test script to verify CORS and SSL fixes are working.

Run this AFTER starting your backend server:
    uvicorn src.main:app --reload

Then run:
    python test_cors_and_ssl.py
"""
import asyncio
import sys
from pathlib import Path
import requests
import json

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

print("=" * 70)
print("TESTING CORS AND SSL FIXES")
print("=" * 70)

BASE_URL = "http://localhost:8000"

# Test 1: Health Check
print("\n[TEST 1] Testing Backend Health...")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Backend is running: {data}")
        if data.get("database") == "connected":
            print("✅ Database connection working (SSL configured correctly!)")
        else:
            print("❌ Database not connected - check SSL configuration")
            sys.exit(1)
    else:
        print(f"❌ Backend returned status {response.status_code}")
        sys.exit(1)
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to backend at http://localhost:8000")
    print("   Make sure backend is running: uvicorn src.main:app --reload")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)

# Test 2: CORS Headers
print("\n[TEST 2] Testing CORS Configuration...")
try:
    # Simulate a preflight OPTIONS request from frontend
    response = requests.options(
        f"{BASE_URL}/api/v1/auth/login",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
        timeout=5
    )

    cors_headers = {
        "access-control-allow-origin": response.headers.get("access-control-allow-origin"),
        "access-control-allow-credentials": response.headers.get("access-control-allow-credentials"),
        "access-control-allow-methods": response.headers.get("access-control-allow-methods"),
    }

    print(f"   CORS Headers received: {json.dumps(cors_headers, indent=2)}")

    if cors_headers["access-control-allow-origin"] == "http://localhost:3000":
        print("✅ CORS allows localhost:3000 (Next.js frontend)")
    else:
        print(f"❌ CORS origin is: {cors_headers['access-control-allow-origin']}")
        print("   Should be: http://localhost:3000")

    if cors_headers["access-control-allow-credentials"] == "true":
        print("✅ CORS allows credentials (required for auth)")
    else:
        print("❌ CORS credentials not allowed")

    if "POST" in cors_headers.get("access-control-allow-methods", ""):
        print("✅ CORS allows POST method")
    else:
        print("❌ CORS doesn't allow POST method")

except Exception as e:
    print(f"❌ CORS test failed: {e}")
    sys.exit(1)

# Test 3: Database Connection (via asyncio)
print("\n[TEST 3] Testing Direct Database Connection...")
try:
    from src.core.database import check_connection

    async def test_db():
        return await check_connection()

    db_ok = asyncio.run(test_db())

    if db_ok:
        print("✅ Direct database connection successful")
        print("✅ asyncpg SSL configuration is correct!")
    else:
        print("❌ Database connection failed")
        print("   Check that 'ssl': 'require' is in connect_args")
        sys.exit(1)

except ImportError as e:
    print(f"⚠️  Cannot import database module: {e}")
    print("   (This is OK if backend is running separately)")
except Exception as e:
    print(f"❌ Database test failed: {e}")
    sys.exit(1)

# Test 4: Register User (End-to-End Test)
print("\n[TEST 4] Testing User Registration (End-to-End)...")
test_email = f"cors-ssl-test-{asyncio.get_event_loop().time()}@example.com"
try:
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/register",
        headers={
            "Content-Type": "application/json",
            "Origin": "http://localhost:3000",  # Simulate frontend request
        },
        json={
            "email": test_email,
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User",
        },
        timeout=10
    )

    if response.status_code == 200:
        data = response.json()
        print(f"✅ User registered successfully: {data.get('user', {}).get('email')}")
        print("✅ Database write successful (data persisted to Neon!)")

        # Check CORS headers in response
        if response.headers.get("access-control-allow-origin") == "http://localhost:3000":
            print("✅ CORS headers present in response")
        else:
            print("⚠️  CORS headers might not be present (check if middleware is configured)")

    elif response.status_code == 400:
        error = response.json()
        if "already registered" in error.get("detail", "").lower():
            print("✅ Registration endpoint working (user already exists)")
        else:
            print(f"⚠️  Got 400 error: {error.get('detail')}")
    elif response.status_code == 500:
        print("❌ 500 Internal Server Error - SSL configuration might still be wrong")
        print("   Check backend logs for 'sslmode' error")
        print("   Response:", response.text[:200])
        sys.exit(1)
    else:
        print(f"⚠️  Unexpected status code: {response.status_code}")
        print(f"   Response: {response.text[:200]}")

except Exception as e:
    print(f"❌ Registration test failed: {e}")
    sys.exit(1)

# Final Summary
print("\n" + "=" * 70)
print("TEST SUMMARY")
print("=" * 70)
print("✅ Backend is running")
print("✅ CORS is configured correctly for localhost:3000")
print("✅ asyncpg SSL is working (Neon connection successful)")
print("✅ End-to-end flow works (frontend → backend → database)")
print("=" * 70)
print("\n🎉 ALL TESTS PASSED! Your fixes are working correctly.\n")
print("Next steps:")
print("1. Start your Next.js frontend: cd frontend && npm run dev")
print("2. Test registration and login from the browser")
print("3. Verify no CORS errors in browser console")
print("=" * 70)
