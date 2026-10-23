param([Parameter(Mandatory=$true)][string]$BackupFile)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$resolved = (Resolve-Path -LiteralPath $BackupFile).Path
$meta = Get-Content -LiteralPath "$resolved.json" -Raw | ConvertFrom-Json
$compose = Join-Path $projectRoot 'docker-compose.yml'
docker compose -f $compose exec -T db createdb -U vietfood vietfood_restore_check
if ($LASTEXITCODE -ne 0) { throw 'Restore-check database must not already exist; choose a fresh test environment.' }
Get-Content -LiteralPath $resolved -Raw | docker compose -f $compose exec -T db psql -U vietfood -v ON_ERROR_STOP=1 -d vietfood_restore_check
if ($LASTEXITCODE -ne 0) { throw 'Restore failed' }
$count = docker compose -f $compose exec -T db psql -U vietfood -d vietfood_restore_check -At -c 'SELECT count(*) FROM "Order"'
if ($LASTEXITCODE -ne 0 -or [int]$count -ne [int]$meta.orders) { throw 'Restored order count does not match metadata' }
Write-Output 'Restore check succeeded. Test database retained for inspection; SMTP must remain disabled.'
