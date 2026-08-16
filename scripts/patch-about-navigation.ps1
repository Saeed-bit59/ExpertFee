$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$app = Join-Path $root "src\App.tsx"

if (-not (Test-Path $app)) {
  throw "src\App.tsx not found. Run this script from the ExpertFee-AI project root."
}

$backup = "$app.about-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $app $backup

$text = Get-Content $app -Raw -Encoding UTF8

if ($text -notmatch 'import\s+AboutPage\s+from\s+"\./pages/AboutPage";') {
  $needle = 'import ExpertRecordsPage from "./pages/ExpertRecordsPage";'
  if ($text -notmatch [regex]::Escape($needle)) {
    throw "Could not find ExpertRecordsPage import. No changes were made to the original file."
  }
  $text = $text.Replace(
    $needle,
    $needle + "`r`nimport AboutPage from `"./pages/AboutPage`";"
  )
}

if ($text -notmatch '"ABOUT"') {
  $text = $text -replace '(\|\s*"EXPERT_RECORDS";)', '| "EXPERT_RECORDS"`r`n  | "ABOUT";'
}

if ($text -notmatch 'function\s+openAbout\s*\(') {
  $needle = 'function goHome(): void {'
  if ($text -match [regex]::Escape($needle)) {
    $insert = @'
function openAbout(): void {
  setCurrentPage("ABOUT");
}

'@
    $text = $text.Replace($needle, $insert + $needle)
  }
}

if ($text -notmatch 'currentPage\s*===\s*"ABOUT"') {
  $marker = '      {/* =====================================`r`n          Footer'
  $route = @'
      {/* =====================================
          About
          ===================================== */}

      {currentPage === "ABOUT" && (
        <AboutPage onBack={goHome} />
      )}

'@
  if ($text.Contains($marker)) {
    $text = $text.Replace($marker, $route + $marker)
  } else {
    throw "Footer marker not found. Backup created at $backup. No safe automatic route insertion was possible."
  }
}

if ($text -notmatch 'درباره نرم‌افزار') {
  $text = $text -replace '(?s)(<footer.*?</footer>)', @'
<footer
        data-testid="app-footer"
        style={{
          marginTop: 40,
          padding: "20px 16px",
          borderTop: "1px solid #e2e8f0",
          background: "#ffffff",
          textAlign: "center",
          fontSize: 13,
          opacity: 0.9
        }}
      >
        <button
          type="button"
          data-testid="footer-about-button"
          onClick={openAbout}
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
        <div style={{ color: "#718198", marginTop: 8 }}>
          ExpertFee · نسخه 0.1.0
        </div>
      </footer>
'@
}

Set-Content $app $text -Encoding UTF8
Write-Host "About navigation patched successfully."
Write-Host "Backup: $backup"
