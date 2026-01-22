from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid
from .task import Task
from .tag import Tag


class TaskTagBase(SQLModel):
    """
    Base model for TaskTag with common fields
    """
    task_id: uuid.UUID = Field(foreign_key="tasks.id", nullable=False)
    tag_id: uuid.UUID = Field(foreign_key="tags.id", nullable=False)


class TaskTag(TaskTagBase, table=True):
    """
    TaskTag model representing the many-to-many relationship between tasks and tags
    """
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    task: Task = Relationship()
    tag: Tag = Relationship()

    # SQLAlchemy specific column definitions
    __tablename__ = "task_tags"