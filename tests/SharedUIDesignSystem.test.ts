import fs from "node:fs";
import path from "node:path";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `SHARED UI DESIGN SYSTEM TEST FAILED: ${message}`
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

function has(
  source: string,
  text: string,
  message: string
): void {
  assert(
    source.includes(text),
    message
  );
}

/*
 * ============================================================
 * 1. REQUIRED DESIGN SYSTEM FILES
 * ============================================================
 */

const requiredFiles = [
  "src/styles/fonts.css",
  "src/styles/theme.css",
  "src/styles/globals.css",

  "src/components/ui/PageHeader.tsx",
  "src/components/ui/SectionCard.tsx",
  "src/components/ui/MoneyInput.tsx",
  "src/components/ui/CalculateButton.tsx",
  "src/components/ui/FeeResultCard.tsx",
  "src/components/ui/ExpertCountSelector.tsx",
  "src/components/ui/MissionSelector.tsx",
  "src/components/ui/OptionGroup.tsx",
  "src/components/ui/AdvancedOptions.tsx"
] as const;

for (const file of requiredFiles) {
  read(file);
}

/*
 * ============================================================
 * 2. THEME
 * ============================================================
 */

const theme = read(
  "src/styles/theme.css"
);

const requiredThemeTokens = [
  "--ef-primary:",
  "--ef-primary-hover:",
  "--ef-primary-dark:",
  "--ef-primary-light:",
  "--ef-primary-soft:",
  "--ef-surface:",
  "--ef-background:",
  "--ef-text:",
  "--ef-text-strong:",
  "--ef-text-muted:",
  "--ef-border:",
  "--ef-border-strong:",
  "--ef-font-family:",
  "--ef-control-height:",
  "--ef-form-width:"
];

for (
  const token of requiredThemeTokens
) {
  has(
    theme,
    token,
    `Theme token missing: ${token}`
  );
}

/*
 * Approved softer blue for Design System v2.
 */

has(
  theme,
  "#6ea7d8",
  "Approved v2 softer blue missing"
);

/*
 * Main reference form must remain bounded.
 */

has(
  theme,
  "--ef-form-width: 620px",
  "Reference form width must remain 620px"
);

/*
 * ============================================================
 * 3. GLOBAL CSS
 * ============================================================
 */

const globals = read(
  "src/styles/globals.css"
);

has(
  globals,
  '@import "./fonts.css"',
  "fonts.css import missing"
);

has(
  globals,
  '@import "./theme.css"',
  "theme.css import missing"
);

has(
  globals,
  "direction: rtl",
  "RTL layout contract missing"
);

has(
  globals,
  ".ef-page",
  "ExpertFee page namespace missing"
);

has(
  globals,
  ".ef-form-shell",
  "Bounded form shell missing"
);

has(
  globals,
  "width: min(100%, var(--ef-form-width)) !important",
  "Centered bounded form width missing"
);

has(
  globals,
  "margin: 0 auto !important",
  "Centered form margin missing"
);

/*
 * ============================================================
 * 4. MONEY INPUT
 * ============================================================
 */

const moneyInput = read(
  "src/components/ui/MoneyInput.tsx"
);

has(
  moneyInput,
  "normalizePersianDigits",
  "Persian digit normalization missing"
);

has(
  moneyInput,
  "formatMoneyInput",
  "Money formatter missing"
);

has(
  moneyInput,
  "parseMoneyValue",
  "Money parser missing"
);

/*
 * Do NOT search for:
 *
 * toLocaleString("en-US")
 *
 * because formatting may legitimately be:
 *
 * toLocaleString(
 *   "en-US"
 * )
 *
 * Therefore method and locale are checked separately.
 */

has(
  moneyInput,
  "const grouped = digits.replace",
  "Money thousand separator method missing"
);

has(
  moneyInput,
  "Number.isSafeInteger(numberValue * 10)",
  "Money safe-integer guard missing"
);

has(
  moneyInput,
  'inputMode="numeric"',
  "Numeric keyboard/input mode missing"
);

has(
  moneyInput,
  'className="ef-money-input"',
  "Protected MoneyInput class missing"
);

has(
  globals,
  ".ef-money-control",
  "Money control CSS missing"
);

has(
  globals,
  ".ef-money-input",
  "Money input CSS missing"
);

has(
  globals,
  ".ef-money-unit",
  "Money unit CSS missing"
);

/*
 * User-entered amount must be centered.
 */

has(
  globals,
  "text-align: center !important",
  "Centered input/control text missing"
);

/*
 * Numeric order must remain stable.
 */

has(
  globals,
  "direction: ltr !important",
  "LTR numeric direction missing"
);

/*
 * ============================================================
 * 5. CALCULATE BUTTON
 * ============================================================
 */

const calculateButton = read(
  "src/components/ui/CalculateButton.tsx"
);

has(
  calculateButton,
  '"ef-calculate-button"',
  "CalculateButton protected class missing"
);

has(
  calculateButton,
  'type="button"',
  "CalculateButton type missing"
);

has(
  globals,
  ".ef-calculate-button",
  "Calculate button CSS missing"
);

has(
  globals,
  "visibility: visible !important",
  "Calculate button visibility protection missing"
);

/*
 * ============================================================
 * 6. RESULT CARD
 * ============================================================
 */

const resultCard = read(
  "src/components/ui/FeeResultCard.tsx"
);

has(
  resultCard,
  'aria-live="polite"',
  "Result live region missing"
);

has(
  resultCard,
  'className="ef-result-card"',
  "Result card class missing"
);

has(
  resultCard,
  'className="ef-result-value"',
  "Result value class missing"
);

has(
  globals,
  ".ef-result-card",
  "Result card CSS missing"
);

has(
  globals,
  ".ef-result-value",
  "Result value CSS missing"
);

/*
 * ============================================================
 * 7. EXPERT COUNT
 * ============================================================
 */

const expertCount = read(
  "src/components/ui/ExpertCountSelector.tsx"
);

has(
  expertCount,
  "تعداد کارشناسان",
  "Expert count title missing"
);

has(
  expertCount,
  "افزایش تعداد کارشناسان",
  "Expert increment control missing"
);

has(
  expertCount,
  "کاهش تعداد کارشناسان",
  "Expert decrement control missing"
);

has(
  expertCount,
  'className="ef-counter"',
  "Expert counter protected class missing"
);

has(
  globals,
  ".ef-counter",
  "Expert counter CSS missing"
);

has(
  globals,
  "grid-template-columns: 64px minmax(0, 1fr) 64px !important",
  "Expert counter layout contract missing"
);

/*
 * ============================================================
 * 8. MISSION
 * ============================================================
 */

const mission = read(
  "src/components/ui/MissionSelector.tsx"
);

const missionLabels = [
  "بدون مأموریت",
  "با مأموریت",
  "داخل استان",
  "خارج استان",
  "تعداد روز مأموریت"
];

for (
  const label of missionLabels
) {
  has(
    mission,
    label,
    `Mission label missing: ${label}`
  );
}

has(
  mission,
  'className="ef-mission-box"',
  "Mission box protected class missing"
);

has(
  globals,
  ".ef-mission-box",
  "Mission box CSS missing"
);

/*
 * ============================================================
 * 9. OPTION GROUP
 * ============================================================
 */

const optionGroup = read(
  "src/components/ui/OptionGroup.tsx"
);

has(
  optionGroup,
  'className="ef-choice-grid"',
  "OptionGroup grid missing"
);

has(
  optionGroup,
  'className="ef-choice"',
  "OptionGroup choice class missing"
);

has(
  optionGroup,
  "data-active",
  "OptionGroup active-state contract missing"
);

has(
  globals,
  ".ef-choice-grid",
  "Choice grid CSS missing"
);

has(
  globals,
  ".ef-choice",
  "Choice CSS missing"
);

/*
 * ============================================================
 * 10. ADVANCED OPTIONS
 * ============================================================
 */

const advanced = read(
  "src/components/ui/AdvancedOptions.tsx"
);

has(
  advanced,
  "<details",
  "AdvancedOptions progressive disclosure missing"
);

has(
  advanced,
  "<summary",
  "AdvancedOptions summary missing"
);

has(
  advanced,
  'className="ef-advanced"',
  "AdvancedOptions protected class missing"
);

has(
  advanced,
  'className="ef-advanced-summary"',
  "AdvancedOptions summary class missing"
);

has(
  globals,
  ".ef-advanced",
  "AdvancedOptions CSS missing"
);

has(
  globals,
  ".ef-advanced-summary",
  "AdvancedOptions summary CSS missing"
);

/*
 * ============================================================
 * 11. SECTION CARD
 * ============================================================
 */

const sectionCard = read(
  "src/components/ui/SectionCard.tsx"
);

has(
  sectionCard,
  '"ef-section-card"',
  "SectionCard class missing"
);

has(
  globals,
  ".ef-section-card",
  "SectionCard CSS missing"
);

/*
 * ============================================================
 * 12. PAGE HEADER
 * ============================================================
 */

const pageHeader = read(
  "src/components/ui/PageHeader.tsx"
);

has(
  pageHeader,
  'className="ef-page-header"',
  "PageHeader class missing"
);

has(
  pageHeader,
  'className="ef-page-title"',
  "Page title class missing"
);

has(
  globals,
  ".ef-page-header",
  "PageHeader CSS missing"
);

/*
 * ============================================================
 * 13. DEFAULT EXPORT CONTRACT
 * ============================================================
 */

const components = [
  "PageHeader",
  "SectionCard",
  "MoneyInput",
  "CalculateButton",
  "FeeResultCard",
  "ExpertCountSelector",
  "MissionSelector",
  "OptionGroup",
  "AdvancedOptions"
];

for (
  const component of components
) {
  const source = read(
    `src/components/ui/${component}.tsx`
  );

  has(
    source,
    "export default",
    `${component} default export missing`
  );
}

/*
 * ============================================================
 * 14. CSS PROTECTION AGAINST LEGACY GLOBAL STYLES
 * ============================================================
 */

has(
  globals,
  ".ef-page button,",
  "Button namespace protection missing"
);

has(
  globals,
  ".ef-page input,",
  "Input namespace protection missing"
);

has(
  globals,
  "!important",
  "Legacy CSS protection missing"
);

/*
 * ============================================================
 * 15. RESPONSIVE DESIGN
 * ============================================================
 */

has(
  globals,
  "@media (max-width: 560px)",
  "Mobile responsive contract missing"
);

/*
 * ============================================================
 * PASS
 * ============================================================
 */

console.log(
  "SHARED UI DESIGN SYSTEM: ALL TESTS PASSED"
);
