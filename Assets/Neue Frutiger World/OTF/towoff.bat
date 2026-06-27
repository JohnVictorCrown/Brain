@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Converting all .otf files to .woff2 ...
echo ========================================

:: Create WOFF subfolder (ignore error if it already exists)
mkdir WOFF 2>nul

for %%f in (*.otf) do (
    echo.
    echo Processing: %%f
    fonttools ttLib "%%f" --flavor=woff2 -o "%%~nf.woff2"
    if !errorlevel! equ 0 (
        echo   -> Created %%~nf.woff2
        move "%%~nf.woff2" "WOFF\%%~nf.woff2" >nul
        if !errorlevel! equ 0 (
            echo   -> Moved to WOFF\%%~nf.woff2
        ) else (
            echo   -> WARNING: Could not move %%~nf.woff2
        )
    ) else (
        echo   -> ERROR converting %%f
    )
)

echo.
echo Done! All conversions complete and moved to the WOFF folder.
pause