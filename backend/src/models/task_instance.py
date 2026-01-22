from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid


class TaskInstanceBase(SQLModel):
    """
    Base model for TaskInstance with common fields
    """
    recurring_task_id: uuid.UUID = Field(foreign_key="recurring_tasks.id", nullable=False)
    original_task_id: uuid.UUID = Field(foreign_key="tasks.id", nullable=False)
    scheduled_date: datetime = Field(nullable=False)  # When this instance is scheduled
    actual_completion_date: Optional[datetime] = Field(default=None)  # When this instance was completed


class TaskInstance(TaskInstanceBase, table=True):
    """
    TaskInstance model representing individual instances of recurring tasks
    """
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)

    # SQLAlchemy specific column definitions
    __tablename__ = "task_instances"