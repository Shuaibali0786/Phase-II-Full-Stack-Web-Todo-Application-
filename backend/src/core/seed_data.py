from sqlmodel import Session
from .database import sync_engine
from ..models.priority import Priority
from ..models.tag import Tag
from ..services.priority_service import PriorityService
from ..services.tag_service import TagService
from uuid import UUID


def seed_default_data():
    """
    Seed the database with default priorities and tags (sync version)
    """
    with Session(sync_engine) as session:
        # Check if priorities already exist
        existing_priorities = PriorityService.get_all_priorities_sync(session)
        if not existing_priorities:
            # Create default priorities
            low_priority = Priority(name="Low", value=1, color="#90EE90")
            medium_priority = Priority(name="Medium", value=2, color="#FFD700")
            high_priority = Priority(name="High", value=3, color="#FF6347")
            urgent_priority = Priority(name="Urgent", value=4, color="#DC143C")

            session.add(low_priority)
            session.add(medium_priority)
            session.add(high_priority)
            session.add(urgent_priority)

            session.commit()
            print("Default priorities created successfully!")

        # We don't seed default tags as they are user-specific
        print("Database seeding completed!")


async def seed_default_data_async():
    """
    Async version of seed function (for compatibility)
    """
    from sqlmodel.ext.asyncio.session import AsyncSession
    from .database import engine

    async with AsyncSession(engine) as session:
        # Check if priorities already exist
        existing_priorities = await PriorityService.get_all_priorities(session)
        if not existing_priorities:
            # Create default priorities
            low_priority = Priority(name="Low", value=1, color="#90EE90")
            medium_priority = Priority(name="Medium", value=2, color="#FFD700")
            high_priority = Priority(name="High", value=3, color="#FF6347")
            urgent_priority = Priority(name="Urgent", value=4, color="#DC143C")

            session.add(low_priority)
            session.add(medium_priority)
            session.add(high_priority)
            session.add(urgent_priority)

            await session.commit()
            print("Default priorities created successfully!")

        # We don't seed default tags as they are user-specific
        print("Database seeding completed!")


if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_default_data_async())