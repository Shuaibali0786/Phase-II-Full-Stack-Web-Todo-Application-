from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.models.tag import Tag, TagBase
from src.models.user import User
from src.services.tag_service import TagService
from src.api.deps import get_current_user
from src.core.database import get_session
from typing import List
from pydantic import BaseModel
from uuid import UUID


router = APIRouter()


class CreateTagRequest(BaseModel):
    name: str
    color: str


class TagResponse(BaseModel):
    id: str
    name: str
    color: str
    user_id: str
    created_at: str
    updated_at: str


@router.get("/", response_model=List[TagResponse])
async def get_tags(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get all tags for the current user
    """
    tags = await TagService.get_all_tags_for_user(session, current_user.id)
    return [
        TagResponse(
            id=str(tag.id),
            name=tag.name,
            color=tag.color,
            user_id=str(tag.user_id),
            created_at=tag.created_at.isoformat(),
            updated_at=tag.updated_at.isoformat()
        )
        for tag in tags
    ]


@router.post("/", response_model=TagResponse)
async def create_tag(
    tag_data: CreateTagRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Create a new tag for the current user
    """
    tag_base = TagBase(
        name=tag_data.name,
        color=tag_data.color,
        user_id=current_user.id
    )

    tag = await TagService.create_tag(session, current_user.id, tag_base)

    return TagResponse(
        id=str(tag.id),
        name=tag.name,
        color=tag.color,
        user_id=str(tag.user_id),
        created_at=tag.created_at.isoformat(),
        updated_at=tag.updated_at.isoformat()
    )