$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$backupDir = Join-Path $projectRoot 'backups'
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$targetFile = Join-Path $backupDir "vietfood-$stamp.sql"
$lines = docker compose -f (Join-Path $projectRoot 'docker-compose.yml') exec -T db pg_dump -U vietfood --no-owner --no-privileges vietfood
if ($LASTEXITCODE -ne 0) { throw 'pg_dump failed' }
[System.IO.File]::WriteAllLines($targetFile, $lines, [System.Text.UTF8Encoding]::new($false))
$orderCount = docker compose -f (Join-Path $projectRoot 'docker-compose.yml') exec -T db psql -U vietfood -d vietfood -At -c 'SELECT count(*) FROM "Order"'
if ($LASTEXITCODE -ne 0) { throw 'Could not record order count' }
@{ orders = [int]$orderCount; createdAt = (Get-Date).ToString('o') } | ConvertTo-Json | Set-Content -LiteralPath "$targetFile.json" -Encoding utf8
Write-Output $targetFile
