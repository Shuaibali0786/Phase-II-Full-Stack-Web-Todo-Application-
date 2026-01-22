from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid

class PasswordResetTokenBase(SQLModel):
    """
    Base model for Password Reset Token
    """
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    token: str = Field(unique=True, nullable=False, max_length=255)
    expires_at: datetime = Field(nullable=False)
    used: bool = Field(default=False)


class PasswordResetToken(PasswordResetTokenBase, table=True):
    """
    Password Reset Token model for handling password reset requests
    """
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship - using string reference to avoid circular import
    user: "User" = Relationship(back_populates="password_reset_tokens")

    # SQLAlchemy specific column definitions
    __tablename__ = "password_reset_tokens"


class PasswordResetRequest(SQLModel):
    """
    Request model for initiating password reset
    """
    email: str


class PasswordReset(SQLModel):
    """
    Request model for resetting password
    """
    token: str
    new_password: str