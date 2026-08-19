import fs from "node:fs";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `SETTINGS UI PRACTICAL TEST FAILED: ${message}`,
    );
  }
}

const page = fs.readFileSync(
  "src/pages/SettingsPage.tsx",
  "utf8",
);

const repository = fs.readFileSync(
  "src/settings/SettingsRepository.ts",
  "utf8",
);

const types = fs.readFileSync(
  "src/settings/SettingsTypes.ts",
  "utf8",
);

/*
 * 1. Page must exist and be a real settings screen.
 */
assert(
  page.includes('data-testid="expertfee-settings-page"'),
  "Settings page root missing",
);

assert(
  page.includes("<h1"),
  "Settings page heading missing",
);

assert(
  page.includes("تنظیمات"),
  "Settings title missing",
);

/*
 * 2. Navigation / back action.
 */
assert(
  page.includes('data-testid="settings-back"'),
  "Back button missing",
);

assert(
  page.includes("onBack"),
  "Back callback missing",
);

/*
 * 3. Initial load must come from repository.
 */
assert(
  page.includes("useEffect"),
  "Initial settings load effect missing",
);

assert(
  page.includes("settingsRepository.get()"),
  "SettingsRepository.get() is not connected",
);

/*
 * 4. Editable expert profile fields.
 */
for (const label of [
  "نام کارشناس",
  "کد کارشناس",
  "استان",
  "مرکز / نهاد",
  "ایمیل",
  "شماره تماس",
]) {
  assert(
    page.includes(label),
    `Expert profile field missing: ${label}`,
  );
}

/*
 * 5. Display/calculation controls.
 */
for (const label of [
  "واحد پیش‌فرض پول",
  "نمایش اعداد",
  "تعداد اعشار",
]) {
  assert(
    page.includes(label),
    `Display control missing: ${label}`,
  );
}

for (const token of [
  '"TOMAN"',
  '"RIAL"',
  '"FA"',
  '"EN"',
  "decimalPlaces",
]) {
  assert(
    page.includes(token),
    `Display data contract missing: ${token}`,
  );
}

/*
 * 6. Records/report defaults.
 */
for (const label of [
  "بازه پیش‌فرض گزارش",
  "نمایش پرونده‌های وصول‌شده",
  "نمایش مطالبات وصول‌نشده",
]) {
  assert(
    page.includes(label),
    `Records/report setting missing: ${label}`,
  );
}

/*
 * 7. Tariff reference must be visible and read-only.
 */
for (const token of [
  "اطلاعات تعرفه مورد استفاده",
  "tariffSourceTitle",
  "tariffVersion",
  "tariffDescription",
  "از این صفحه قابل ویرایش نیست",
]) {
  assert(
    page.includes(token),
    `Tariff metadata contract missing: ${token}`,
  );
}

/*
 * 8. Save/reset must be real repository operations.
 */
assert(
  page.includes('data-testid="settings-save"'),
  "Save button missing",
);

assert(
  page.includes("settingsRepository.save(settings)"),
  "Save button is not connected to repository.save()",
);

assert(
  page.includes('data-testid="settings-reset"'),
  "Reset button missing",
);

assert(
  page.includes("settingsRepository.reset()"),
  "Reset button is not connected to repository.reset()",
);

/*
 * 9. User feedback must be visible after actions.
 */
assert(
  page.includes('data-testid="settings-feedback"'),
  "Feedback UI missing",
);

assert(
  page.includes("تنظیمات با موفقیت ذخیره شد"),
  "Save success feedback missing",
);

assert(
  page.includes("تنظیمات پیش‌فرض بازیابی شد"),
  "Reset success feedback missing",
);

/*
 * 10. Repository persistence contract.
 */
assert(
  repository.includes("SETTINGS_STORAGE_KEY"),
  "Persistent storage key missing",
);

assert(
  repository.includes("localStorage"),
  "Browser persistence layer missing",
);

assert(
  repository.includes("get(): ExpertFeeSettings"),
  "Repository get() contract missing",
);

assert(
  repository.includes(
    "save(settings: ExpertFeeSettings): ExpertFeeSettings",
  ),
  "Repository save() contract missing",
);

assert(
  repository.includes(
    "reset(): ExpertFeeSettings",
  ),
  "Repository reset() contract missing",
);

/*
 * 11. Settings model contract.
 */
for (const token of [
  "schemaVersion",
  "expertName",
  "currencyUnit",
  "numberLocale",
  "decimalPlaces",
  "defaultReportPeriod",
  "defaultShowReceivedOnly",
  "defaultShowPendingOnly",
  "tariffSourceTitle",
  "tariffVersion",
  "tariffDescription",
]) {
  assert(
    types.includes(token),
    `Settings data model field missing: ${token}`,
  );
}

/*
 * 12. Safety boundary:
 * Settings UI must not contain financial calculation rules.
 */
for (const forbidden of [
  "grossFeeToman * 0.05",
  "grossFeeToman * 0.10",
  "grossFeeToman * 0.1",
  "institutionShareToman",
  "netReceivableToman",
  "calculateCommonFee(",
  "calculateArticle11(",
]) {
  assert(
    !page.includes(forbidden),
    `Financial calculation leaked into SettingsPage: ${forbidden}`,
  );
}

console.log(
  "SETTINGS UI PRACTICAL TEST: ALL TESTS PASSED",
);
