$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$appPath = Join-Path $root "src\App.tsx"

if (-not (Test-Path $appPath)) {
    throw "src\App.tsx not found. Run this script from the ExpertFee-AI project root."
}

$text = Get-Content $appPath -Raw -Encoding UTF8

# Always create a backup before modifying App.tsx.
$backup = "$appPath.about-v3-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').tsx"
Copy-Item $appPath $backup

# 1. AboutPage import
if ($text -notmatch 'import\s+AboutPage\s+from\s+"\./pages/AboutPage";') {
    $anchor = 'import ExpertRecordsPage from "./pages/ExpertRecordsPage";'
    if ($text -notmatch [regex]::Escape($anchor)) {
        throw "ExpertRecordsPage import was not found. Backup: $backup"
    }

    $replacement = $anchor + "`r`nimport AboutPage from `"./pages/AboutPage`";"
    $text = $text.Replace($anchor, $replacement)
}

# 2. ABOUT route token
if ($text -notmatch '"ABOUT"') {
    # Try the common page-union pattern first.
    $patterns = @(
        '(type\s+Page\s*=\s*)([^;]+);',
        '(currentPage\s*:\s*)([^;]+);'
    )

    $changed = $false
    foreach ($pattern in $patterns) {
        if (-not $changed -and $text -match $pattern) {
            $old = $Matches[0]
            if ($old -notmatch '"ABOUT"') {
                $new = $old -replace ';\s*$', ' | "ABOUT";'
                $text = $text.Replace($old, $new)
                $changed = $true
            }
        }
    }

    if (-not $changed) {
        Write-Warning 'Could not safely infer the Page union. The script will not fabricate one.'
    }
}

# 3. Footer About button.
# The regression contract requires the exact visible label to be present in App.tsx.
if ($text -notmatch 'درباره نرم‌افزار' -and $text -notmatch 'درباره نرم افزار') {
    $footerButton = @'
        <button
          type="button"
          data-testid="footer-about-button"
          onClick={() => setCurrentPage("ABOUT")}
          style={{
            border: "none",
            background: "transparent",
            color: "#173d70",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 800,
            fontSize: 13,
            padding: "6px 12px"
          }}
        >
          درباره نرم‌افزار
        </button>
'@

    $footerCandidates = @(
        '(<footer\b[\s\S]*?</footer>)',
        '(<Footer\b[\s\S]*?/>)'
    )

    $inserted = $false
    foreach ($candidate in $footerCandidates) {
        if (-not $inserted -and $text -match $candidate) {
            $block = $Matches[1]
            $text = $text.Replace($block, $block + "`r`n" + $footerButton)
            $inserted = $true
        }
    }

    if (-not $inserted) {
        # Safe fallback: append a small footer navigation fragment before the final closing
        # fragment. This does not replace any existing calculation or database code.
        $text = $text + "`r`n" + $footerButton + "`r`n"
        Write-Warning "No recognizable footer block found; About button fragment was appended. Review placement visually."
    }
}

# 4. About route render
if ($text -notmatch 'currentPage\s*===\s*"ABOUT"') {
    $route = @'
      {currentPage === "ABOUT" && (
        <AboutPage onBack={() => setCurrentPage("HOME")} />
      )}

'@

    # Insert immediately before the first ExpertRecords route when possible.
    $routeAnchor = '{currentPage === "EXPERT_RECORDS"'
    if ($text.Contains($routeAnchor)) {
        $text = $text.Replace($routeAnchor, $route + $routeAnchor)
    } else {
        throw "Could not find Expert Records route anchor. Backup: $backup"
    }
}

Set-Content -Path $appPath -Value $text -Encoding UTF8

Write-Host ""
Write-Host "V3 About Navigation patch completed."
Write-Host "App backup: $backup"
Write-Host ""
Write-Host "Now run:"
Write-Host "  npx tsx tests/AboutNavigationRegression.test.ts"
Write-Host "  npx tsc --noEmit"
