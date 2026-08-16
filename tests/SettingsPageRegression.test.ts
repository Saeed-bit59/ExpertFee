import fs from "node:fs";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `SETTINGS PAGE REGRESSION TEST FAILED: ${message}`,
    );
  }
}

const page = fs.readFileSync(
  "src/pages/SettingsPage.tsx",
  "utf8",
);

/*
 * Page identity and navigation
 */
assert(
  page.includes('data-testid="expertfee-settings-page"'),
  "Settings page identity missing",
);

assert(
  page.includes('data-testid="settings-back"'),
  "Settings back navigation missing",
);

assert(
  page.includes("onBack"),
  "Settings onBack contract missing",
);

/*
 * Repository connection
 */
assert(
  page.includes(
    'from "../settings/SettingsRepository"',
  ),
  "SettingsRepository import missing",
);

assert(
  page.includes("settingsRepository.get()"),
  "SettingsRepository.get() missing",
);

assert(
  page.includes("settingsRepository.save"),
  "SettingsRepository.save() missing",
);

assert(
  page.includes("settingsRepository.reset"),
  "SettingsRepository.reset() missing",
);

/*
 * Expert information
 */
[
  "نام کارشناس",
  "کد کارشناس",
  "استان",
  "مرکز / نهاد",
  "ایمیل",
  "شماره تماس",
].forEach((label) => {
  assert(
    page.includes(label),
    `Expert information field missing: ${label}`,
  );
});

/*
 * Display settings
 */
[
  "واحد پول",
  "نحوه نمایش اعداد",
  "تعداد اعشار",
].forEach((label) => {
  assert(
    page.includes(label),
    `Display setting missing: ${label}`,
  );
});

assert(
  page.includes("TOMAN"),
  "TOMAN option missing",
);

assert(
  page.includes("RIAL"),
  "RIAL option missing",
);

assert(
  page.includes("FA"),
  "Persian number locale missing",
);

assert(
  page.includes("EN"),
  "English number locale missing",
);

/*
 * Records/report settings
 */
[
  "بازه پیش‌فرض گزارش",
  "نمایش پیش‌فرض پرونده‌های وصول‌شده",
  "نمایش پیش‌فرض مطالبات وصول‌نشده",
].forEach((label) => {
  assert(
    page.includes(label),
    `Records setting missing: ${label}`,
  );
});

/*
 * Tariff metadata — read only
 */
[
  "اطلاعات تعرفه مورد استفاده",
  "tariffSourceTitle",
  "tariffVersion",
  "tariffDescription",
  "از این صفحه قابل ویرایش نیست",
].forEach((contract) => {
  assert(
    page.includes(contract),
    `Tariff information contract missing: ${contract}`,
  );
});

/*
 * Actions and feedback
 */
assert(
  page.includes('data-testid="settings-save"'),
  "Save action missing",
);

assert(
  page.includes('data-testid="settings-reset"'),
  "Reset action missing",
);

assert(
  page.includes('data-testid="settings-feedback"'),
  "Settings feedback UI missing",
);

/*
 * Safety: SettingsPage must not implement financial rules.
 */
[
  "grossFeeToman * 0.05",
  "grossFeeToman * 0.10",
  "grossFeeToman * 0.1",
  "institutionShareToman",
  "netReceivableToman",
].forEach((forbidden) => {
  assert(
    !page.includes(forbidden),
    `Financial logic leaked into SettingsPage: ${forbidden}`,
  );
});

console.log(
  "SETTINGS PAGE REGRESSION: ALL TESTS PASSED",
);
