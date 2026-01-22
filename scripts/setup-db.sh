#!/bin/bash

# Script to setup the database for the Todo application

echo "Setting up the database..."

# Create database tables
python -m backend.src.core.database --init

# Run migrations
cd backend && alembic upgrade head

echo "Database setup complete!"