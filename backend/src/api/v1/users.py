from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.models.user import User
from src.api.deps import get_current_user
from src.core.database import get_session
from typing import Optional
from pydantic import BaseModel


router = APIRouter()


class UpdateUserRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None


@router.get("/me")
async def get_current_user_profile(current_user: User = Depends(get_current_user)) -> User:
    """
    Get the profile of the current authenticated user
    """
    return current_user


@router.put("/me")
async def update_current_user_profile(
    update_data: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Update the profile of the current authenticated user
    """
    # Normalize email to lowercase (consistent with registration)
    normalized_email = update_data.email.strip().lower() if update_data.email else None

    # Check if email is being changed and if it's already taken by another user
    if normalized_email and normalized_email != current_user.email:
        existing_user_statement = select(User).where(User.email == normalized_email)
        result = await session.exec(existing_user_statement)
        existing_user = result.first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered by another user"
            )

    # Update user fields
    if update_data.first_name is not None:
        current_user.first_name = update_data.first_name
    if update_data.last_name is not None:
        current_user.last_name = update_data.last_name
    if normalized_email is not None:
        current_user.email = normalized_email

    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)

    return {
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
            "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None
        }
    }