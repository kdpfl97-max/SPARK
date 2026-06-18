$ErrorActionPreference = "Stop"

$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $appDir

Write-Host "Starting SPARK Admin App locally..."
Write-Host "Open: http://127.0.0.1:4174"
Write-Host "Press Ctrl+C to stop."

node .\server.js
