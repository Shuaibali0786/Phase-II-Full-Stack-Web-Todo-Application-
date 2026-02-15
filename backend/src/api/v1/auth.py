import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from src.models.user import User, UserBase
from src.services.auth_service import AuthService
from src.api.deps import get_current_user
from src.core.database import get_session
from src.core.security import verify_token
from typing import Optional
from pydantic import BaseModel, validator
import re

logger = logging.getLogger(__name__)


router = APIRouter()


def validate_email(email: str) -> str:
    """Simple email validation"""
    email = email.lower().strip()
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        raise ValueError('Invalid email format')
    return email


class LoginRequest(BaseModel):
    email: str
    password: str

    @validator('email')
    def validate_email_field(cls, v):
        return validate_email(v)

    @validator('password')
    def password_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Password cannot be empty')
        return v


class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    @validator('email')
    def validate_email_field(cls, v):
        return validate_email(v)

    @validator('password')
    def password_min_length(cls, v):
        if not v or len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/login")
async def login(login_request: LoginRequest, session: AsyncSession = Depends(get_session)):
    """
    Authenticate user and return access/refresh tokens
    """
    try:
        result = await AuthService.authenticate_user(
            session, login_request.email, login_request.password
        )

        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user, access_token, refresh_token = result

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(register_request: RegisterRequest, session: AsyncSession = Depends(get_session)):
    """
    Register a new user account

    FIXED: No email-validator dependency, tables created properly
    """
    try:
        # Email is already validated and normalized by Pydantic validator
        email = register_request.email

        # Create user data model
        user_data = UserBase(
            email=email,
            first_name=register_request.first_name.strip() if register_request.first_name else None,
            last_name=register_request.last_name.strip() if register_request.last_name else None
        )

        logger.info(f"Attempting to register user: {email}")

        # Register the user (no tokens returned - user must login after registration)
        user = await AuthService.register_user_no_tokens(
            session, user_data, register_request.password
        )

        logger.info(f"User registered successfully: {email} (ID: {user.id})")

        return {
            "message": "User registered successfully. Please log in.",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            }
        }

    except ValueError as e:
        # Email already exists or validation error
        logger.warning(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except IntegrityError as e:
        # Database constraint violation (duplicate email)
        logger.error(f"Database integrity error during registration: {str(e)}")
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    except SQLAlchemyError as e:
        # Database error
        logger.error(f"Database error during registration: {str(e)}", exc_info=True)
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred. Please try again."
        )
    except Exception as e:
        # Catch any other unexpected errors
        logger.error(f"Unexpected error during registration: {str(e)}", exc_info=True)
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/logout")
async def logout():
    """
    Log out the current user
    """
    # In a real implementation, you might invalidate the token
    await AuthService.logout_user(None)
    return {"message": "Successfully logged out"}


@router.post("/refresh")
async def refresh(refresh_request: RefreshRequest, session: AsyncSession = Depends(get_session)):
    """
    Refresh access token using refresh token
    """
    try:
        result = await AuthService.refresh_access_token(session, refresh_request.refresh_token)

        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token, refresh_token = result
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error refreshing token"
        )


@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    return {
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
            "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
        }
    }
