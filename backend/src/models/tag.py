from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid
from .user import User


class TagBase(SQLModel):
    """
    Base model for Tag with common fields
    """
    name: str = Field(nullable=False, max_length=50)
    color: str = Field(nullable=False, max_length=7)  # Hex color code like #FF0000
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)


class Tag(TagBase, table=True):
    """
    Tag model representing user-defined labels for categorizing tasks
    """
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    user: User = Relationship(back_populates="tags")
    task_tags: list["TaskTag"] = Relationship(back_populates="tag")

    # SQLAlchemy specific column definitions
    __tablename__ = "tags"