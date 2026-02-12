from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.models.tag import Tag, TagBase
from src.models.user import User
from src.services.tag_service import TagService
from src.api.deps import get_current_user
from src.core.database import get_session
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID


router = APIRouter()


class CreateTagRequest(BaseModel):
    name: str
    color: str


class UpdateTagRequest(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


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


@router.put("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: UUID,
    tag_data: UpdateTagRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Update a tag (only if owned by current user)
    """
    # Check if tag exists and belongs to user
    existing_tag = await TagService.get_tag_by_id(session, tag_id, current_user.id)
    if not existing_tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found or you don't have permission to modify it"
        )

    # Prepare update data (only non-None values)
    update_data = {
        key: value for key, value in tag_data.model_dump().items()
        if value is not None
    }

    try:
        updated_tag = await TagService.update_tag(session, tag_id, current_user.id, update_data)
        if not updated_tag:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tag not found"
            )

        return TagResponse(
            id=str(updated_tag.id),
            name=updated_tag.name,
            color=updated_tag.color,
            user_id=str(updated_tag.user_id),
            created_at=updated_tag.created_at.isoformat(),
            updated_at=updated_tag.updated_at.isoformat()
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Delete a tag (only if owned by current user)
    Note: This will remove the tag from all associated tasks
    """
    # Check if tag exists and belongs to user
    existing_tag = await TagService.get_tag_by_id(session, tag_id, current_user.id)
    if not existing_tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag not found or you don't have permission to delete it"
        )

    # Delete the tag (database cascade rules should handle task_tag relationships)
    success = await TagService.delete_tag(session, tag_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete tag"
        )

    return None