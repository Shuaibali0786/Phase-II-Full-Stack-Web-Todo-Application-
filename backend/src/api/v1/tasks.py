from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from src.models.task import Task, TaskBase
from src.models.user import User
from src.services.task_service import TaskService
from src.api.deps import get_current_user
from src.core.database import get_session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from typing import Union
from uuid import UUID


router = APIRouter()


from src.utils.validators import convert_date_string_to_datetime, convert_time_string_to_datetime

class CreateTaskRequest(BaseModel):
    title: str
    description: Optional[str] = None
    priority_id: Optional[UUID] = None
    due_date: Optional[str] = None  # Accepts date string in YYYY-MM-DD format
    reminder_time: Optional[str] = None  # Accepts time string in HH:MM format
    tag_ids: Optional[List[UUID]] = []

    def convert_to_datetime_fields(self):
        """Convert string date/time fields to datetime objects"""
        due_date_dt = convert_date_string_to_datetime(self.due_date)

        # For reminder_time, use the due_date as the date part if available
        reminder_time_dt = None
        if self.reminder_time:
            if due_date_dt:
                # Use the due date as the date part for the reminder
                reminder_time_dt = convert_time_string_to_datetime(self.reminder_time, due_date_dt)
            else:
                # If no due date, use today as the date part
                reminder_time_dt = convert_time_string_to_datetime(self.reminder_time)

        return due_date_dt, reminder_time_dt


class UpdateTaskRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority_id: Optional[UUID] = None
    due_date: Optional[str] = None  # Accepts date string in YYYY-MM-DD format
    reminder_time: Optional[str] = None  # Accepts time string in HH:MM format
    tag_ids: Optional[List[UUID]] = []
    is_completed: Optional[bool] = None

    def convert_to_datetime_fields(self):
        """Convert string date/time fields to datetime objects"""
        due_date_dt = convert_date_string_to_datetime(self.due_date)

        # For reminder_time, use the due_date as the date part if available
        reminder_time_dt = None
        if self.reminder_time:
            if due_date_dt:
                # Use the due date as the date part for the reminder
                reminder_time_dt = convert_time_string_to_datetime(self.reminder_time, due_date_dt)
            else:
                # If no due date, use today as the date part
                reminder_time_dt = convert_time_string_to_datetime(self.reminder_time)

        return due_date_dt, reminder_time_dt


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    is_completed: bool
    user_id: str
    due_date: Optional[str] = None
    reminder_time: Optional[str] = None
    created_at: str
    updated_at: str


class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int
    offset: int
    limit: int


class ToggleCompleteRequest(BaseModel):
    is_completed: bool


@router.get("/", response_model=TaskListResponse)
async def get_tasks(
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
    tag: Optional[str] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    limit: Optional[int] = 50,
    offset: Optional[int] = 0,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get all tasks for the current user
    """
    # Convert string IDs to UUIDs if provided
    priority_uuid = None
    if priority:
        try:
            priority_uuid = UUID(priority)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid priority ID format"
            )

    tag_uuid = None
    if tag:
        try:
            tag_uuid = UUID(tag)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid tag ID format"
            )

    tasks = await TaskService.get_tasks_for_user(
        session, current_user.id, completed, priority_uuid, tag_uuid, sort, order, limit, offset
    )

    task_responses = [
        TaskResponse(
            id=str(task.id),
            title=task.title,
            description=task.description,
            is_completed=task.is_completed,
            user_id=str(task.user_id),
            due_date=task.due_date.isoformat() if task.due_date else None,
            reminder_time=task.reminder_time.isoformat() if task.reminder_time else None,
            created_at=task.created_at.isoformat(),
            updated_at=task.updated_at.isoformat()
        )
        for task in tasks
    ]

    # For simplicity, we're returning the list without total count
    # In a real implementation, you'd want to calculate the total count
    return TaskListResponse(
        tasks=task_responses,
        total=len(task_responses),  # This should be the total count with filters applied
        offset=offset,
        limit=limit
    )


@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: CreateTaskRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Create a new task for the current user
    """
    # Convert string date/time fields to datetime objects
    due_date_dt, reminder_time_dt = task_data.convert_to_datetime_fields()

    task_base = TaskBase(
        title=task_data.title,
        description=task_data.description,
        due_date=due_date_dt,
        reminder_time=reminder_time_dt
    )

    task = await TaskService.create_task(session, current_user.id, task_base, task_data.tag_ids)

    return TaskResponse(
        id=str(task.id),
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=str(task.user_id),
        due_date=task.due_date.isoformat() if task.due_date else None,
        reminder_time=task.reminder_time.isoformat() if task.reminder_time else None,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat()
    )


@router.patch("/{task_id}/complete")
async def toggle_task_completion(
    task_id: UUID,
    body: ToggleCompleteRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Toggle the completion status of a task.
    Expects JSON body: { "is_completed": true/false }
    """
    task = await TaskService.toggle_task_completion(session, task_id, current_user.id, body.is_completed)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=str(task.id),
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=str(task.user_id),
        due_date=task.due_date.isoformat() if task.due_date else None,
        reminder_time=task.reminder_time.isoformat() if task.reminder_time else None,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat()
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Get a specific task by ID
    """
    task = await TaskService.get_task_by_id(session, task_id, current_user.id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=str(task.id),
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=str(task.user_id),
        due_date=task.due_date.isoformat() if task.due_date else None,
        reminder_time=task.reminder_time.isoformat() if task.reminder_time else None,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat()
    )


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_data: UpdateTaskRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Update a specific task
    """
    # Convert string date/time fields to datetime objects
    due_date_dt, reminder_time_dt = task_data.convert_to_datetime_fields()

    update_dict = {}
    if task_data.title is not None:
        update_dict['title'] = task_data.title
    if task_data.description is not None:
        update_dict['description'] = task_data.description
    if task_data.priority_id is not None:
        update_dict['priority_id'] = task_data.priority_id
    if due_date_dt is not None:
        update_dict['due_date'] = due_date_dt
    if reminder_time_dt is not None:
        update_dict['reminder_time'] = reminder_time_dt
    if task_data.is_completed is not None:
        update_dict['is_completed'] = task_data.is_completed

    task = await TaskService.update_task(session, task_id, current_user.id, update_dict, task_data.tag_ids)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskResponse(
        id=str(task.id),
        title=task.title,
        description=task.description,
        is_completed=task.is_completed,
        user_id=str(task.user_id),
        due_date=task.due_date.isoformat() if task.due_date else None,
        reminder_time=task.reminder_time.isoformat() if task.reminder_time else None,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat()
    )


@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """
    Delete a specific task
    """
    success = await TaskService.delete_task(session, task_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"message": "Task deleted successfully"}