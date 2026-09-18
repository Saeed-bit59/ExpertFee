import fs from "node:fs";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(
      `EXPERT RECORDS NAVIGATION TEST FAILED: ${message}`
    );
  }
}

const homePath = "src/pages/HomePage.tsx";
const appPath = "src/App.tsx";
const recordsPath = "src/pages/ExpertRecordsPage.tsx";

assert(
  fs.existsSync(homePath),
  `Required file missing: ${homePath}`
);

assert(
  fs.existsSync(appPath),
  `Required file missing: ${appPath}`
);

assert(
  fs.existsSync(recordsPath),
  `Required file missing: ${recordsPath}`
);

const home = fs.readFileSync(homePath, "utf8");
const app = fs.readFileSync(appPath, "utf8");
const records = fs.readFileSync(recordsPath, "utf8");

// ------------------------------------------------------------
// 1. HomePage contract
// ------------------------------------------------------------

assert(
  home.includes("onOpenHistory?: () => void"),
  "Home history callback contract missing"
);

assert(
  home.includes("onOpenHistory"),
  "Home history callback missing"
);

assert(
  home.includes("onClick={() => onOpenHistory?.()}"),
  "Home history navigation missing"
);

assert(
  home.includes("ذخیره و سوابق"),
  "Home records button label missing"
);

// ------------------------------------------------------------
// 2. App route contract
// ------------------------------------------------------------

assert(
  app.includes(
    'const ExpertRecordsPage = lazy(() => import("./pages/ExpertRecordsPage"));'
  ),
  "ExpertRecordsPage import missing"
);

assert(
  app.includes('"EXPERT_RECORDS"'),
  "EXPERT_RECORDS route missing"
);

// ------------------------------------------------------------
// 3. Home -> Records navigation
// ------------------------------------------------------------

assert(
  /onOpenHistory=\{\(\)\s*=>\s*\{[\s\S]*?setPendingExpertCaseDraft\(null\)[\s\S]*?setCurrentPage\("EXPERT_RECORDS"\)[\s\S]*?\}\}/.test(
    app
  ),
  "Home-to-records navigation contract missing"
);

// ------------------------------------------------------------
// 4. Records page rendering
// ------------------------------------------------------------

assert(
  /currentPage\s*===\s*"EXPERT_RECORDS"/.test(app),
  "EXPERT_RECORDS render condition missing"
);

assert(
  app.includes("<ExpertRecordsPage"),
  "ExpertRecordsPage render missing"
);

assert(
  app.includes("onBack={goHome}"),
  "Records back navigation missing"
);

// ------------------------------------------------------------
// 5. Article 11 transferred draft support
// ------------------------------------------------------------

assert(
  app.includes("pendingExpertCaseDraft"),
  "Pending expert case draft state missing"
);

assert(
  app.includes("initialDraft="),
  "Initial draft connection missing"
);

assert(
  app.includes("pendingExpertCaseDraft"),
  "Transferred Article 11 draft connection missing"
);

// ------------------------------------------------------------
// 6. Records page contract
// ------------------------------------------------------------

assert(
  records.includes("onBack"),
  "ExpertRecordsPage onBack contract missing"
);

assert(
  records.includes("initialDraft"),
  "ExpertRecordsPage initialDraft contract missing"
);

console.log(
  "EXPERT RECORDS NAVIGATION: ALL TESTS PASSED"
);
