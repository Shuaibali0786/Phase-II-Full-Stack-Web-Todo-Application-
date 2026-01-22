from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

from ...models.password_reset import PasswordResetRequest, PasswordReset
from ...services.password_reset_service import PasswordResetService
from ...core.database import get_session
from ...utils.validators import validate_password_strength


router = APIRouter()


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Initiate password reset process by sending a reset token to the user's email
    """
    success = await PasswordResetService.create_reset_token(session, request.email)

    if success:
        # In a real application, we would send an email with the reset link
        # For now, we just return a success message
        return {
            "message": "If an account exists with this email, a password reset link has been sent."
        }
    else:
        # Even if unsuccessful, we return the same message to prevent email enumeration
        return {
            "message": "If an account exists with this email, a password reset link has been sent."
        }


@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Reset password using the provided token
    """
    # Validate password strength
    if not validate_password_strength(request.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password does not meet strength requirements (8+ characters, uppercase, lowercase, digit, special character)"
        )

    success = await PasswordResetService.reset_password(
        session,
        request.token,
        request.new_password
    )

    if success:
        return {
            "message": "Password has been successfully reset. You can now log in with your new password."
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token. Please request a new password reset."
        )