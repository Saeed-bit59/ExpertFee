import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(
      `ROAD BUILDING SHARED UI TEST FAILED: ${message}`
    );
  }
}

const file = path.resolve(
  process.cwd(),
  "src/pages/RoadBuildingPage.tsx"
);

assert(
  fs.existsSync(file),
  "RoadBuildingPage.tsx is missing"
);

const source = fs.readFileSync(file, "utf8");

function has(token: string, message: string): void {
  assert(source.includes(token), message);
}

function notHas(token: string, message: string): void {
  assert(!source.includes(token), message);
}

/* Engine and article contracts */
has(
  'from "../engine/ExpertFeeEngine"',
  "ExpertFeeEngine import missing"
);
has(
  "calculateExpertFee({",
  "Central engine call missing"
);
has(
  "group: 6",
  "Road/building group contract missing"
);

[
  "article: 33",
  "article: 34",
  "article: 35",
  "article: 36",
  "article: 37",
  "article: 38",
  "article: 39",
  "article: 40",
  "article: 41",
  "article: 42",
  "article: 43",
  "article: 44"
].forEach((token) => {
  has(token, `Road/building contract missing: ${token}`);
});

/* Shared UI */
[
  'from "../components/ui/PageHeader"',
  'from "../components/ui/SectionCard"',
  'from "../components/ui/MoneyInput"',
  'from "../components/ui/CalculateButton"',
  'from "../components/ui/FeeResultCard"',
  'from "../components/ui/MissionSelector"'
].forEach((token) => {
  has(token, `Shared UI dependency missing: ${token}`);
});

has('className="ef-page"', "Shared page namespace missing");
has('className="ef-form-shell"', "Shared form shell missing");
has('title="راه و ساختمان"', "Page title missing");
has("<MoneyInput", "Shared MoneyInput missing");
has("parseMoneyValue", "Shared money parser missing");
has("<CalculateButton", "Shared CalculateButton missing");
has("<FeeResultCard", "Shared FeeResultCard missing");
has("<MissionSelector", "Shared MissionSelector missing");

/* Back navigation typography */
has(
  'className="ef-back-button road-building-back-button"',
  "Shared back-button class missing"
);
has(
  "بازگشت به صفحه اصلی",
  "Back-to-home label missing"
);

/* MissionSelector actual API */
has(
  'enabled={',
  "Mission enabled mapping missing"
);
has(
  "onEnabledChange=",
  "Mission enabled callback missing"
);
has(
  "location={",
  "Mission location mapping missing"
);
has(
  "onLocationChange={",
  "Mission location callback missing"
);
has(
  "days={days}",
  "Mission days mapping missing"
);
has(
  "onDaysChange={(value)",
  "Mission days callback missing"
);

/* Legacy local UI must remain removed */
notHas(
  "fontFamily:'Vazirmatn",
  "Legacy page-local font stack must be removed"
);
notHas(
  'background:x>0?"#1565c0"',
  "Legacy calculate-button styling must be removed"
);
notHas(
  "const card=",
  "Legacy custom card style must be removed"
);
notHas(
  "function fmt(",
  "Legacy local primary formatter must be removed"
);
notHas(
  "function n(",
  "Legacy local primary parser must be removed"
);

console.log(
  "ROAD BUILDING SHARED UI: ALL TESTS PASSED"
);
