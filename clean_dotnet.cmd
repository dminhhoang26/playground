@echo off
setlocal enabledelayedexpansion

:: Kiểm tra tham số --dry-run
set "DRY_RUN=false"
if "%~1"=="--dry-run" (
    set "DRY_RUN=true"
    echo 🔍 DRY RUN: Listing all server\**\bin and server\**\obj folders that would be removed...
) else (
    echo 🧹 Cleaning all server\**\bin and server\**\obj folders...
)

:: Hàm xử lý thư mục (bin và obj trong server)
for /d /r "server" %%i in (bin obj) do (
    for %%j in ("%%i") do (
        if /i "%%~nxj"=="bin" (
            if "!DRY_RUN!"=="true" (
                echo [DRY RUN] Would remove: %%~fj
            ) else (
                echo Removing: %%~fj
                rd /s /q "%%~fj"
            )
        )
        if /i "%%~nxj"=="obj" (
            if "!DRY_RUN!"=="true" (
                echo [DRY RUN] Would remove: %%~fj
            ) else (
                echo Removing: %%~fj
                rd /s /q "%%~fj"
            )
        )
    )
)

echo ✅ Done. All **\bin and **\obj folders have been removed.
endlocal
