import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(
      `ARTICLE 13 SHARED UI TEST FAILED: ${message}`
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

function has(
  source: string,
  token: string,
  message: string
): void {
  assert(source.includes(token), message);
}

function notHas(
  source: string,
  token: string,
  message: string
): void {
  assert(!source.includes(token), message);
}

const panel = read(
  "src/components/Article13CalculatorPanel.tsx"
);

/*
 * Engine contracts
 */
has(
  panel,
  'from "../engine/Article13Calculator"',
  "Article13Calculator import missing"
);

has(
  panel,
  "calculateArticle13({",
  "Article 13 calculation call missing"
);

has(
  panel,
  "monthlyRentToman",
  "Monthly rent calculation contract missing"
);

has(
  panel,
  'from "../engine/MissionCalculator"',
  "MissionCalculator import missing"
);

has(
  panel,
  "calculateMission({",
  "Mission calculation call missing"
);

has(
  panel,
  "getMissionDailyRate",
  "Mission daily-rate contract missing"
);

has(
  panel,
  "result.finalFeeToman",
  "Final Article 13 fee contract missing"
);

has(
  panel,
  "result.capped",
  "Article 13 cap-state contract missing"
);

/*
 * Shared UI dependencies
 */
[
  'from "./ui/PageHeader"',
  'from "./ui/SectionCard"',
  'from "./ui/MoneyInput"',
  'from "./ui/CalculateButton"',
  'from "./ui/FeeResultCard"',
  'from "./ui/MissionSelector"'
].forEach((token) => {
  has(
    panel,
    token,
    `Shared UI dependency missing: ${token}`
  );
});

/*
 * Shared page/layout contracts
 */
has(
  panel,
  'className="ef-page"',
  "Shared page namespace missing"
);

has(
  panel,
  'className="ef-form-shell"',
  "Shared bounded form shell missing"
);

has(
  panel,
  'eyebrow="ماده ۱۳"',
  "Article 13 eyebrow missing"
);

has(
  panel,
  'title="محاسبه دستمزد تعیین اجاره‌بها"',
  "Article 13 page title missing"
);

/*
 * Main calculation workflow
 */
has(
  panel,
  "<MoneyInput",
  "Shared MoneyInput missing"
);

has(
  panel,
  'label="مبلغ اجاره‌بهای ماهانه (مبنای محاسبه)"',
  "Monthly rent label missing"
);

has(
  panel,
  "parseMoneyValue",
  "Shared money parser missing"
);

has(
  panel,
  "<CalculateButton",
  "Shared CalculateButton missing"
);

has(
  panel,
  "محاسبه دستمزد",
  "Calculate action missing"
);

has(
  panel,
  "<FeeResultCard",
  "Shared FeeResultCard missing"
);

has(
  panel,
  "feeToman={result.finalFeeToman}",
  "Final fee must be passed directly to FeeResultCard"
);

has(
  panel,
  'title="دستمزد کارشناسی"',
  "Immediate result title missing"
);

has(
  panel,
  "footer={",
  "Article 13 cap message footer contract missing"
);

/*
 * MissionSelector actual API
 */
has(
  panel,
  "<MissionSelector",
  "Shared MissionSelector missing"
);

has(
  panel,
  'enabled={missionType !== "NONE"}',
  "Mission enabled mapping missing"
);

has(
  panel,
  "onEnabledChange={(enabled)",
  "Mission enabled callback missing"
);

has(
  panel,
  "location={",
  "Mission location mapping missing"
);

has(
  panel,
  "onLocationChange={(location)",
  "Mission location callback missing"
);

has(
  panel,
  "days={missionDays}",
  "Mission days mapping missing"
);

has(
  panel,
  "onDaysChange={setMissionDays}",
  "Mission days callback missing"
);

has(
  panel,
  'title="مأموریت کارشناسی"',
  "Mission title missing"
);

/*
 * Final design requirement:
 * calculation-details box must remain removed.
 */
notHas(
  panel,
  "AdvancedOptions",
  "AdvancedOptions must not exist in final Article 13 UI"
);

notHas(
  panel,
  "جزئیات روش محاسبه",
  "Calculation-details box must remain removed"
);

notHas(
  panel,
  "result.calculatedFeeToman",
  "Pre-cap calculation detail must not be rendered"
);

/*
 * Invalid/obsolete Shared Component props
 */
notHas(
  panel,
  "note={",
  "FeeResultCard does not support note prop"
);

notHas(
  panel,
  "missionType={missionType}",
  "MissionSelector does not support missionType prop"
);

notHas(
  panel,
  "missionDays={missionDays}",
  "MissionSelector does not support missionDays prop"
);

notHas(
  panel,
  "onMissionTypeChange=",
  "MissionSelector does not support onMissionTypeChange prop"
);

notHas(
  panel,
  "onMissionDaysChange=",
  "MissionSelector does not support onMissionDaysChange prop"
);

/*
 * Legacy Article 13 presentation must remain removed.
 */
notHas(
  panel,
  "function parseNumber",
  "Legacy local money parser must remain removed"
);

notHas(
  panel,
  "function formatInputNumber",
  "Legacy local money formatter must remain removed"
);

notHas(
  panel,
  "const card =",
  "Legacy custom card style must remain removed"
);

notHas(
  panel,
  "const missionOption =",
  "Legacy custom mission option style must remain removed"
);

notHas(
  panel,
  'textAlign: "left"',
  "Legacy left-aligned money input must remain removed"
);

notHas(
  panel,
  "#1565c0",
  "Legacy hard-coded primary blue must remain removed"
);

notHas(
  panel,
  "Vazirmatn, IRANSans",
  "Legacy page-local font stack must remain removed"
);

console.log(
  "ARTICLE 13 SHARED UI: ALL TESTS PASSED"
);
