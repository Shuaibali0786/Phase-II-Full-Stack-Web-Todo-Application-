from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from ..models.user import User
from ..models.password_reset import PasswordResetToken
from ..core.security import hash_password
from datetime import datetime, timedelta
import secrets
import uuid


class PasswordResetService:
    """
    Service class for handling password reset functionality
    """

    @staticmethod
    async def create_reset_token(session: AsyncSession, email: str) -> bool:
        """
        Create a password reset token for the given email
        Returns True if email exists and token was created, False otherwise
        """
        # Find user by email
        user_statement = select(User).where(User.email == email)
        result = await session.exec(user_statement)
        user = result.first()

        if not user:
            # Even if user doesn't exist, we return True to prevent email enumeration
            return True

        # Delete any existing unused tokens for this user
        existing_tokens_statement = select(PasswordResetToken).where(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False
        )
        existing_tokens_result = await session.exec(existing_tokens_statement)
        existing_tokens = existing_tokens_result.all()

        for token in existing_tokens:
            await session.delete(token)

        # Create a new reset token (valid for 1 hour)
        reset_token = PasswordResetToken(
            user_id=user.id,
            token=secrets.token_urlsafe(32),  # Generate secure random token
            expires_at=datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
        )

        session.add(reset_token)
        await session.commit()

        # In a real application, send email here with the reset token
        # For now, we'll just return the token for demonstration
        return True

    @staticmethod
    async def reset_password(session: AsyncSession, token: str, new_password: str) -> bool:
        """
        Reset password using the given token
        Returns True if successful, False if token is invalid or expired
        """
        # Find the reset token
        token_statement = select(PasswordResetToken).where(
            PasswordResetToken.token == token,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.utcnow()
        )
        result = await session.exec(token_statement)
        reset_token = result.first()

        if not reset_token:
            return False

        # Hash the new password
        hashed_new_password = hash_password(new_password)

        # Update the user's password
        user = await session.get(User, reset_token.user_id)
        if not user:
            return False

        user.hashed_password = hashed_new_password

        # Mark the reset token as used
        reset_token.used = True

        session.add(user)
        session.add(reset_token)
        await session.commit()

        return True

    @staticmethod
    async def cleanup_expired_tokens(session: AsyncSession) -> int:
        """
        Remove expired and used password reset tokens
        Returns the number of tokens deleted
        """
        expired_tokens_statement = select(PasswordResetToken).where(
            (PasswordResetToken.expires_at < datetime.utcnow()) |
            (PasswordResetToken.used == True)
        )
        result = await session.exec(expired_tokens_statement)
        expired_tokens = result.all()

        count = 0
        for token in expired_tokens:
            await session.delete(token)
            count += 1

        if count > 0:
            await session.commit()

        return count