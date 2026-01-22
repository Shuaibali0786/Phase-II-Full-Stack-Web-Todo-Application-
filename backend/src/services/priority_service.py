from sqlmodel import Session, select
from sqlmodel.ext.asyncio.session import AsyncSession
from ..models.priority import Priority, PriorityBase
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from ..utils.validators import validate_hex_color


class PriorityService:
    """
    Service class for handling priority-related operations
    """

    # Async methods
    @staticmethod
    async def create_priority(session: AsyncSession, priority_data: PriorityBase) -> Priority:
        """
        Create a new priority level (async version)
        """
        # Validate hex color
        if not validate_hex_color(priority_data.color):
            raise ValueError("Invalid hex color format")

        priority = Priority(
            name=priority_data.name,
            value=priority_data.value,
            color=priority_data.color
        )
        session.add(priority)
        await session.commit()
        await session.refresh(priority)
        return priority

    @staticmethod
    async def get_priority_by_id(session: AsyncSession, priority_id: UUID) -> Optional[Priority]:
        """
        Get a priority by ID (async version)
        """
        statement = select(Priority).where(Priority.id == priority_id)
        result = await session.exec(statement)
        return result.first()

    @staticmethod
    async def get_priority_by_name(session: AsyncSession, name: str) -> Optional[Priority]:
        """
        Get a priority by name (async version)
        """
        statement = select(Priority).where(Priority.name == name)
        result = await session.exec(statement)
        return result.first()

    @staticmethod
    async def get_all_priorities(session: AsyncSession) -> List[Priority]:
        """
        Get all priority levels (async version)
        """
        statement = select(Priority)
        result = await session.exec(statement)
        return result.all()

    @staticmethod
    async def update_priority(session: AsyncSession, priority_id: UUID, priority_data: dict) -> Optional[Priority]:
        """
        Update a priority's information (async version)
        """
        statement = select(Priority).where(Priority.id == priority_id)
        result = await session.exec(statement)
        priority = result.first()

        if priority:
            # Validate hex color if it's being updated
            if 'color' in priority_data and priority_data['color']:
                if not validate_hex_color(priority_data['color']):
                    raise ValueError("Invalid hex color format")

            for key, value in priority_data.items():
                if hasattr(priority, key) and key != 'id':
                    setattr(priority, key, value)

            priority.updated_at = datetime.utcnow()
            session.add(priority)
            await session.commit()
            await session.refresh(priority)
        return priority

    @staticmethod
    async def delete_priority(session: AsyncSession, priority_id: UUID) -> bool:
        """
        Delete a priority by ID (async version)
        """
        statement = select(Priority).where(Priority.id == priority_id)
        result = await session.exec(statement)
        priority = result.first()

        if priority:
            await session.delete(priority)
            await session.commit()
            return True
        return False

    # Sync methods (for startup and other sync contexts)
    @staticmethod
    def create_priority_sync(session: Session, priority_data: PriorityBase) -> Priority:
        """
        Create a new priority level (sync version)
        """
        # Validate hex color
        if not validate_hex_color(priority_data.color):
            raise ValueError("Invalid hex color format")

        priority = Priority(
            name=priority_data.name,
            value=priority_data.value,
            color=priority_data.color
        )
        session.add(priority)
        session.commit()
        session.refresh(priority)
        return priority

    @staticmethod
    def get_priority_by_id_sync(session: Session, priority_id: UUID) -> Optional[Priority]:
        """
        Get a priority by ID (sync version)
        """
        statement = select(Priority).where(Priority.id == priority_id)
        result = session.exec(statement)
        return result.first()

    @staticmethod
    def get_priority_by_name_sync(session: Session, name: str) -> Optional[Priority]:
        """
        Get a priority by name (sync version)
        """
        statement = select(Priority).where(Priority.name == name)
        result = session.exec(statement)
        return result.first()

    @staticmethod
    def get_all_priorities_sync(session: Session) -> List[Priority]:
        """
        Get all priority levels (sync version)
        """
        statement = select(Priority)
        result = session.exec(statement)
        return result.all()

    @staticmethod
    def update_priority_sync(session: Session, priority_id: UUID, priority_data: dict) -> Optional[Priority]:
        """
        Update a priority's information (sync version)
        """
        statement = select(Priority).where(Priority.id == priority_id)
        result = session.exec(statement)
        priority = result.first()

        if priority:
            # Validate hex color if it's being updated
            if 'color' in priority_data and priority_data['color']:
                if not validate_hex_color(priority_data['color']):
                    raise ValueError("Invalid hex color format")

            for key, value in priority_data.items():
                if hasattr(priority, key) and key != 'id':
                    setattr(priority, key, value)

            priority.updated_at = datetime.utcnow()
            session.add(priority)
            session.commit()
            session.refresh(priority)
        return priority

    @staticmethod
    def delete_priority_sync(session: Session, priority_id: UUID) -> bool:
        """
        Delete a priority by ID (sync version)
        """
        statement = select(Priority).where(Priority.id == priority_id)
        result = session.exec(statement)
        priority = result.first()

        if priority:
            session.delete(priority)
            session.commit()
            return True
        return False