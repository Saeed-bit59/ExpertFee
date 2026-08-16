$ErrorActionPreference = "Stop"

$root = Get-Location

function Require-File($relative) {
  $path = Join-Path $root $relative
  if (-not (Test-Path $path)) {
    throw "Required project file not found: $relative"
  }
  return $path
}

$configDir = Join-Path $root "src\config"
$engineDir = Join-Path $root "src\engine"

New-Item -ItemType Directory -Force -Path $configDir | Out-Null

$files = @(
  "src\engine\Article11Calculator.ts",
  "src\engine\Article11Adjustments.ts",
  "src\engine\MissionCalculator.ts"
)

foreach ($f in $files) {
  [void](Require-File $f)
}

Write-Host "Core 1405 files are present." -ForegroundColor Green
Write-Host "Copy the files from this package into the matching project folders."
Write-Host "The package intentionally does not overwrite Article11Engine.ts."
Write-Host "Article11Engine already delegates the standard path to Article11Calculator."
