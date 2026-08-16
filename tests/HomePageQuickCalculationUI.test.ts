import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(
      `HOME QUICK CALCULATION UI TEST FAILED: ${message}`
    );
  }
}

function read(relativePath: string): string {
  const fullPath = path.resolve(process.cwd(), relativePath);
  assert(
    fs.existsSync(fullPath),
    `Required file does not exist: ${relativePath}`
  );
  return fs.readFileSync(fullPath, "utf8");
}

function has(source: string, token: string, message: string): void {
  assert(source.includes(token), message);
}

function notHas(source: string, token: string, message: string): void {
  assert(!source.includes(token), message);
}

const home = read("src/pages/HomePage.tsx");

[
  'from "../components/ui/MoneyInput"',
  'from "../components/ui/CalculateButton"',
  'from "../components/ui/FeeResultCard"',
  'from "../components/ui/SectionCard"'
].forEach((token) =>
  has(home, token, `Shared UI dependency missing: ${token}`)
);

has(home, 'from "../engine/CommonFeeEngine"', "CommonFeeEngine import missing");
has(home, "calculateCommonFee({", "CommonFeeEngine call missing");
has(home, '"ARTICLE_11"', "Quick calculation must remain based on ARTICLE_11");
has(home, "result.finalExpertFeeToman", "Quick result contract changed");

has(home, "parseMoneyValue", "Shared money parser missing");
notHas(home, "function parseToman", "Legacy HomePage money parser must be removed");
notHas(home, "function toEnglishDigits", "Legacy digit converter must be removed");
notHas(home, "function formatToman", "Legacy fee formatter must be removed");

has(home, 'data-testid="home-quick-calculation"', "Quick section marker missing");
has(home, 'className="ef-form-shell"', "Bounded Article 11 shell missing");
has(home, "<SectionCard", "SectionCard missing");
has(home, "<MoneyInput", "MoneyInput missing");
has(home, 'label="ارزش مورد کارشناسی"', "Quick amount label missing");
has(home, "<CalculateButton", "CalculateButton missing");
has(home, "محاسبه سریع", "Quick calculate label missing");
has(home, "<FeeResultCard", "FeeResultCard missing");
has(home, 'title="حق‌الزحمه پایه بر اساس ماده ۱۱"', "Immediate result title missing");
has(home, "ورود به محاسبه کامل ماده ۱۱", "Article 11 navigation missing");

notHas(
  home,
  '"linear-gradient(90deg, #1565c0, #0d5bd7)"',
  "Legacy quick calculate button styling still exists"
);

[
  "onOpenArticle11",
  "onOpenArticle13",
  "onOpenArticle14",
  "onOpenVehicles",
  "onOpenRoadBuilding",
  "onOpenIndustryTechnology",
  "onOpenAgricultureNaturalResources",
  'title="اجاره‌بها"',
  'title="راه و ساختمان"',
  'title="صنعت و فن"',
  'title="تفسیر تصاویر و نقشه‌ها"',
  'title="کشاورزی و منابع طبیعی"',
  'title="وسائط نقلیه"'
].forEach((token) =>
  has(
    home,
    token,
    `Existing HomePage contract missing after migration: ${token}`
  )
);

console.log("HOME QUICK CALCULATION UI: ALL TESTS PASSED");
