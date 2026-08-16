import fs from "node:fs";
import path from "node:path";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `EXPERTFEE V1 + SETTINGS REGRESSION FAILED: ${message}`,
    );
  }
}

function read(relativePath: string): string {
  const absolute = path.resolve(
    process.cwd(),
    relativePath,
  );

  assert(
    fs.existsSync(absolute),
    `Required project file missing: ${relativePath}`,
  );

  return fs.readFileSync(absolute, "utf8");
}

const app = read("src/App.tsx");
const settingsPage = read("src/pages/SettingsPage.tsx");
const settingsRepository = read(
  "src/settings/SettingsRepository.ts",
);
const settingsTypes = read(
  "src/settings/SettingsTypes.ts",
);
const recordsPage = read(
  "src/pages/ExpertRecordsPage.tsx",
);

/*
 * ============================================================
 * 1. Core App navigation
 * ============================================================
 */

for (const route of [
  '"HOME"',
  '"ARTICLE_11"',
  '"ARTICLE_13"',
  '"ARTICLE_14"',
  '"WATER_ENGINEERING"',
  '"METALS_AND_MINING"',
  '"MOVABLE_PROPERTY"',
  '"FINANCIAL_AFFAIRS"',
  '"VEHICLES"',
  '"ROAD_BUILDING"',
  '"INDUSTRY_TECHNOLOGY"',
  '"AGRICULTURE_NATURAL_RESOURCES"',
  '"EXPERT_RECORDS"',
  '"ABOUT"',
  '"SETTINGS"',
]) {
  assert(
    app.includes(route),
    `App route missing: ${route}`,
  );
}

/*
 * ============================================================
 * 2. Existing About / Records contracts must remain intact
 * ============================================================
 */

assert(
  app.includes("AboutPage"),
  "AboutPage navigation was removed",
);

assert(
  app.includes("درباره نرم‌افزار"),
  "About footer label was removed",
);

assert(
  app.includes("ExpertRecordsPage"),
  "ExpertRecordsPage navigation was removed",
);

assert(
  app.includes("ذخیره و سوابق") ||
  app.includes("EXPERT_RECORDS"),
  "Expert Records navigation contract was removed",
);

/*
 * ============================================================
 * 3. Settings navigation
 * ============================================================
 */

assert(
  app.includes(
    'import SettingsPage from "./pages/SettingsPage";',
  ),
  "SettingsPage import missing",
);

assert(
  app.includes("function openSettings(): void"),
  "openSettings handler missing",
);

assert(
  app.includes('setCurrentPage("SETTINGS")'),
  "SETTINGS route target missing",
);

assert(
  app.includes("تنظیمات"),
  "Settings navigation label missing",
);

assert(
  app.includes("onClick={openSettings}"),
  "Settings navigation click handler missing",
);

assert(
  app.includes('{currentPage === "SETTINGS" && ('),
  "SETTINGS render branch missing",
);

assert(
  app.includes("<SettingsPage onBack={goHome} />"),
  "SettingsPage render contract missing",
);

/*
 * ============================================================
 * 4. Settings page + repository
 * ============================================================
 */

assert(
  settingsPage.includes(
    'data-testid="expertfee-settings-page"',
  ),
  "Settings page root missing",
);

assert(
  settingsPage.includes("settingsRepository.get()"),
  "Settings initial load missing",
);

assert(
  settingsPage.includes(
    "settingsRepository.save(settings)",
  ),
  "Settings save connection missing",
);

assert(
  settingsPage.includes(
    "settingsRepository.reset()",
  ),
  "Settings reset connection missing",
);

assert(
  settingsPage.includes(
    'data-testid="settings-back"',
  ),
  "Settings back action missing",
);

assert(
  settingsPage.includes(
    'data-testid="settings-feedback"',
  ),
  "Settings feedback UI missing",
);

assert(
  settingsRepository.includes(
    'export const SETTINGS_STORAGE_KEY = "expertfee.settings.v1";',
  ),
  "Settings storage key changed unexpectedly",
);

assert(
  settingsTypes.includes(
    "schemaVersion: 1",
  ),
  "Settings schema version contract missing",
);

/*
 * ============================================================
 * 5. Records / financial separation
 * ============================================================
 */

for (const token of [
  "repository.create",
  "repository.list",
  "repository.summary",
  "repository.markReceived",
  "repository.markPending",
  "receivedAmountToman",
  "pendingReceivableToman",
]) {
  assert(
    recordsPage.includes(token),
    `Expert Records financial contract missing: ${token}`,
  );
}

/*
 * Settings must not own financial calculation logic.
 */
for (const forbidden of [
  "calculateCommonFee(",
  "calculateArticle11(",
  "grossFeeToman * 0.05",
  "grossFeeToman * 0.10",
  "grossFeeToman * 0.1",
  "institutionShareToman",
  "netReceivableToman",
]) {
  assert(
    !settingsPage.includes(forbidden),
    `SettingsPage contains forbidden financial logic: ${forbidden}`,
  );
}

/*
 * ============================================================
 * 6. Tariff metadata integrity
 * ============================================================
 */

for (const token of [
  "tariffSourceTitle",
  "tariffVersion",
  "tariffDescription",
  "مصوبه پایه + اصلاحیه سال ۱۴۰۲",
]) {
  assert(
    settingsTypes.includes(token),
    `Tariff metadata contract missing: ${token}`,
  );
}

/*
 * ============================================================
 * FINAL
 * ============================================================
 */

console.log("");
console.log("============================================================");
console.log(
  "EXPERTFEE V1 + SETTINGS REGRESSION: ALL TESTS PASSED",
);
console.log("------------------------------------------------------------");
console.log("Core App Navigation                         PASS");
console.log("About Navigation                            PASS");
console.log("Expert Records Navigation                   PASS");
console.log("Settings Navigation                         PASS");
console.log("Settings Page UI                            PASS");
console.log("Settings Repository                         PASS");
console.log("Settings Data Model                         PASS");
console.log("Tariff Metadata                             PASS");
console.log("Financial / Settings Separation             PASS");
console.log("============================================================");
