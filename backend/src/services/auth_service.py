from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from ..models.user import User, UserBase
from ..core.security import create_access_token, create_refresh_token, verify_token, verify_password, hash_password
from ..core.config import settings
from datetime import timedelta
from typing import Optional, Tuple
from uuid import UUID


class AuthService:
    """
    Service class for handling authentication operations
    """

    @staticmethod
    async def register_user(session: AsyncSession, user_data: UserBase, password: str) -> Tuple[User, str, str]:
        """
        Register a new user and return user object with tokens
        """
        # Check if user already exists
        existing_user_statement = select(User).where(User.email == user_data.email)
        result = await session.exec(existing_user_statement)
        existing_user = result.first()

        if existing_user:
            raise ValueError("Email already registered")

        # Create the user using UserService
        from .user_service import UserService
        user = await UserService.create_user(session, user_data, password)

        # Create tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(data={"sub": user.email})

        return user, access_token, refresh_token

    @staticmethod
    async def register_user_no_tokens(session: AsyncSession, user_data: UserBase, password: str) -> User:
        """
        Register a new user without returning tokens (for registration flow)
        User must manually login after registration
        """
        # Check if user already exists
        existing_user_statement = select(User).where(User.email == user_data.email)
        result = await session.exec(existing_user_statement)
        existing_user = result.first()

        if existing_user:
            raise ValueError("Email already registered")

        # Create the user using UserService
        from .user_service import UserService
        user = await UserService.create_user(session, user_data, password)

        return user

    @staticmethod
    async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[Tuple[User, str, str]]:
        """
        Authenticate a user and return user object with tokens if successful
        """
        from .user_service import UserService
        user = await UserService.authenticate_user(session, email, password)

        if user:
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.email}, expires_delta=access_token_expires
            )
            refresh_token = create_refresh_token(data={"sub": user.email})
            return user, access_token, refresh_token

        return None

    @staticmethod
    async def refresh_access_token(session: AsyncSession, refresh_token: str) -> Optional[Tuple[str, str]]:
        """
        Refresh the access token using a refresh token
        """
        payload = verify_token(refresh_token)
        if payload and payload.get("type") == "refresh":
            email = payload.get("sub")
            if email:
                statement = select(User).where(User.email == email)
                result = await session.exec(statement)
                user = result.first()

                if user:
                    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
                    new_access_token = create_access_token(
                        data={"sub": user.email}, expires_delta=access_token_expires
                    )
                    new_refresh_token = create_refresh_token(data={"sub": user.email})
                    return new_access_token, new_refresh_token

        return None

    @staticmethod
    async def logout_user(user_id: Optional[UUID]) -> bool:
        """
        Perform logout operations (currently just a placeholder)
        In a real implementation, you might add the token to a blacklist
        """
        # In a real implementation, add the token to a blacklist
        return True