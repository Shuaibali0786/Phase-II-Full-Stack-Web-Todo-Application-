from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from ..models.user import User, UserBase
from ..core.security import hash_password, verify_password
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserService:
    """
    Service class for handling user-related operations
    """

    @staticmethod
    async def create_user(session: AsyncSession, user_data: UserBase, plain_password: str) -> User:
        """
        Create a new user with hashed password
        """
        hashed_pwd = hash_password(plain_password)
        user = User(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            hashed_password=hashed_pwd
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
        """
        Get a user by email
        """
        statement = select(User).where(User.email == email)
        result = await session.exec(statement)
        return result.first()

    @staticmethod
    async def get_user_by_id(session: AsyncSession, user_id: UUID) -> Optional[User]:
        """
        Get a user by ID
        """
        statement = select(User).where(User.id == user_id)
        result = await session.exec(statement)
        return result.first()

    @staticmethod
    async def update_user(session: AsyncSession, user_id: UUID, user_data: dict) -> Optional[User]:
        """
        Update a user's information
        """
        statement = select(User).where(User.id == user_id)
        result = await session.exec(statement)
        user = result.first()

        if user:
            for key, value in user_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            user.updated_at = datetime.utcnow()
            session.add(user)
            await session.commit()
            await session.refresh(user)
        return user

    @staticmethod
    async def delete_user(session: AsyncSession, user_id: UUID) -> bool:
        """
        Delete a user by ID
        """
        statement = select(User).where(User.id == user_id)
        result = await session.exec(statement)
        user = result.first()

        if user:
            await session.delete(user)
            await session.commit()
            return True
        return False

    @staticmethod
    async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password
        """
        user = await UserService.get_user_by_email(session, email)
        if user and verify_password(password, user.hashed_password):
            return user
        return None