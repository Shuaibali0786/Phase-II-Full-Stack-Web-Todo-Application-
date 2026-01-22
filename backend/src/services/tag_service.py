from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from ..models.tag import Tag, TagBase
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from ..utils.validators import validate_hex_color


class TagService:
    """
    Service class for handling tag-related operations
    """

    @staticmethod
    async def create_tag(session: AsyncSession, user_id: UUID, tag_data: TagBase) -> Tag:
        """
        Create a new tag for a specific user
        """
        # Validate hex color
        if not validate_hex_color(tag_data.color):
            raise ValueError("Invalid hex color format")

        tag = Tag(
            name=tag_data.name,
            color=tag_data.color,
            user_id=user_id
        )
        session.add(tag)
        await session.commit()
        await session.refresh(tag)
        return tag

    @staticmethod
    async def get_tag_by_id(session: AsyncSession, tag_id: UUID, user_id: UUID) -> Optional[Tag]:
        """
        Get a tag by ID for a specific user (enforcing user ownership)
        """
        statement = select(Tag).where(Tag.id == tag_id, Tag.user_id == user_id)
        result = await session.exec(statement)
        return result.first()

    @staticmethod
    async def get_all_tags_for_user(session: AsyncSession, user_id: UUID) -> List[Tag]:
        """
        Get all tags for a specific user
        """
        statement = select(Tag).where(Tag.user_id == user_id)
        result = await session.exec(statement)
        return result.all()

    @staticmethod
    async def update_tag(session: AsyncSession, tag_id: UUID, user_id: UUID, tag_data: dict) -> Optional[Tag]:
        """
        Update a tag if it belongs to the user
        """
        tag = await TagService.get_tag_by_id(session, tag_id, user_id)
        if tag:
            # Validate hex color if it's being updated
            if 'color' in tag_data and tag_data['color']:
                if not validate_hex_color(tag_data['color']):
                    raise ValueError("Invalid hex color format")

            for key, value in tag_data.items():
                if hasattr(tag, key) and key != 'id' and key != 'user_id':
                    setattr(tag, key, value)

            tag.updated_at = datetime.utcnow()
            session.add(tag)
            await session.commit()
            await session.refresh(tag)
        return tag

    @staticmethod
    async def delete_tag(session: AsyncSession, tag_id: UUID, user_id: UUID) -> bool:
        """
        Delete a tag if it belongs to the user
        """
        tag = await TagService.get_tag_by_id(session, tag_id, user_id)
        if tag:
            await session.delete(tag)
            await session.commit()
            return True
        return False