#!/bin/bash
# Usage: ./new-feature.sh <branch-name>
# Example: ./new-feature.sh fix/task-router-ordering

if [ -z "$1" ]; then
    echo "Usage: ./new-feature.sh <branch-name>"
    echo "Example: ./new-feature.sh fix/task-router-ordering"
    exit 1
fi

BRANCH="$1"

# Ensure we're on main and up to date
git checkout main
git pull origin main

# Create and switch to the new feature branch
git checkout -b "$BRANCH"

echo ""
echo "Ready to work on branch: $BRANCH"
echo "When done:"
echo "  git add <files>"
echo "  git commit -m 'your message'"
echo "  git push -u origin $BRANCH"
echo "Then open a PR on GitHub: https://github.com/Shuaibali0786/Phase-II-Full-Stack-Web-Todo-Application-/compare/$BRANCH"
