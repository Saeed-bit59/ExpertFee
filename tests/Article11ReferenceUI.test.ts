import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`ARTICLE 11 REFERENCE UI TEST FAILED: ${message}`);
  }
}

function read(relativePath: string): string {
  const fullPath = path.resolve(process.cwd(), relativePath);
  assert(fs.existsSync(fullPath), `Required file does not exist: ${relativePath}`);
  return fs.readFileSync(fullPath, "utf8");
}

function contains(source: string, text: string, message: string): void {
  assert(source.includes(text), message);
}

function notContains(source: string, text: string, message: string): void {
  assert(!source.includes(text), message);
}

const source = read("src/components/Article11CalculatorPanel.tsx");

for (const dependency of [
  'from "./ui/PageHeader"',
  'from "./ui/SectionCard"',
  'from "./ui/MoneyInput"',
  'from "./ui/CalculateButton"',
  'from "./ui/FeeResultCard"',
  'from "./ui/ExpertCountSelector"',
  'from "./ui/MissionSelector"',
  'from "./ui/OptionGroup"',
  'from "./ui/AdvancedOptions"'
]) {
  contains(source, dependency, `Shared UI dependency missing: ${dependency}`);
}

contains(source, 'from "../engine/Article11Engine"', "Article11Engine import missing");
contains(source, "calculateArticle11Engine({", "Article 11 engine call missing");
contains(source, "evaluationValueToman,", "evaluationValueToman engine input missing");
contains(source, "expertCount,", "expertCount engine input missing");
contains(source, "panelFieldMode,", "panelFieldMode engine input missing");
contains(source, "increaseRuleCode:", "increaseRuleCode engine input missing");
contains(source, "applyFiftyPercentIncrease:", "50 percent increase input missing");

contains(source, 'from "../engine/MissionCalculator"', "MissionCalculator import missing");
contains(source, "calculateMission({", "Mission calculation call missing");

contains(source, "<MoneyInput", "MoneyInput must be used");
contains(source, "<CalculateButton", "CalculateButton must be used");
contains(source, "<FeeResultCard", "FeeResultCard must be used");
contains(source, "<ExpertCountSelector", "ExpertCountSelector must be used");
contains(source, "<MissionSelector", "MissionSelector must be used");
contains(source, "<AdvancedOptions", "AdvancedOptions must be used for progressive disclosure");
contains(source, 'title="تنظیمات پیشرفته"', "AdvancedOptions title missing");
contains(source, 'title="ضرایب افزایشی"', "Advanced section must contain increasing coefficients");
contains(source, "بدون ضرایب افزایشی", "No-increase option missing");
contains(source, "با ضرایب افزایشی", "With-increase option missing");
contains(source, '"WITH_INCREASE"', "Progressive increase mode missing");
contains(source, "ARTICLE11_INCREASE_RULES.map", "Increase rules must come from rules module");

contains(source, "expertCount > 1", "Panel field mode must only appear for a panel");
contains(source, '"SINGLE_EXPERT"', "Single expert mode missing");
contains(source, '"SAME_FIELD"', "Same-field panel mode missing");

contains(source, "مبلغ ارزیابی", "Evaluation amount label missing");
contains(source, "محاسبه دستمزد", "Calculate action missing");
contains(source, "دستمزد کارشناسی", "Immediate fee result label missing");
contains(source, "تعداد کارشناسان", "Expert count section missing");
contains(source, "مأموریت کارشناسی", "Mission section missing");
contains(source, 'className="ef-form-shell"', "Centered bounded form shell missing");

notContains(source, "موضوع کارشناسی", "Subject section must not return to AdvancedOptions");
notContains(source, "getArticle11Suggestions", "Suggestion workflow must not return");
notContains(source, "SuggestionEngine", "SuggestionEngine must not couple to reference UI");
notContains(source, "Tariff1402", "UI must not duplicate tariff constants");
notContains(source, "#1565c0", "Old dark blue must not be hard-coded");
notContains(source, "fontFamily:", "Typography must come from Design System");

const moneyInput = read("src/components/ui/MoneyInput.tsx");
contains(moneyInput, "formatMoneyInput", "MoneyInput thousand separator missing");
contains(moneyInput, "normalizePersianDigits", "Persian digit normalization missing");
contains(moneyInput, 'className="ef-money-input"', "MoneyInput protected class missing");

const globals = read("src/styles/globals.css");
contains(globals, "direction: rtl", "Global RTL contract missing");
contains(globals, ".ef-form-shell", "Bounded form shell CSS missing");
contains(globals, ".ef-calculate-button", "Visible calculate button CSS missing");

const theme = read("src/styles/theme.css");
contains(theme, "#6ea7d8", "Approved v2 softer blue theme missing");

console.log("ARTICLE 11 REFERENCE UI: ALL TESTS PASSED");
