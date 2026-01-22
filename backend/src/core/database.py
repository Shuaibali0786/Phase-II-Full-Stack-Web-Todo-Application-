from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import create_engine as sync_create_engine
from .config import settings
from typing import AsyncGenerator
import os


# Create both sync and async engines for SQLite
if settings.DATABASE_URL.startswith("sqlite"):
    # For SQLite, we need to use a file path and ensure the directory exists
    db_path = settings.DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

    # Sync engine for operations like table creation and inspection
    sync_engine = sync_create_engine(
        settings.DATABASE_URL,
        echo=False,  # Set to True for SQL query logging
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={"check_same_thread": False}  # Needed for SQLite
    )

    # Async engine for async operations in the app - USE THE PROPER ASYNC DRIVER
    async_engine = create_async_engine(
        settings.DATABASE_URL.replace("sqlite:///", "sqlite+aiosqlite:///"),
        echo=False,  # Set to True for SQL query logging
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={"check_same_thread": False}  # Needed for SQLite
    )
else:
    # Sync engine
    sync_engine = sync_create_engine(
        settings.DATABASE_URL,
        echo=False,  # Set to True for SQL query logging
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )
    # Async engine
    async_engine = create_async_engine(
        settings.DATABASE_URL,
        echo=False,  # Set to True for SQL query logging
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )


# Use the async engine as the main engine for the app
engine = async_engine


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get an async database session for dependency injection
    """
    async with AsyncSession(engine) as session:
        yield session


async def create_tables(db_engine=None):
    """
    Create all database tables synchronously (since SQLModel requires sync operation)
    """
    if db_engine is None:
        db_engine = sync_engine

    # Import all models to register them with SQLModel
    from ..models.user import User
    from ..models.task import Task
    from ..models.priority import Priority
    from ..models.tag import Tag
    from ..models.task_tag import TaskTag
    from ..models.recurring_task import RecurringTask
    from ..models.task_instance import TaskInstance
    from ..models.password_reset import PasswordResetToken

    # Create tables using the sync engine
    SQLModel.metadata.create_all(db_engine)