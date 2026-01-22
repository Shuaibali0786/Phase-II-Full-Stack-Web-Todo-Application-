from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid


class PriorityBase(SQLModel):
    """
    Base model for Priority with common fields
    """
    name: str = Field(nullable=False, max_length=50, unique=True)  # Priority name (e.g., "Low", "Medium", "High")
    value: int = Field(nullable=False)  # Numeric value for sorting (e.g., 1 for Low, 2 for Medium, 3 for High)
    color: str = Field(nullable=False, max_length=7)  # Hex color code for UI display


class Priority(PriorityBase, table=True):
    """
    Priority model representing priority levels for organizing tasks
    """
    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4,
        primary_key=True
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, nullable=False)

    # SQLAlchemy specific column definitions
    __tablename__ = "priorities"