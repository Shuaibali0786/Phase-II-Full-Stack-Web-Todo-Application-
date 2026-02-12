@echo off
REM Usage: new-feature.bat <branch-name>
REM Example: new-feature.bat fix/task-router-ordering

if "%~1"=="" (
    echo Usage: new-feature.bat ^<branch-name^>
    echo Example: new-feature.bat fix/task-router-ordering
    exit /b 1
)

set BRANCH=%~1

REM Ensure we're on main and up to date
git checkout main
git pull origin main

REM Create and switch to the new feature branch
git checkout -b %BRANCH%

echo.
echo Ready to work on branch: %BRANCH%
echo When done:
echo   git add ^<files^>
echo   git commit -m "your message"
echo   git push -u origin %BRANCH%
echo Then open a PR on GitHub: https://github.com/Shuaibali0786/Phase-II-Full-Stack-Web-Todo-Application-/compare/%BRANCH%
