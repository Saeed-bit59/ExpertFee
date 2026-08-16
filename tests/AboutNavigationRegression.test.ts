import fs from "node:fs";
import path from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`ABOUT NAVIGATION REGRESSION FAILED: ${message}`);
  }
}

function readIfExists(relativePath: string): string {
  const file = path.resolve(process.cwd(), relativePath);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

const app = readIfExists("src/App.tsx");
const about = readIfExists("src/pages/AboutPage.tsx");
const footer = readIfExists("src/components/Footer.tsx");

assert(app, "src/App.tsx is missing");
assert(about, "src/pages/AboutPage.tsx is missing");

/*
 * Navigation contract:
 * About may be rendered by App's inline footer OR by the shared Footer component.
 * We intentionally do not require the Persian label to be duplicated in App.tsx.
 */
for (const token of [
  'import AboutPage from "./pages/AboutPage";',
  '"ABOUT"',
  'currentPage === "ABOUT"',
  "<AboutPage",
]) {
  assert(app.includes(token), `App contract missing: ${token}`);
}

const aboutLabelExists =
  app.includes("درباره نرم‌افزار") ||
  app.includes("درباره نرم افزار") ||
  footer.includes("درباره نرم‌افزار") ||
  footer.includes("درباره نرم افزار");

assert(
  aboutLabelExists,
  "About navigation label missing from App/Footer",
);

for (const token of [
  'const APP_NAME = "ExpertFee";',
  'const APP_VERSION = "0.1.0";',
  "ExpertFee",
  "سامانه هوشمند محاسبه و مدیریت حق‌الزحمه کارشناسان رسمی",
  "مرکز کارشناسان رسمی دادگستری استان بوشهر",
  "سعید رادمنش",
  "saeedradmanesh@gmail.com",
  "09177321284",
  "مشاهده متن کامل تعرفه",
  "جستجو در متن تعرفه",
  "بررسی به‌روزرسانی",
  'data-testid="expertfee-about-page"',
]) {
  assert(about.includes(token), `AboutPage contract missing: ${token}`);
}

assert(
  !about.includes("ExpertFee-AI"),
  "Old ExpertFee-AI branding must not exist in AboutPage",
);

/*
 * About must not be introduced into the main App header.
 */
const headerStart = app.indexOf("<header");
const headerEnd = app.indexOf("</header>", headerStart);

if (headerStart >= 0 && headerEnd > headerStart) {
  const header = app.slice(headerStart, headerEnd);
  assert(
    !header.includes("درباره نرم‌افزار") &&
      !header.includes("درباره نرم افزار"),
    "About must not be placed in the main Header",
  );
}

/*
 * Existing records navigation must remain intact.
 */
for (const token of [
  '"EXPERT_RECORDS"',
  "pendingExpertCaseDraft",
  "<ExpertRecordsPage",
]) {
  assert(
    app.includes(token),
    `Existing records contract missing: ${token}`,
  );
}

console.log("ABOUT NAVIGATION REGRESSION: ALL TESTS PASSED");
