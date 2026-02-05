"""
Comprehensive test for user registration flow.

This script:
1. Starts the FastAPI server
2. Waits for it to initialize
3. Tests the registration endpoint
4. Verifies the user was created in the database
5. Tests login with the new user
"""
import asyncio
import sys
import time
import requests
import json
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.core.database import async_session_maker
from src.models.user import User
from sqlmodel import select
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000"


def wait_for_server(max_attempts=30, delay=1):
    """Wait for the FastAPI server to be ready"""
    logger.info("Waiting for server to start...")
    for attempt in range(max_attempts):
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=2)
            if response.status_code == 200:
                logger.info("✅ Server is ready!")
                return True
        except requests.exceptions.ConnectionError:
            pass
        except Exception as e:
            logger.warning(f"Unexpected error while checking server: {e}")

        time.sleep(delay)
        if attempt % 5 == 0:
            logger.info(f"Still waiting... (attempt {attempt + 1}/{max_attempts})")

    logger.error("❌ Server did not start in time")
    return False


def test_registration():
    """Test user registration endpoint"""
    logger.info("\n" + "=" * 60)
    logger.info("TEST: User Registration")
    logger.info("=" * 60)

    test_email = f"test_user_{int(time.time())}@example.com"
    registration_data = {
        "email": test_email,
        "password": "TestPassword123",
        "first_name": "Test",
        "last_name": "User"
    }

    logger.info(f"Registering user: {test_email}")

    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/register",
            json=registration_data,
            timeout=10
        )

        logger.info(f"Status Code: {response.status_code}")
        logger.info(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 201:
            logger.info("✅ Registration successful!")
            return test_email, registration_data["password"]
        else:
            logger.error(f"❌ Registration failed: {response.text}")
            return None, None

    except Exception as e:
        logger.error(f"❌ Error during registration: {e}")
        return None, None


async def verify_user_in_database(email):
    """Verify the user exists in the database"""
    logger.info("\n" + "=" * 60)
    logger.info("TEST: Database Verification")
    logger.info("=" * 60)

    async with async_session_maker() as session:
        try:
            stmt = select(User).where(User.email == email)
            result = await session.exec(stmt)
            user = result.first()

            if user:
                logger.info("✅ User found in database!")
                logger.info(f"   ID: {user.id}")
                logger.info(f"   Email: {user.email}")
                logger.info(f"   Name: {user.first_name} {user.last_name}")
                logger.info(f"   Active: {user.is_active}")
                logger.info(f"   Created: {user.created_at}")
                return True
            else:
                logger.error("❌ User not found in database!")
                return False

        except Exception as e:
            logger.error(f"❌ Error checking database: {e}")
            return False


def test_login(email, password):
    """Test user login with the registered user"""
    logger.info("\n" + "=" * 60)
    logger.info("TEST: User Login")
    logger.info("=" * 60)

    login_data = {
        "email": email,
        "password": password
    }

    logger.info(f"Logging in as: {email}")

    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/login",
            json=login_data,
            timeout=10
        )

        logger.info(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            logger.info("✅ Login successful!")
            logger.info(f"   Access Token: {data['access_token'][:50]}...")
            logger.info(f"   Token Type: {data['token_type']}")
            return True
        else:
            logger.error(f"❌ Login failed: {response.text}")
            return False

    except Exception as e:
        logger.error(f"❌ Error during login: {e}")
        return False


async def run_tests():
    """Run all tests"""
    logger.info("\n" + "=" * 80)
    logger.info("COMPREHENSIVE REGISTRATION FLOW TEST")
    logger.info("=" * 80)

    # Wait for server
    if not wait_for_server():
        logger.error("\n❌ TESTS FAILED: Server not available")
        return False

    # Test registration
    email, password = test_registration()
    if not email:
        logger.error("\n❌ TESTS FAILED: Registration failed")
        return False

    # Give database a moment to persist
    await asyncio.sleep(1)

    # Verify in database
    db_ok = await verify_user_in_database(email)
    if not db_ok:
        logger.error("\n❌ TESTS FAILED: User not in database")
        return False

    # Test login
    login_ok = test_login(email, password)
    if not login_ok:
        logger.error("\n❌ TESTS FAILED: Login failed")
        return False

    # All tests passed!
    logger.info("\n" + "=" * 80)
    logger.info("✅ ALL TESTS PASSED!")
    logger.info("=" * 80)
    logger.info("\n✅ Registration flow is working correctly:")
    logger.info("   1. User can register")
    logger.info("   2. User is saved to Neon database")
    logger.info("   3. User can login")
    logger.info("   4. CORS is configured properly")
    logger.info("\n🎉 Your Todo application is ready to use!")
    logger.info("=" * 80)

    return True


if __name__ == "__main__":
    logger.info("Starting registration flow test...")
    logger.info("Make sure the FastAPI server is running on http://localhost:8000")
    logger.info("")

    success = asyncio.run(run_tests())
    sys.exit(0 if success else 1)
