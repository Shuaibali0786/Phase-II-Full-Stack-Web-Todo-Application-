import asyncio
from src.core.database import create_tables, get_session
from src.models.user import User
from src.models.priority import Priority
from src.models.tag import Tag
from src.models.task import Task
from src.core.security import hash_password
from datetime import datetime
import uuid

async def seed_database():
    print("Creating database tables...")
    await create_tables()

    print("Seeding database...")
    async for session in get_session():
        try:
            # Create test user
            test_user = User(
                id=uuid.uuid4(),
                email="test@example.com",
                hashed_password=hash_password("password123"),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(test_user)
            await session.commit()
            await session.refresh(test_user)
            print(f"✅ Created test user: test@example.com / password123")

            # Create default priorities
            priorities = [
                Priority(id=uuid.uuid4(), name="Low", value=1, color="#22c55e", created_at=datetime.utcnow(), updated_at=datetime.utcnow()),
                Priority(id=uuid.uuid4(), name="Medium", value=2, color="#eab308", created_at=datetime.utcnow(), updated_at=datetime.utcnow()),
                Priority(id=uuid.uuid4(), name="High", value=3, color="#f97316", created_at=datetime.utcnow(), updated_at=datetime.utcnow()),
                Priority(id=uuid.uuid4(), name="Urgent", value=4, color="#ef4444", created_at=datetime.utcnow(), updated_at=datetime.utcnow()),
            ]
            for p in priorities:
                session.add(p)
            await session.commit()
            print(f"✅ Created {len(priorities)} priorities")

            # Create default tags for user
            tags = [
                Tag(id=uuid.uuid4(), name="Work", color="#3b82f6", user_id=test_user.id, created_at=datetime.utcnow(), updated_at=datetime.utcnow()),
                Tag(id=uuid.uuid4(), name="Personal", color="#8b5cf6", user_id=test_user.id, created_at=datetime.utcnow(), updated_at=datetime.utcnow()),
                Tag(id=uuid.uuid4(), name="Urgent", color="#ef4444", user_id=test_user.id, created_at=datetime.utcnow(), updated_at=datetime.utcnow()),
            ]
            for t in tags:
                session.add(t)
            await session.commit()
            print(f"✅ Created {len(tags)} tags")

            # Create sample tasks
            tasks = [
                Task(
                    id=uuid.uuid4(),
                    title="Complete project documentation",
                    description="Write comprehensive documentation for the project",
                    user_id=test_user.id,
                    priority_id=priorities[1].id,
                    is_completed=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                Task(
                    id=uuid.uuid4(),
                    title="Review pull requests",
                    description="Review pending PRs on GitHub",
                    user_id=test_user.id,
                    priority_id=priorities[2].id,
                    is_completed=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                Task(
                    id=uuid.uuid4(),
                    title="Setup CI/CD pipeline",
                    description="Configure automated testing and deployment",
                    user_id=test_user.id,
                    priority_id=priorities[3].id,
                    is_completed=True,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
            ]
            for task in tasks:
                session.add(task)
            await session.commit()
            print(f"✅ Created {len(tasks)} sample tasks")

            print("\n✅ Database seeded successfully!")
            print("\nTest user credentials:")
            print("  Email: test@example.com")
            print("  Password: password123")

        except Exception as e:
            print(f"❌ Error seeding database: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()
            break

if __name__ == "__main__":
    asyncio.run(seed_database())
