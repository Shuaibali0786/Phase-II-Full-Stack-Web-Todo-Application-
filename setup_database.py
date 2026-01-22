#!/usr/bin/env python3
"""
Database setup script for the Todo App
This script helps set up the PostgreSQL database for the application
"""

import os
import sys
import subprocess
import getpass
from pathlib import Path

def setup_database():
    print("Setting up PostgreSQL database for Todo App...")

    # Get the current directory (project root)
    project_root = Path(__file__).parent
    backend_dir = project_root / "backend"

    # Read the current .env file to get the database URL
    env_file = backend_dir / ".env"

    if not env_file.exists():
        print(f"Error: {env_file} not found!")
        return False

    with open(env_file, 'r') as f:
        env_content = f.read()

    # Look for the DATABASE_URL line
    lines = env_content.split('\n')
    db_url_line_idx = -1
    current_db_url = ""

    for i, line in enumerate(lines):
        if line.startswith('DATABASE_URL='):
            db_url_line_idx = i
            current_db_url = line
            break

    if db_url_line_idx == -1:
        print("Error: DATABASE_URL not found in .env file!")
        return False

    print(f"Current DATABASE_URL: {current_db_url}")

    # Parse the database URL to get username and password
    # Format: postgresql://username:password@host:port/database
    db_url_parts = current_db_url.split('://')[1]  # Remove postgresql://
    user_pass_host = db_url_parts.split('@')[0]    # Get username:password
    username, password = user_pass_host.split(':', 1)
    print(f"Extracted username: {username}")

    # Ask user for the correct password
    print("\nTrying to connect to PostgreSQL...")
    correct_password = getpass.getpass(f"Enter the correct password for PostgreSQL user '{username}' (or press Enter to keep '{password}'): ")

    if correct_password.strip():
        # Update the password in the DATABASE_URL
        new_db_url = f"DATABASE_URL=postgresql://{username}:{correct_password}@localhost:5432/todo_app"
        lines[db_url_line_idx] = new_db_url

        # Write back to the file
        with open(env_file, 'w') as f:
            f.write('\n'.join(lines))

        print(f"Updated DATABASE_URL in {env_file}")
        password_to_test = correct_password
    else:
        password_to_test = password

    # Now try to connect and create the database
    print("\nAttempting to create database 'todo_app'...")

    # Set the password as an environment variable for the subprocess
    env_vars = os.environ.copy()
    env_vars['PGPASSWORD'] = password_to_test

    try:
        # Try to create the database
        result = subprocess.run([
            "C:/Program Files/PostgreSQL/18/bin/createdb.exe",
            "-U", username,
            "-h", "localhost",
            "-p", "5432",
            "todo_app"
        ], env=env_vars, capture_output=True, text=True)

        if result.returncode == 0:
            print("✓ Database 'todo_app' created successfully!")
        elif "already exists" in result.stderr.lower():
            print("✓ Database 'todo_app' already exists.")
        else:
            print(f"✗ Failed to create database: {result.stderr}")
            return False

        # Now try to initialize the tables
        print("\nInitializing database tables...")
        os.chdir(backend_dir)

        # Import and run init_db function
        sys.path.insert(0, str(backend_dir))
        os.environ['DATABASE_URL'] = f"postgresql://{username}:{password_to_test}@localhost:5432/todo_app"

        from src.core.database import init_db
        init_db()
        print("✓ Database tables initialized successfully!")

        return True

    except subprocess.CalledProcessError as e:
        print(f"✗ Subprocess error: {e}")
        return False
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        return False

if __name__ == "__main__":
    success = setup_database()
    if success:
        print("\n✓ Database setup completed successfully!")
        print("You can now run the backend server with: python -m uvicorn src.api.main:app --reload --port 8000")
    else:
        print("\n✗ Database setup failed. Please check your PostgreSQL installation and credentials.")
        sys.exit(1)