@echo off
title AgriGuardian Swarm - Stopping Servers
color 0C

echo.
echo  Stopping AgriGuardian Swarm servers...
echo.

:: Kill uvicorn (backend)
taskkill /f /im "uvicorn.exe" >nul 2>&1

:: Kill node (frontend)
taskkill /f /im "node.exe" >nul 2>&1

echo  All servers stopped successfully.
echo.
pause
