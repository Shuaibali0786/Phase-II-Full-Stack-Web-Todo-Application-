from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from ..models.task import Task, TaskBase
from ..models.user import User
from ..models.priority import Priority
from ..models.tag import Tag
from ..models.task_tag import TaskTag
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from ..utils.validators import validate_title_length, validate_due_date_not_past


class TaskService:
    """
    Service class for handling task-related operations
    """

    @staticmethod
    async def create_task(session: AsyncSession, user_id: UUID, task_data: TaskBase, tag_ids: Optional[List[UUID]] = None) -> Task:
        """
        Create a new task for a user
        """
        # Validate the task data
        if not validate_title_length(task_data.title):
            raise ValueError("Task title must be between 1 and 255 characters")

        if not validate_due_date_not_past(task_data.due_date):
            raise ValueError("Due date cannot be in the past")

        task = Task(
            title=task_data.title,
            description=task_data.description,
            user_id=user_id,
            due_date=task_data.due_date,
            reminder_time=task_data.reminder_time
        )

        session.add(task)
        await session.flush()  # Get the task ID before creating relationships

        # Add tags to the task if provided
        if tag_ids:
            for tag_id in tag_ids:
                task_tag = TaskTag(
                    task_id=task.id,
                    tag_id=tag_id
                )
                session.add(task_tag)

        await session.commit()
        await session.refresh(task)
        return task

    @staticmethod
    async def get_task_by_id(session: AsyncSession, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """
        Get a task by ID for a specific user (enforcing user ownership)
        """
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await session.exec(statement)
        return result.first()

    @staticmethod
    async def get_tasks_for_user(
        session: AsyncSession,
        user_id: UUID,
        completed: Optional[bool] = None,
        priority_id: Optional[UUID] = None,
        tag_id: Optional[UUID] = None,
        sort_field: Optional[str] = "created_at",
        sort_order: Optional[str] = "desc",
        limit: Optional[int] = 50,
        offset: Optional[int] = 0
    ) -> List[Task]:
        """
        Get all tasks for a user with optional filters
        """
        statement = select(Task).where(Task.user_id == user_id)

        # Apply filters
        if completed is not None:
            statement = statement.where(Task.is_completed == completed)
        if priority_id is not None:
            statement = statement.where(Task.priority_id == priority_id)
        if tag_id is not None:
            # Join with TaskTag to filter by tag
            statement = statement.join(TaskTag).where(TaskTag.tag_id == tag_id)

        # Apply sorting
        if sort_field == "created_at":
            if sort_order == "asc":
                statement = statement.order_by(Task.created_at)
            else:
                statement = statement.order_by(Task.created_at.desc())
        elif sort_field == "due_date":
            if sort_order == "asc":
                statement = statement.order_by(Task.due_date)
            else:
                statement = statement.order_by(Task.due_date.desc())
        elif sort_field == "priority":
            if sort_order == "asc":
                statement = statement.order_by(Task.priority_id)
            else:
                statement = statement.order_by(Task.priority_id.desc())

        # Apply pagination
        statement = statement.offset(offset).limit(limit)

        result = await session.exec(statement)
        return result.all()

    @staticmethod
    async def update_task(session: AsyncSession, task_id: UUID, user_id: UUID, task_data: dict, tag_ids: Optional[List[UUID]] = None) -> Optional[Task]:
        """
        Update a task if it belongs to the user
        """
        task = await TaskService.get_task_by_id(session, task_id, user_id)
        if task:
            # Validate the update data
            if 'title' in task_data and task_data['title'] is not None:
                if not validate_title_length(task_data['title']):
                    raise ValueError("Task title must be between 1 and 255 characters")

            if 'due_date' in task_data and task_data['due_date'] is not None:
                if not validate_due_date_not_past(task_data['due_date']):
                    raise ValueError("Due date cannot be in the past")

            # Update the task
            for key, value in task_data.items():
                if hasattr(task, key) and key != 'id' and key != 'user_id':
                    setattr(task, key, value)

            task.updated_at = datetime.utcnow()
            session.add(task)

            # Handle tag associations if provided
            if tag_ids is not None:
                # First, remove all existing tag associations
                existing_task_tags_stmt = select(TaskTag).where(TaskTag.task_id == task.id)
                existing_task_tags_result = await session.exec(existing_task_tags_stmt)
                existing_task_tags = existing_task_tags_result.all()

                for task_tag in existing_task_tags:
                    await session.delete(task_tag)

                # Then add the new tag associations
                for tag_id in tag_ids:
                    task_tag = TaskTag(
                        task_id=task.id,
                        tag_id=tag_id
                    )
                    session.add(task_tag)

            await session.commit()
            await session.refresh(task)
        return task

    @staticmethod
    async def delete_task(session: AsyncSession, task_id: UUID, user_id: UUID) -> bool:
        """
        Delete a task if it belongs to the user
        """
        task = await TaskService.get_task_by_id(session, task_id, user_id)
        if task:
            await session.delete(task)
            await session.commit()
            return True
        return False

    @staticmethod
    async def toggle_task_completion(session: AsyncSession, task_id: UUID, user_id: UUID, is_completed: bool) -> Optional[Task]:
        """
        Toggle the completion status of a task
        """
        task = await TaskService.get_task_by_id(session, task_id, user_id)
        if task:
            task.is_completed = is_completed
            task.updated_at = datetime.utcnow()
            session.add(task)
            await session.commit()
            await session.refresh(task)
        return task