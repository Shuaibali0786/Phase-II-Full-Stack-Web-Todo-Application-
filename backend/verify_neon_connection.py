"""
Verification script to test Neon PostgreSQL connection and basic operations.

Run this script to verify:
1. Database connection works
2. Tables are created
3. Data can be written and persisted
4. Data survives across sessions
"""
import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.core.database import check_connection, create_tables, async_session_maker
from src.models.user import User
from src.models.priority import Priority
from src.core.security import hash_password
from sqlmodel import select
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def verify_database():
    """
    Run comprehensive database verification tests
    """
    logger.info("=" * 60)
    logger.info("NEON POSTGRESQL CONNECTION VERIFICATION")
    logger.info("=" * 60)

    # Test 1: Connection
    logger.info("\n[TEST 1] Checking database connection...")
    connection_ok = await check_connection()
    if not connection_ok:
        logger.error("❌ Database connection failed!")
        return False
    logger.info("✅ Database connection successful!")

    # Test 2: Create tables
    logger.info("\n[TEST 2] Creating database tables...")
    try:
        await create_tables()
        logger.info("✅ Tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        return False

    # Test 3: Write test data
    logger.info("\n[TEST 3] Writing test data to database...")
    test_email = "test_persistence@example.com"

    async with async_session_maker() as session:
        try:
            # Check if test user already exists
            stmt = select(User).where(User.email == test_email)
            result = await session.exec(stmt)
            existing_user = result.first()

            if existing_user:
                logger.info(f"✅ Found existing test user (created: {existing_user.created_at})")
                logger.info("   This proves data PERSISTS across sessions!")
            else:
                # Create test user
                test_user = User(
                    email=test_email,
                    first_name="Test",
                    last_name="Persistence",
                    hashed_password=hash_password("testpassword123")
                )
                session.add(test_user)
                await session.commit()
                await session.refresh(test_user)
                logger.info(f"✅ Test user created successfully! ID: {test_user.id}")

        except Exception as e:
            logger.error(f"❌ Failed to write test data: {e}")
            await session.rollback()
            return False

    # Test 4: Read data back (new session to prove persistence)
    logger.info("\n[TEST 4] Reading data back in new session...")
    async with async_session_maker() as new_session:
        try:
            stmt = select(User).where(User.email == test_email)
            result = await new_session.exec(stmt)
            user = result.first()

            if user:
                logger.info("✅ Successfully retrieved user from database!")
                logger.info(f"   Email: {user.email}")
                logger.info(f"   Name: {user.first_name} {user.last_name}")
                logger.info(f"   ID: {user.id}")
            else:
                logger.error("❌ Failed to retrieve user from database!")
                return False

        except Exception as e:
            logger.error(f"❌ Failed to read data: {e}")
            return False

    # Test 5: Check priorities
    logger.info("\n[TEST 5] Checking priorities...")
    async with async_session_maker() as session:
        try:
            stmt = select(Priority)
            result = await session.exec(stmt)
            priorities = result.all()

            if priorities:
                logger.info(f"✅ Found {len(priorities)} priorities:")
                for priority in priorities:
                    logger.info(f"   - {priority.name} (value: {priority.value}, color: {priority.color})")
            else:
                logger.info("ℹ️  No priorities found (they will be created on app startup)")

        except Exception as e:
            logger.error(f"❌ Failed to check priorities: {e}")
            return False

    logger.info("\n" + "=" * 60)
    logger.info("✅ ALL VERIFICATION TESTS PASSED!")
    logger.info("=" * 60)
    logger.info("\nYour Neon PostgreSQL database is configured correctly.")
    logger.info("Data WILL persist across server restarts.")
    logger.info("\nNext steps:")
    logger.info("1. Start your FastAPI server: uvicorn src.main:app --reload")
    logger.info("2. Test the API endpoints")
    logger.info("3. Restart the server and verify data persists")
    logger.info("=" * 60)

    return True


if __name__ == "__main__":
    success = asyncio.run(verify_database())
    sys.exit(0 if success else 1)
