from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.models.priority import Priority, PriorityBase
from src.models.user import User
from src.services.priority_service import PriorityService
from src.api.deps import get_current_user
from src.core.database import get_session
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID


router = APIRouter()


class CreatePriorityRequest(BaseModel):
    name: str
    value: int
    color: str


class UpdatePriorityRequest(BaseModel):
    name: Optional[str] = None
    value: Optional[int] = None
    color: Optional[str] = None


class PriorityResponse(BaseModel):
    id: str
    name: str
    value: int
    color: str
    created_at: str
    updated_at: str


@router.get("/", response_model=List[PriorityResponse])
async def get_priorities(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get all available priority levels
    """
    priorities = await PriorityService.get_all_priorities(session)
    return [
        PriorityResponse(
            id=str(priority.id),
            name=priority.name,
            value=priority.value,
            color=priority.color,
            created_at=priority.created_at.isoformat(),
            updated_at=priority.updated_at.isoformat()
        )
        for priority in priorities
    ]


@router.post("/", response_model=PriorityResponse)
async def create_priority(
    priority_data: CreatePriorityRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Create a new priority level
    """
    # Check if priority with this name already exists
    existing_priority = await PriorityService.get_priority_by_name(session, priority_data.name)
    if existing_priority:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Priority with this name already exists"
        )

    priority_base = PriorityBase(
        name=priority_data.name,
        value=priority_data.value,
        color=priority_data.color
    )

    priority = await PriorityService.create_priority(session, priority_base)

    return PriorityResponse(
        id=str(priority.id),
        name=priority.name,
        value=priority.value,
        color=priority.color,
        created_at=priority.created_at.isoformat(),
        updated_at=priority.updated_at.isoformat()
    )


@router.put("/{priority_id}", response_model=PriorityResponse)
async def update_priority(
    priority_id: UUID,
    priority_data: UpdatePriorityRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Update an existing priority level
    """
    # Check if priority exists
    existing_priority = await PriorityService.get_priority_by_id(session, priority_id)
    if not existing_priority:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Priority not found"
        )

    # Prepare update data (only non-None values)
    update_data = {
        key: value for key, value in priority_data.model_dump().items()
        if value is not None
    }

    # Check if name is being updated and if it conflicts with existing priority
    if "name" in update_data:
        name_conflict = await PriorityService.get_priority_by_name(session, update_data["name"])
        if name_conflict and name_conflict.id != priority_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Priority with this name already exists"
            )

    try:
        updated_priority = await PriorityService.update_priority(session, priority_id, update_data)
        if not updated_priority:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Priority not found"
            )

        return PriorityResponse(
            id=str(updated_priority.id),
            name=updated_priority.name,
            value=updated_priority.value,
            color=updated_priority.color,
            created_at=updated_priority.created_at.isoformat(),
            updated_at=updated_priority.updated_at.isoformat()
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{priority_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_priority(
    priority_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Delete a priority level
    Note: This will set all tasks using this priority to have no priority
    """
    # Check if priority exists
    existing_priority = await PriorityService.get_priority_by_id(session, priority_id)
    if not existing_priority:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Priority not found"
        )

    # Delete the priority (database cascade rules should handle task relationships)
    success = await PriorityService.delete_priority(session, priority_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete priority"
        )

    return None