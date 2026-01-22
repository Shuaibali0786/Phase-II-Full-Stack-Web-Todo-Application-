from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.models.user import User
from src.services.ai_integration_service import AIIntegrationService
from src.api.deps import get_current_user
from src.core.database import get_session
from typing import Optional
from pydantic import BaseModel


router = APIRouter()


class AIMessageRequest(BaseModel):
    message: str
    context: Optional[dict] = {}


class AIMessageResponse(BaseModel):
    response: str
    actions: Optional[list] = []


@router.post("/chat", response_model=AIMessageResponse)
async def send_ai_message(
    message_data: AIMessageRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Send a message to the AI assistant for natural language task management
    """
    ai_service = AIIntegrationService()
    response = await ai_service.process_message(message_data.message, current_user.id, message_data.context)

    return AIMessageResponse(
        response=response.get("response", ""),
        actions=response.get("actions", [])
    )