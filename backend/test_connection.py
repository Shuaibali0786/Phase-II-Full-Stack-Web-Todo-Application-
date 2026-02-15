import asyncio
from src.core.database import check_connection

async def main():
    print("Testing Neon PostgreSQL connection...")
    success = await check_connection()
    if success:
        print("✅ Connection successful!")
    else:
        print("❌ Connection failed!")
        exit(1)

if __name__ == "__main__":
    asyncio.run(main())
