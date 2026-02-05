from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from ..models.user import User, UserBase
from ..core.security import hash_password, verify_password
from typing import Optional
from uuid import UUID
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class UserService:
    """
    Service class for handling user-related operations

    FIXED: Proper async session handling with commit/refresh for Neon PostgreSQL
    """

    @staticmethod
    async def create_user(session: AsyncSession, user_data: UserBase, plain_password: str) -> User:
        """
        Create a new user with hashed password

        CRITICAL: Ensures proper commit and refresh for Neon PostgreSQL persistence
        """
        try:
            # Hash the password
            hashed_pwd = hash_password(plain_password)

            # Create user object
            user = User(
                email=user_data.email,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                hashed_password=hashed_pwd,
                is_active=True
            )

            # Add to session
            session.add(user)

            # CRITICAL: Commit to Neon PostgreSQL
            await session.commit()

            # CRITICAL: Refresh to get database-generated values (id, timestamps)
            await session.refresh(user)

            logger.info(f"User created successfully: {user.email} (ID: {user.id})")

            return user

        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            await session.rollback()
            raise

    @staticmethod
    async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
        """
        Get a user by email
        """
        try:
            statement = select(User).where(User.email == email.lower().strip())
            result = await session.exec(statement)
            return result.first()
        except Exception as e:
            logger.error(f"Error fetching user by email: {str(e)}")
            raise

    @staticmethod
    async def get_user_by_id(session: AsyncSession, user_id: UUID) -> Optional[User]:
        """
        Get a user by ID
        """
        try:
            statement = select(User).where(User.id == user_id)
            result = await session.exec(statement)
            return result.first()
        except Exception as e:
            logger.error(f"Error fetching user by ID: {str(e)}")
            raise

    @staticmethod
    async def update_user(session: AsyncSession, user_id: UUID, user_data: dict) -> Optional[User]:
        """
        Update a user's information
        """
        try:
            statement = select(User).where(User.id == user_id)
            result = await session.exec(statement)
            user = result.first()

            if user:
                for key, value in user_data.items():
                    if hasattr(user, key) and key not in ['id', 'created_at']:
                        setattr(user, key, value)

                user.updated_at = datetime.utcnow()
                session.add(user)
                await session.commit()
                await session.refresh(user)

            return user
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            await session.rollback()
            raise

    @staticmethod
    async def delete_user(session: AsyncSession, user_id: UUID) -> bool:
        """
        Delete a user by ID
        """
        try:
            statement = select(User).where(User.id == user_id)
            result = await session.exec(statement)
            user = result.first()

            if user:
                await session.delete(user)
                await session.commit()
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting user: {str(e)}")
            await session.rollback()
            raise

    @staticmethod
    async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password
        """
        try:
            user = await UserService.get_user_by_email(session, email)
            if user and verify_password(password, user.hashed_password):
                return user
            return None
        except Exception as e:
            logger.error(f"Error authenticating user: {str(e)}")
            raise
