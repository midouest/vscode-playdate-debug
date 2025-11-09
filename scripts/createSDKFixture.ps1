$fixturesDir = Join-Path $PSScriptRoot ".." "fixtures"
$sdkDir = Join-Path $fixturesDir "PlaydateSDK"

if (-not (Test-Path $sdkDir)) {
    New-Item -ItemType Directory -Path $sdkDir -Force | Out-Null
    Write-Host "Created directory: $sdkDir"
} else {
    Write-Host "Directory already exists: $sdkDir"
}

$versionFile = Join-Path $sdkDir "VERSION.txt"
$semverVersion = "3.0.0"

Set-Content -Path $versionFile -Value $semverVersion
Write-Host "Created VERSION.txt with version: $semverVersion"
