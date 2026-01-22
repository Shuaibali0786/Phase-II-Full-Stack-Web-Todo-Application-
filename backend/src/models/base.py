from sqlmodel import SQLModel
from typing import Optional
from pydantic import BaseModel


class BaseSQLModel(SQLModel):
    """
    Base class for all SQLModel models
    """
    pass


class Token(BaseModel):
    """
    Token response model
    """
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """
    Token data model
    """
    username: Optional[str] = None