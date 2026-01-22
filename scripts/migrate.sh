#!/bin/bash

# Script to run database migrations for the Todo application

echo "Running database migrations..."

cd backend
alembic revision --autogenerate -m "Auto migration"
alembic upgrade head

echo "Migrations complete!"