@echo off
for /f "tokens=1-4 delims=/ " %%a in ("%date%") do (
    set month=%%a
    set day=%%b
    set year=%%c
)
for /f "tokens=1-2 delims=: " %%a in ("%time%") do (
    set hour=%%a
    set minute=%%b
)
set msg=Auto commit on %year%-%month%-%day% %hour%:%minute%
git add .
git commit -m "%msg%"
git push origin main
pause


