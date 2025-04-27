# CipherLab - Node.js Installation Script
# This script automatically elevates to admin if needed

# Self-elevation mechanism
if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')) {
    Write-Host "Requesting administrator privileges..." -ForegroundColor Yellow
    $CommandLine = "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
    Start-Process -FilePath PowerShell.exe -Verb RunAs -ArgumentList $CommandLine
    Exit
}

# Show header - this will only run if we have admin privileges
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "          CipherLab - Node.js Installer          " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is already installed
$nodeInstalled = $false
try {
    $nodeVersion = node -v
    $nodeInstalled = $true
    Write-Host "Node.js $nodeVersion is already installed." -ForegroundColor Green
    Write-Host "No installation needed." -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Will proceed with installation." -ForegroundColor Yellow
}

# If Node.js is already installed, skip the rest
if ($nodeInstalled) {
    Write-Host ""
    Write-Host "To set up CipherLab:" -ForegroundColor Yellow
    Write-Host "1. Open a command prompt in this directory" -ForegroundColor Yellow
    Write-Host "2. Run: npm install" -ForegroundColor Yellow
    Write-Host "3. When completed, use start.cmd to run the server" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

# Install Chocolatey if needed
$chocoInstalled = $false
try {
    $chocoVersion = choco -v
    $chocoInstalled = $true
    Write-Host "Chocolatey $chocoVersion is already installed." -ForegroundColor Green
} catch {
    Write-Host "Installing Chocolatey package manager..." -ForegroundColor Yellow
    
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "Chocolatey installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to install Chocolatey: $_" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit
    }
}

# Install Node.js using Chocolatey
Write-Host "Installing Node.js LTS version..." -ForegroundColor Yellow
try {
    choco install nodejs-lts -y
    Write-Host "Node.js installed successfully!" -ForegroundColor Green
    Write-Host "You may need to close and reopen PowerShell/Command Prompt to use Node.js." -ForegroundColor Yellow
} catch {
    Write-Host "Failed to install Node.js: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Success message and next steps
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "        Node.js Installation Complete!           " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close this window and open a new Command Prompt or PowerShell" -ForegroundColor Yellow
Write-Host "2. Navigate to your CipherLab directory" -ForegroundColor Yellow
Write-Host "3. Run: npm install" -ForegroundColor Yellow
Write-Host "4. When that completes, use start.cmd to run the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "Important: It's recommended to install dependencies" -ForegroundColor Red
Write-Host "separately after Node.js installation to avoid issues." -ForegroundColor Red
Write-Host ""
Read-Host "Press Enter to exit"
