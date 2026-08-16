import fs from "node:fs";
import path from "node:path";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `ARTICLE 11 LAYOUT REGRESSION FAILED: ${message}`
    );
  }
}

function read(
  relativePath: string
): string {
  const fullPath = path.resolve(
    process.cwd(),
    relativePath
  );

  assert(
    fs.existsSync(fullPath),
    `Required file does not exist: ${relativePath}`
  );

  return fs.readFileSync(
    fullPath,
    "utf8"
  );
}

function contains(
  source: string,
  text: string,
  message: string
): void {
  assert(
    source.includes(text),
    message
  );
}

const panel = read(
  "src/components/Article11CalculatorPanel.tsx"
);

const globals = read(
  "src/styles/globals.css"
);

const theme = read(
  "src/styles/theme.css"
);

const money = read(
  "src/components/ui/MoneyInput.tsx"
);

const button = read(
  "src/components/ui/CalculateButton.tsx"
);

const counter = read(
  "src/components/ui/ExpertCountSelector.tsx"
);

const mission = read(
  "src/components/ui/MissionSelector.tsx"
);

const advanced = read(
  "src/components/ui/AdvancedOptions.tsx"
);

contains(
  panel,
  'className="ef-form-shell"',
  "Article 11 must use a centered bounded form shell"
);

contains(
  theme,
  "--ef-form-width: 620px",
  "Reference form width must be bounded at 620px"
);

contains(
  globals,
  ".ef-form-shell",
  "Centered form shell CSS is missing"
);

contains(
  globals,
  "width: min(100%, var(--ef-form-width)) !important",
  "Form shell must not stretch across the viewport"
);

contains(
  money,
  'className="ef-money-input"',
  "MoneyInput must use the protected design-system class"
);

contains(
  globals,
  ".ef-money-input",
  "MoneyInput CSS contract is missing"
);

contains(
  globals,
  "text-align: center !important",
  "Centered control text contract is missing"
);

contains(
  globals,
  "direction: ltr !important",
  "Money digits must keep stable LTR numeric order"
);

contains(
  globals,
  ".ef-money-unit",
  "Money unit must be positioned inside the money box"
);

contains(
  money,
  "formatMoneyInput",
  "Thousand separator formatter is missing"
);

contains(
  money,
  "normalizePersianDigits",
  "Persian digit normalization is missing"
);

contains(
  button,
  'className={[',
  "CalculateButton must use a protected CSS class"
);

contains(
  button,
  '"ef-calculate-button"',
  "CalculateButton class is missing"
);

contains(
  globals,
  ".ef-calculate-button",
  "Calculate button CSS contract is missing"
);

contains(
  globals,
  "visibility: visible !important",
  "Calculate button visibility protection is missing"
);

contains(
  counter,
  'className="ef-counter"',
  "Expert counter must use bounded counter layout"
);

contains(
  globals,
  "grid-template-columns: 64px minmax(0, 1fr) 64px !important",
  "Expert counter must keep minus/value/plus together"
);

contains(
  mission,
  'className="ef-mission-box"',
  "Mission selector must use bounded mission box"
);

contains(
  advanced,
  'className="ef-advanced"',
  "Advanced options must use protected layout"
);

contains(
  advanced,
  "<details",
  "Advanced options must remain collapsed/progressive disclosure"
);

contains(
  panel,
  'title="ضرایب افزایشی"',
  "Only increasing coefficients belong in advanced settings"
);

assert(
  !panel.includes(
    "موضوع کارشناسی"
  ),
  "Subject section must not return to advanced settings"
);

contains(
  panel,
  "calculateArticle11Engine({",
  "Article 11 stabilized engine call must remain intact"
);

contains(
  panel,
  "calculateMission({",
  "Mission calculator call must remain intact"
);

contains(
  panel,
  "ARTICLE11_INCREASE_RULES.map",
  "Increase rules must remain sourced from the rules module"
);

console.log(
  "ARTICLE 11 LAYOUT REGRESSION: ALL TESTS PASSED"
);
