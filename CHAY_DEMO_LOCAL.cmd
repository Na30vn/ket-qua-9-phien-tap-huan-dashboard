@echo off
setlocal
cd /d "%~dp0"
set "PORT=8765"
set "DEMO_URL=http://127.0.0.1:%PORT%/?phien=1&demo=1"
set "CODEX_PY=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

echo Dang khoi dong dashboard du lieu gia lap...

if exist "%CODEX_PY%" (
  start "Dashboard Demo Server" /D "%~dp0" "%CODEX_PY%" -m http.server %PORT%
  timeout /t 2 /nobreak >nul
  start "" "%DEMO_URL%"
  goto :end
)

where py >nul 2>nul
if not errorlevel 1 (
  start "Dashboard Demo Server" /D "%~dp0" py -m http.server %PORT%
  timeout /t 2 /nobreak >nul
  start "" "%DEMO_URL%"
  goto :end
)

where python >nul 2>nul
if not errorlevel 1 (
  start "Dashboard Demo Server" /D "%~dp0" python -m http.server %PORT%
  timeout /t 2 /nobreak >nul
  start "" "%DEMO_URL%"
  goto :end
)

echo Khong tim thay Python. Hay mo thu muc bang Live Server va truy cap:
echo http://127.0.0.1:8765/?phien=1^&demo=1
pause

:end
endlocal
