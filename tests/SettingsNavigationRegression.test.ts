import fs from "node:fs";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `SETTINGS NAVIGATION REGRESSION FAILED: ${message}`,
    );
  }
}

const app = fs.readFileSync(
  "src/App.tsx",
  "utf8",
);

const settingsPage = fs.readFileSync(
  "src/pages/SettingsPage.tsx",
  "utf8",
);

/*
 * Import contract
 */
assert(
  app.includes('import SettingsPage from "./pages/SettingsPage";'),
  "SettingsPage import missing",
);

/*
 * AppPage contract
 */
assert(
  app.includes('| "SETTINGS";'),
  "SETTINGS AppPage state missing",
);

/*
 * Navigation handler
 */
assert(
  app.includes("function openSettings(): void"),
  "openSettings handler missing",
);

assert(
  app.includes('setCurrentPage("SETTINGS")'),
  "Settings navigation target missing",
);

/*
 * Footer navigation
 */
assert(
  app.includes("تنظیمات"),
  "Settings footer navigation label missing",
);

assert(
  app.includes('data-testid="settings-navigation"'),
  "Settings navigation test id missing",
);

assert(
  app.includes("onClick={openSettings}"),
  "Settings footer click handler missing",
);

/*
 * Page rendering
 */
assert(
  app.includes('{currentPage === "SETTINGS" && ('),
  "Settings page rendering branch missing",
);

assert(
  app.includes("<SettingsPage onBack={goHome} />"),
  "SettingsPage rendering contract missing",
);

/*
 * Back navigation contract
 */
assert(
  settingsPage.includes("onBack: () => void"),
  "SettingsPage onBack contract missing",
);

assert(
  settingsPage.includes('data-testid="settings-back"'),
  "SettingsPage back navigation missing",
);

/*
 * Preserve established navigation contracts
 */
assert(
  app.includes('setCurrentPage("EXPERT_RECORDS")'),
  "Expert Records navigation contract was removed",
);

assert(
  app.includes('onClick={openAbout}'),
  "About navigation contract was removed",
);

assert(
  app.includes("درباره نرم‌افزار"),
  "About footer navigation label was removed",
);

/*
 * Settings navigation must not introduce financial logic.
 */
[
  "grossFeeToman * 0.05",
  "grossFeeToman * 0.10",
  "grossFeeToman * 0.1",
].forEach((forbidden) => {
  assert(
    !app.includes(forbidden),
    `Financial rule leaked into App navigation: ${forbidden}`,
  );
});

console.log(
  "SETTINGS NAVIGATION REGRESSION: ALL TESTS PASSED",
);
