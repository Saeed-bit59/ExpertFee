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
  'const TARIFF_URL = "/tarife.md";',
  'const ARCHIVE_TARIFF_LABEL = "تعرفه مصوب ۱۳۹۸ و اصلاحیه ۱۴۰۲";',
  "وب‌اپلیکیشن واکنش‌گرا و قابل نصب",
  "ذخیره‌سازی",
  "متن آرشیوی تعرفه",
  "نباید به‌عنوان متن کامل تعرفه ۱۴۰۵ استفاده شود",
  "مشاهده متن آرشیوی تعرفه",
  'data-testid="expertfee-about-page"',
  'data-testid="tariff-search"',
  'data-testid="full-tariff-text"',
]) {
  assert(page.includes(token), `AboutPage contract missing: ${token}`);
}

assert(
  !page.includes("ExpertFee-AI"),
  "AboutPage must not display the old '-AI' brand",
);

for (const personalValue of [
  "saeedradmanesh@gmail.com",
  "09177321284",
  "سعید رادمنش",
]) {
  assert(!page.includes(personalValue), `personal data leaked: ${personalValue}`);
}

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
