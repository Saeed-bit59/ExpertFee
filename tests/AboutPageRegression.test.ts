import fs from "node:fs";
import path from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`EXPERTFEE ABOUT PAGE TEST FAILED: ${message}`);
  }
}

function read(relativePath: string): string {
  return fs.readFileSync(path.resolve(relativePath), "utf8");
}

const page = read("src/pages/AboutPage.tsx");
const tariff = read("public/tarife.md");

for (const token of [
  'const APP_NAME = "ExpertFee";',
  'const APP_VERSION = "0.1.0";',
  'const TARIFF_URL = "/tarife.md";',
  'const LOGO_URL = "/expertfee-logo.jpg";',
  "مرکز کارشناسان رسمی دادگستری استان بوشهر",
  "saeedradmanesh@gmail.com",
  "سعید رادمنش",
  "09177321284",
  "سامانه هوشمند محاسبه و مدیریت حق‌الزحمه کارشناسان رسمی",
  "حقوق مالکیت نرم‌افزار",
  "بررسی به‌روزرسانی",
  "مشاهده متن کامل تعرفه",
  "جستجو در متن تعرفه",
  'data-testid="expertfee-about-page"',
  'data-testid="expertfee-logo"',
  'data-testid="tariff-search"',
  'data-testid="full-tariff-text"',
]) {
  assert(page.includes(token), `AboutPage contract missing: ${token}`);
}

assert(
  !page.includes("ExpertFee-AI"),
  "AboutPage must not display the old '-AI' brand",
);

assert(
  !page.includes('درباره نرم افزار در هدر'),
  "AboutPage must not introduce a header navigation button",
);

for (const token of [
  "# تعرفه دستمزد کارشناسان رسمی دادگستری",
  "مصوب 25-12-1398 رئیس قوه قضاییه",
  "(اصلاحی 20-08-1402)",
  "## ماده 11",
  "## ماده 58",
]) {
  assert(tariff.includes(token), `Tariff source content missing: ${token}`);
}

console.log("EXPERTFEE ABOUT PAGE: ALL TESTS PASSED");
