@echo off
chcp 65001 >nul
title SCMS - Dung Server Local
echo ==========================================================
echo          SCMS - DUNG SERVER LOCAL (8080 & 5173)
echo ==========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop-local.ps1"
echo.
pause
