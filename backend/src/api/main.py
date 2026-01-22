from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.auth import router as auth_router
from src.api.v1.users import router as users_router
from src.api.v1.tasks import router as tasks_router
from src.api.v1.priorities import router as priorities_router
from src.api.v1.tags import router as tags_router
from src.api.v1.ai_chat import router as ai_chat_router
from src.api.v1.password_reset import router as password_reset_router


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application
    """
    app = FastAPI(
        title="Todo Application API",
        description="API for the Evolution of Todo application",
        version="1.0.0",
    )

    # Add CORS middleware - Allow all origins per spec clarification (2026-01-17)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routers
    app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
    app.include_router(users_router, prefix="/api/v1", tags=["users"])
    app.include_router(tasks_router, prefix="/api/v1", tags=["tasks"])
    app.include_router(priorities_router, prefix="/api/v1", tags=["priorities"])
    app.include_router(tags_router, prefix="/api/v1", tags=["tags"])
    app.include_router(ai_chat_router, prefix="/api/v1", tags=["ai"])
    app.include_router(password_reset_router, prefix="/api/v1", tags=["password-reset"])

    return app


app = create_app()


@app.get("/")
def read_root():
    """
    Root endpoint for health check
    """
    return {"message": "Todo Application API is running!"}


@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "todo-api"}