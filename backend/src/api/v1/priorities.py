from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.models.priority import Priority, PriorityBase
from src.models.user import User
from src.services.priority_service import PriorityService
from src.api.deps import get_current_user
from src.core.database import get_session
from typing import List
from pydantic import BaseModel


router = APIRouter()


class CreatePriorityRequest(BaseModel):
    name: str
    value: int
    color: str


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