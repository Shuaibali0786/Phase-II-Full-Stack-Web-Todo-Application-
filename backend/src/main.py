from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.auth import router as auth_router
from src.api.v1.users import router as users_router
from src.api.v1.tasks import router as tasks_router
from src.api.v1.priorities import router as priorities_router
from src.api.v1.tags import router as tags_router
from src.api.v1.ai_chat import router as ai_chat_router
from src.core.database import create_tables, check_connection
import logging

# CRITICAL: Import all models early to register them with SQLModel.metadata
# This ensures create_tables() will know about all models
from src.models.user import User
from src.models.task import Task
from src.models.priority import Priority
from src.models.tag import Tag
from src.models.task_tag import TaskTag
from src.models.recurring_task import RecurringTask
from src.models.task_instance import TaskInstance
from src.models.password_reset import PasswordResetToken

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application
    """
    app = FastAPI(
        title="Todo Application API",
        description="API for the Evolution of Todo application - PostgreSQL Edition",
        version="2.0.0",
    )

    # Add CORS middleware - CRITICAL: Explicit origins required when allow_credentials=True
    # Browser security prevents allow_origins=["*"] with allow_credentials=True
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",  # Next.js dev server
            "http://127.0.0.1:3000",  # Alternative localhost
            "http://localhost:3001",  # Alternative port
            "http://localhost:8080",  # Mobile dev server
        ],
        allow_credentials=True,  # Required for cookies/auth headers
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["*"],  # Allow frontend to read response headers
        max_age=3600,  # Cache preflight requests for 1 hour
    )

    # Include API routers
    app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
    app.include_router(users_router, prefix="/api/v1", tags=["users"])
    app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["tasks"])
    app.include_router(priorities_router, prefix="/api/v1/priorities", tags=["priorities"])
    app.include_router(tags_router, prefix="/api/v1/tags", tags=["tags"])
    app.include_router(ai_chat_router, prefix="/api/v1", tags=["ai"])

    @app.on_event("startup")
    async def startup_event():
        """
        Initialize database connection and create tables on startup.
        This runs once when the FastAPI application starts.

        CRITICAL FIX: Proper error handling and table creation
        """
        try:
            logger.info("=" * 60)
            logger.info("🚀 Starting Todo Application API...")
            logger.info("=" * 60)

            # Step 1: Check database connection
            logger.info("📡 [1/3] Checking database connection...")
            connection_ok = await check_connection()
            if not connection_ok:
                logger.error("❌ Failed to connect to database! Check your DATABASE_URL.")
                raise RuntimeError("Database connection failed")

            logger.info("✅ Database connection successful!")

            # Step 2: Create all tables in Neon PostgreSQL
            logger.info("🗄️  [2/3] Creating database tables...")
            await create_tables()
            logger.info("✅ Database tables created successfully!")

            # Step 3: Seed default data (priorities)
            logger.info("🌱 [3/3] Seeding default data...")
            from src.core.seed_data import seed_default_data_async
            await seed_default_data_async()
            logger.info("✅ Default data seeded!")

            logger.info("=" * 60)
            logger.info("✅ Application startup complete - Ready to accept requests!")
            logger.info("=" * 60)

        except Exception as e:
            logger.error("=" * 60)
            logger.error(f"❌ STARTUP FAILED: {str(e)}")
            logger.error("=" * 60)
            import traceback
            logger.error(traceback.format_exc())
            raise

    @app.on_event("shutdown")
    async def shutdown_event():
        """
        Cleanup on application shutdown
        """
        logger.info("Shutting down Todo Application API...")
        from src.core.database import async_engine
        await async_engine.dispose()
        logger.info("Database connections closed")

    return app


app = create_app()


@app.get("/")
def read_root():
    """
    Root endpoint for health check
    """
    return {
        "message": "Todo Application API is running!",
        "database": "Neon PostgreSQL",
        "version": "2.0.0"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint with database connectivity check
    """
    from src.core.database import check_connection
    db_healthy = await check_connection()

    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "service": "todo-api",
        "database": "connected" if db_healthy else "disconnected"
    }
