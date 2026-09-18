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

for (const token of [
  "مرکز کارشناسان رسمی دادگستری استان بوشهر",
  "saeedradmanesh@gmail.com",
  "سعید رادمنش",
  "۰۹۱۷۷۳۲۱۲۸۴",
  "سامانه حرفه‌ای محاسبه حق‌الزحمه کارشناسان رسمی دادگستری",
  "حقوق مالکیت و بهره‌برداری از نرم‌افزار ExpertFee محفوظ است",
  'data-testid="expertfee-about-page"',
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

for (const token of ["tarife.md", "tariff-search", "full-tariff-text", "مشاهده متن کامل تعرفه"]) {
  assert(!page.includes(token), `Obsolete tariff UI must be removed: ${token}`);
}

console.log("EXPERTFEE ABOUT PAGE: ALL TESTS PASSED");
