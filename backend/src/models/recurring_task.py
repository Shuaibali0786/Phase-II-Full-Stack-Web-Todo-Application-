from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid


class RecurringTaskBase(SQLModel):
    """
    Base model for RecurringTask with common fields
    """
    task_template_id: uuid.UUID = Field(foreign_key="tasks.id", nullable=False)
    recurrence_pattern: str = Field(nullable=False, max_length=20)  # Pattern (daily, weekly, monthly)
    interval: int = Field(default=1)  # Interval multiplier for the pattern
    end_condition: str = Field(nullable=False, max_length=20)  # End condition (after_date, after_occurrences, never)
    end_date: Optional[datetime] = Field(default=None)  # Date to stop recurrence
    max_occurrences: Optional[int] = Field(default=None)  # Maximum number of occurrences


class RecurringTask(RecurringTaskBase, table=True):
    """
    RecurringTask model representing a template for tasks that repeat on a schedule
    """
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)

    # SQLAlchemy specific column definitions
    __tablename__ = "recurring_tasks"