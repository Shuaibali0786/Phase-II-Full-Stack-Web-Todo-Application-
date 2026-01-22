#!/bin/bash
# Script to run the frontend with network access
echo "Starting Todo Application Frontend..."

cd ../frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    npm install
fi

# Run the Next.js development server
npm run dev -- --hostname 0.0.0.0