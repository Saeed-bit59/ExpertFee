import fs from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`HOME BOTTOM ACTIONS PRACTICAL TEST FAILED: ${message}`);
  }
}

const page = fs.readFileSync("src/pages/HomePage.tsx", "utf8");

/*
 * 1. Each final action must have exactly one button test-id.
 * We deliberately count test IDs, not visible text, because labels can
 * legitimately occur in share-message strings or comments.
 */
for (const item of [
  ['data-testid="home-share-action"', "اشتراک‌گذاری"],
  ['data-testid="home-about-action"', "درباره نرم‌افزار"],
  ['data-testid="home-settings-action"', "تنظیمات"],
] as const) {
  const idCount = page.split(item[0]).length - 1;
  assert(idCount === 1, `${item[1]}: expected one button test id, found ${idCount}`);
  assert(page.includes(item[1]), `${item[1]} visible label missing`);
}

/*
 * 2. Header must contain branding only.
 */
const headerStart = page.indexOf("<header");
const headerEnd = page.indexOf("</header>");
assert(headerStart >= 0 && headerEnd > headerStart, "Home header could not be located");

const header = page.slice(headerStart, headerEnd);

for (const label of ["اشتراک‌گذاری", "درباره نرم‌افزار", "تنظیمات"]) {
  assert(!header.includes(label), `${label} remains in Header`);
}

/*
 * 3. Share practical contract.
 */
assert(page.includes("async function handleShare"), "Share handler missing");
assert(page.includes("navigator.share"), "Web Share API missing");
assert(page.includes("navigator.clipboard.writeText"), "Clipboard fallback missing");
assert(page.includes("مبلغ مورد ارزیابی:"), "Evaluation amount missing from share text");
assert(page.includes("تعداد کارشناسان:"), "Expert count missing from share text");
assert(page.includes("دستمزد محاسبه‌شده:"), "Calculated fee missing from share text");
assert(page.includes("تولیدشده توسط:"), "Share attribution missing");
assert(page.includes('"ExpertFee"'), "ExpertFee branding missing from share text");
assert(!page.includes("ExpertFee-AI"), "Forbidden ExpertFee-AI branding remains");

/*
 * 4. About / Settings use real callbacks.
 */
assert(page.includes("onOpenAbout?.()"), "About callback missing");
assert(page.includes("onOpenSettings?.()"), "Settings callback missing");
assert(!page.includes('showComingSoon("درباره نرم‌افزار")'), "Obsolete About action remains");
assert(!page.includes('showComingSoon("تنظیمات")'), "Obsolete Settings action remains");

/*
 * 5. Existing Save & Records and Article 11 quick calculation remain.
 */
assert(page.includes('data-testid="home-history-action"'), "Save & Records action removed");
assert(page.includes("onOpenHistory?.()"), "Save & Records callback missing");
assert(page.includes("calculateCommonFee"), "Quick calculation removed");
assert(page.includes("ARTICLE_11"), "Article 11 contract removed");

/*
 * 6. No financial calculation logic belongs in this UI action layer.
 */
for (const forbidden of [
  "grossFeeToman * 0.05",
  "grossFeeToman * 0.10",
  "grossFeeToman * 0.1",
  "institutionShareToman",
  "netReceivableToman",
]) {
  assert(!page.includes(forbidden), `Financial logic leaked into Home action layer: ${forbidden}`);
}

console.log("HOME BOTTOM ACTIONS PRACTICAL: ALL TESTS PASSED");
