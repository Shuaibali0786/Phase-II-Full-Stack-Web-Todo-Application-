from sqlmodel.ext.asyncio.session import AsyncSession
from .database import async_session_maker
from ..models.priority import Priority
from ..models.tag import Tag
from ..services.priority_service import PriorityService
from ..services.tag_service import TagService
from uuid import UUID
import logging

logger = logging.getLogger(__name__)


async def seed_default_data_async():
    """
    Seed the database with default priorities using async session.
    This function is idempotent - it only creates priorities if they don't exist.
    """
    async with async_session_maker() as session:
        try:
            # Check if priorities already exist
            existing_priorities = await PriorityService.get_all_priorities(session)

            if not existing_priorities:
                logger.info("No priorities found, creating defaults...")

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
                logger.info("Default priorities created successfully!")
            else:
                logger.info(f"Found {len(existing_priorities)} existing priorities, skipping seed.")

            # We don't seed default tags as they are user-specific
            logger.info("Database seeding completed!")

        except Exception as e:
            logger.error(f"Error during database seeding: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_default_data_async())