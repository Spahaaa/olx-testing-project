# Package the repository into a submission ZIP
# Usage: powershell -File ./scripts/package-submission.ps1

$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$zipName = "olx-testing-project-submission-$timestamp.zip"
Write-Host "Creating ZIP: $zipName"

# Exclude node_modules and .git
$exclude = @('node_modules','playwright-report','reports','*.zip')
Temp-Variable -Name t -Value "tmp_pack"

# Use Compress-Archive including all files except excluded patterns
$files = Get-ChildItem -Recurse -File | Where-Object {
    foreach ($ex in $exclude) {
        if ($_.FullName -like "*$ex*") { return $false }
    }
    return $true
}

$filesPaths = $files | ForEach-Object { $_.FullName }

Compress-Archive -LiteralPath $filesPaths -DestinationPath $zipName -Force

Write-Host "Created $zipName"
