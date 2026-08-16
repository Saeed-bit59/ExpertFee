import fs from "node:fs";
import path from "node:path";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `INDUSTRY SHARED UI TEST FAILED: ${message}`
    );
  }
}

const file = path.resolve(
  process.cwd(),
  "src/pages/IndustryTechnologyPage.tsx"
);

assert(
  fs.existsSync(file),
  "IndustryTechnologyPage.tsx is missing"
);

const source =
  fs.readFileSync(file, "utf8");

const has = (
  token: string,
  message: string
) =>
  assert(
    source.includes(token),
    message
  );

const notHas = (
  token: string,
  message: string
) =>
  assert(
    !source.includes(token),
    message
  );

[
  'from "../components/ui/PageHeader"',
  'from "../components/ui/SectionCard"',
  'from "../components/ui/MoneyInput"',
  'from "../components/ui/CalculateButton"',
  'from "../components/ui/FeeResultCard"',
  'from "../components/ui/ExpertCountSelector"',
  'from "../components/ui/MissionSelector"',
  'from "../components/ui/OptionGroup"'
].forEach((token) =>
  has(
    token,
    `Shared UI dependency missing: ${token}`
  )
);

has(
  'className="ef-page"',
  "Shared page namespace missing"
);

has(
  'className="ef-form-shell"',
  "Shared form shell missing"
);

has(
  'className="ef-back-button industry-technology-back-button"',
  "Shared back button missing"
);

has(
  "<MoneyInput",
  "MoneyInput missing"
);

has(
  "parseMoneyValue",
  "Shared money parser missing"
);

has(
  "<CalculateButton",
  "CalculateButton missing"
);

has(
  "<FeeResultCard",
  "FeeResultCard missing"
);

has(
  "<ExpertCountSelector",
  "ExpertCountSelector missing"
);

has(
  "کارشناسان هم‌رشته",
  "Same-field panel option missing"
);

has(
  "کارشناسان با رشته‌های مختلف (غیرهم‌رشته)",
  "Different-fields panel option missing"
);

has(
  "افزایش ۴۰٪",
  "Visible 40% option missing"
);

has(
  "افزایش ۵۰٪ ـ کارشناسی نرم‌افزار طبق ماده ۱۱ به‌اضافه ۵۰ درصد دستمزد ماده ۱۱",
  "Complete software 50% label missing"
);

has(
  'serviceType ===\n                "SOFTWARE_EXPERTISE"',
  "Software-specific discipline routing missing"
);

has(
  '"COMPUTER_INFORMATION_TECHNOLOGY"',
  "Computer/IT discipline contract missing"
);

notHas(
  "Vazirmatn, IRANSans",
  "Legacy local font stack must be removed"
);

notHas(
  'background:amount>0?"#1565c0"',
  "Legacy calculate-button styling must be removed"
);

notHas(
  "const card=",
  "Legacy local card style must be removed"
);

notHas(
  "function fmt(",
  "Legacy local money formatter must be removed"
);

console.log(
  "INDUSTRY SHARED UI: ALL TESTS PASSED"
);
