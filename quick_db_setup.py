#!/usr/bin/env python3
"""
Quick Database Setup Script for Todo App
This script assumes a standard PostgreSQL installation and tries common passwords
"""

import os
import subprocess
import sys
from pathlib import Path

def try_create_database():
    print("Attempting to create PostgreSQL database for Todo App...")

    # Common default passwords for PostgreSQL
    common_passwords = [
        "",  # no password
        "postgres",  # default in some installations
        "password",  # common default
        "root",  # sometimes used
    ]

    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)

    # Try each common password
    for password in common_passwords:
        print(f"\nTrying password: '{password or '(empty)'}'")

        # Set the password as environment variable
        env_vars = os.environ.copy()
        env_vars['PGPASSWORD'] = password

        try:
            # Test connection first
            test_result = subprocess.run([
                "C:/Program Files/PostgreSQL/18/bin/psql.exe",
                "-U", "postgres",
                "-h", "localhost",
                "-p", "5432",
                "-d", "postgres",
                "-c", "SELECT 1;"
            ], env=env_vars, capture_output=True, text=True, timeout=10)

            if test_result.returncode == 0:
                print(f"✓ Successfully connected with password: '{password or '(empty)'}'")

                # Update the .env file with the working password
                env_file = backend_dir / ".env"
                with open(env_file, 'r') as f:
                    env_content = f.read()

                # Replace the database URL with the working password
                lines = env_content.split('\n')
                for i, line in enumerate(lines):
                    if line.startswith('DATABASE_URL='):
                        # Extract parts: postgresql://user:oldpass@host:port/dbname
                        db_part = line.split('://')[1]
                        user_pass = db_part.split('@')[0]
                        host_port_db = db_part.split('@')[1]

                        user = user_pass.split(':')[0]
                        new_line = f"DATABASE_URL=postgresql://{user}:{password}@{host_port_db}"
                        lines[i] = new_line
                        break

                with open(env_file, 'w') as f:
                    f.write('\n'.join(lines))

                print(f"✓ Updated .env file with the working password")

                # Try to create the database
                create_result = subprocess.run([
                    "C:/Program Files/PostgreSQL/18/bin/createdb.exe",
                    "-U", "postgres",
                    "-h", "localhost",
                    "-p", "5432",
                    "todo_app"
                ], env=env_vars, capture_output=True, text=True)

                if create_result.returncode == 0:
                    print("✓ Database 'todo_app' created successfully!")
                elif "already exists" in create_result.stderr.lower():
                    print("✓ Database 'todo_app' already exists.")
                else:
                    print(f"✗ Could not create database: {create_result.stderr}")

                # Now try to initialize the tables
                print("Initializing database tables...")

                # Add the backend directory to Python path
                sys.path.insert(0, str(backend_dir))

                # Reload environment variables
                from dotenv import load_dotenv
                load_dotenv()

                from src.core.database import init_db
                init_db()
                print("✓ Database tables initialized successfully!")

                return True

        except subprocess.TimeoutExpired:
            print("  Connection timed out")
            continue
        except Exception as e:
            print(f"  Error: {str(e)}")
            continue

    print("\n✗ Could not connect with any common passwords.")
    print("Please update the password in backend/.env manually.")
    return False

if __name__ == "__main__":
    # Install python-dotenv if not available
    try:
        import dotenv
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "python-dotenv"],
                      capture_output=True)
        import dotenv

    success = try_create_database()
    if success:
        print("\n✓ Database setup completed successfully!")
        print("You can now run the backend server with: python -m uvicorn src.api.main:app --reload --port 8000")
    else:
        print("\n✗ Database setup failed. Please check your PostgreSQL installation and credentials.")
        print("Common PostgreSQL setup steps:")
        print("1. Ensure PostgreSQL service is running")
        print("2. Verify the correct password for the 'postgres' user")
        print("3. Update the DATABASE_URL in backend/.env accordingly")
        sys.exit(1)