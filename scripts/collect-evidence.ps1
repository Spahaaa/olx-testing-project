# Run Playwright tests, move html report into reports/, convert markdown report to PDF (if md-to-pdf available)
# Usage: Open elevated PowerShell in project root and run: ./scripts/collect-evidence.ps1

$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$reportsDir = Join-Path -Path $PWD -ChildPath "reports"
if (-not (Test-Path $reportsDir)) { New-Item -ItemType Directory -Path $reportsDir | Out-Null }

Write-Host "Running Playwright tests..."
# Run tests with HTML reporter
npm run test:ci

# Move playwright-report to reports with timestamp
$src = Join-Path -Path $PWD -ChildPath "playwright-report"
if (Test-Path $src) {
  $dest = Join-Path -Path $reportsDir -ChildPath "playwright-report-$timestamp"
  Move-Item -Path $src -Destination $dest
  Write-Host "Moved playwright-report to $dest"
} else {
  Write-Host "No playwright-report folder produced."
}

# Convert markdown report to PDF using md-to-pdf if available via npx
Write-Host "Attempting to convert Markdown report to PDF (requires md-to-pdf)..."
try {
  npx md-to-pdf report/SE302_CourseProject_Report.md -o "$reportsDir\SE302_CourseProject_Report-$timestamp.pdf"
  Write-Host "PDF created in reports folder."
} catch {
  Write-Host "md-to-pdf conversion failed or not available. You can run 'npm run report:pdf' after installing md-to-pdf."
}

Write-Host "Collecting screenshots/attachments (if any)..."
# Optionally move screenshots/videos/traces if generated into reports
$artifacts = @('screenshots','videos','traces')
foreach ($a in $artifacts) {
  $p = Join-Path -Path $PWD -ChildPath $a
  if (Test-Path $p) {
    $dest2 = Join-Path -Path $reportsDir -ChildPath "$a-$timestamp"
    Move-Item -Path $p -Destination $dest2
    Write-Host "Moved $a to $dest2"
  }
}

Write-Host "Done. Reports are in the 'reports' folder. To package submission run: npm run package:zip"
