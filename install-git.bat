@echo off
REM Install Git for Windows
REM This script downloads and installs Git silently

setlocal enabledelayedexpansion

echo Installing Git for Windows...

REM Create temp directory if it doesn't exist
if not exist C:\temp mkdir C:\temp

REM Download Git installer using curl (built-in on Windows 10+)
echo Downloading Git installer...
curl -L -o C:\temp\git-installer.exe "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"

if errorlevel 1 (
    echo Failed to download Git. Trying alternative source...
    REM Alternative download method
    bitsadmin /transfer "GitDownload" /download /resume "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe" "C:\temp\git-installer.exe"
)

if exist C:\temp\git-installer.exe (
    echo Running Git installer...
    C:\temp\git-installer.exe /VERYSILENT /NORESTART /NOCANCEL
    
    REM Wait for installation to complete
    timeout /t 30 /nobreak
    
    REM Verify installation
    if exist "C:\Program Files\Git\cmd\git.exe" (
        echo Git installed successfully!
        "C:\Program Files\Git\cmd\git.exe" --version
        
        REM Add to PATH if needed
        setx PATH "%PATH%;C:\Program Files\Git\cmd" /M
        echo Git added to PATH
    ) else (
        echo Git installation may have failed. Checking alternate locations...
    )
    
    REM Cleanup
    del C:\temp\git-installer.exe
) else (
    echo Failed to download Git installer
    exit /b 1
)

echo Installation complete!
