import fs from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`HOME QUICK CALCULATION UI TEST FAILED: ${message}`);
}

const home = fs.readFileSync("src/pages/HomePage.tsx", "utf8");

for (const token of [
  'from "../components/ui/MoneyInput"',
  'from "../engine/CommonFeeEngine"',
  "parseMoneyValue",
  "calculateCommonFee({",
  'baseMode: "ARTICLE_11"',
  "result.finalExpertFeeToman",
  'data-testid="home-quick-calculation"',
  'className="home-quick-calculation"',
  'id="quick-evaluation-value"',
  'aria-label="واحد مبلغ ارزیابی سریع"',
  "handleQuickCalculate",
  'role="alert"',
  "quickFee !== null",
  "حق‌الزحمه پایه بر اساس ماده ۱۱",
  "ورود به محاسبه کامل ماده ۱۱",
  "onOpenShare?.({",
]) {
  assert(home.includes(token), `quick calculation contract missing: ${token}`);
}

for (const callback of [
  "onOpenArticle11",
  "onOpenArticle13",
  "onOpenArticle14",
  "onOpenWaterEngineering",
  "onOpenMetalsAndMining",
  "onOpenMovableProperty",
  "onOpenFinancialAffairs",
  "onOpenVehicles",
  "onOpenRoadBuilding",
  "onOpenIndustryTechnology",
  "onOpenAgricultureNaturalResources",
]) {
  assert(home.includes(callback), `active calculator navigation missing: ${callback}`);
}

assert(!home.includes("function toEnglishDigits"), "unsafe legacy digit parser returned");
assert(!home.includes("function parseToman"), "unsafe legacy money parser returned");

console.log("HOME QUICK CALCULATION UI: ALL TESTS PASSED");
