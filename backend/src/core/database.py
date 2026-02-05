from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from .config import settings
from typing import AsyncGenerator
import logging

logger = logging.getLogger(__name__)


def get_async_engine() -> AsyncEngine:
    """
    Create and configure the async database engine for Neon PostgreSQL.

    IMPORTANT: For PostgreSQL with async support, we must use:
    - postgresql+asyncpg:// protocol (NOT plain postgresql://)
    - Proper SSL configuration for Neon (in connect_args, NOT URL)
    """
    database_url = settings.DATABASE_URL

    # Validate that we're using PostgreSQL with asyncpg
    if not database_url.startswith("postgresql+asyncpg://"):
        raise ValueError(
            f"DATABASE_URL must use 'postgresql+asyncpg://' driver for async support. "
            f"Current URL starts with: {database_url.split('://')[0]}://"
        )

    logger.info("Connecting to Neon PostgreSQL with asyncpg driver")

    # Create async engine with production-grade configuration
    # CRITICAL FIX: SSL configured in connect_args (NOT ?sslmode=require in URL)
    engine = create_async_engine(
        database_url,
        echo=False,  # Set to True for SQL query logging during debugging
        future=True,
        pool_size=20,  # Connection pool size
        max_overflow=10,  # Additional connections beyond pool_size
        pool_pre_ping=True,  # Verify connections before using them
        pool_recycle=3600,  # Recycle connections after 1 hour
        connect_args={
            "ssl": "require",  # CRITICAL: SSL for asyncpg (NOT sslmode in URL!)
            "server_settings": {
                "application_name": "todo_app",
                "jit": "off"  # Disable JIT compilation for better connection pool performance
            },
            "command_timeout": 60,  # Command timeout in seconds
            "timeout": 10,  # Connection timeout in seconds
        }
    )

    return engine


# Create the global async engine
async_engine = get_async_engine()

# Create async session factory
async_session_maker = sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Don't expire objects after commit
    autocommit=False,
    autoflush=False
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency function to get an async database session.

    This is used with FastAPI's Depends() to inject database sessions
    into route handlers and services.

    Usage:
        @app.post("/items/")
        async def create_item(session: AsyncSession = Depends(get_session)):
            # Use session here
            pass
    """
    async with async_session_maker() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Session error, rolling back: {e}")
            raise
        finally:
            await session.close()


async def create_tables():
    """
    Create all database tables defined in SQLModel models.

    This function must be called during application startup.
    It uses the async engine's run_sync() method because
    SQLModel's metadata.create_all() is synchronous.

    CRITICAL FIX: Import all models FIRST to register them with SQLModel.metadata
    """
    logger.info("Creating database tables in Neon PostgreSQL...")

    # CRITICAL: Import ALL models to register them with SQLModel.metadata
    # This MUST happen before create_all() is called
    from ..models.user import User
    from ..models.task import Task
    from ..models.priority import Priority
    from ..models.tag import Tag
    from ..models.task_tag import TaskTag
    from ..models.recurring_task import RecurringTask
    from ..models.task_instance import TaskInstance
    from ..models.password_reset import PasswordResetToken

    # Log the registered tables for debugging
    logger.info(f"Registered tables: {list(SQLModel.metadata.tables.keys())}")

    try:
        async with async_engine.begin() as conn:
            # Run the synchronous create_all() in an async context
            await conn.run_sync(SQLModel.metadata.create_all)

        logger.info("✅ Database tables created successfully!")

        # Verify tables were created
        async with async_engine.connect() as conn:
            result = await conn.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            tables = result.fetchall()
            logger.info(f"Tables in database: {[t[0] for t in tables]}")

    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        raise


async def drop_tables():
    """
    Drop all database tables. USE WITH CAUTION!
    This is typically only used in development or testing.
    """
    logger.warning("Dropping all database tables...")

    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

    logger.info("All tables dropped!")


async def check_connection():
    """
    Verify database connection is working.
    Returns True if connection is successful, False otherwise.

    CRITICAL FIX: Must use text() wrapper for raw SQL in SQLAlchemy 2.0+
    """
    try:
        async with async_engine.connect() as conn:
            # CRITICAL: Wrap raw SQL with text() for SQLAlchemy 2.0+
            await conn.execute(text("SELECT 1"))
        logger.info("Database connection verified successfully!")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
