from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid
from .user import User
from .priority import Priority


class TaskBase(SQLModel):
    """
    Base model for Task with common fields
    """
    title: str = Field(nullable=False, max_length=255)
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    due_date: Optional[datetime] = Field(default=None)
    reminder_time: Optional[datetime] = Field(default=None)


class Task(TaskBase, table=True):
    """
    Task model representing a todo item created by a user
    """
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    priority_id: Optional[uuid.UUID] = Field(foreign_key="priorities.id", default=None)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    user: User = Relationship(back_populates="tasks")
    priority: Optional[Priority] = Relationship()

    # SQLAlchemy specific column definitions
    __tablename__ = "tasks"