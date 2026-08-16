import fs from "node:fs";
import path from "node:path";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `AGRICULTURE SHARED UI TEST FAILED: ${message}`
    );
  }
}

const file = path.resolve(
  process.cwd(),
  "src/pages/AgricultureNaturalResourcesPage.tsx"
);

assert(
  fs.existsSync(file),
  "AgricultureNaturalResourcesPage.tsx is missing"
);

const source = fs.readFileSync(
  file,
  "utf8"
);

function has(
  token: string,
  message: string
): void {
  assert(
    source.includes(token),
    message
  );
}

function notHas(
  token: string,
  message: string
): void {
  assert(
    !source.includes(token),
    message
  );
}

/* ============================================================
 * 1. Shared UI dependencies
 * Import formatting may be single-line or multi-line.
 * ============================================================ */

[
  "../components/ui/PageHeader",
  "../components/ui/SectionCard",
  "../components/ui/MoneyInput",
  "../components/ui/CalculateButton",
  "../components/ui/FeeResultCard",
  "../components/ui/MissionSelector"
].forEach((token) => {
  has(
    token,
    `Shared UI dependency missing: ${token}`
  );
});

/* ============================================================
 * 2. Shared page structure
 * ============================================================ */

has(
  'className="ef-page"',
  "Shared page namespace missing"
);

has(
  'className="ef-form-shell"',
  "Shared form shell missing"
);

has(
  'className="ef-back-button agriculture-back-button"',
  "Shared back button missing"
);

has(
  'title="کشاورزی و منابع طبیعی"',
  "Page title missing"
);

has(
  'eyebrow="گروه ۹"',
  "Group 9 eyebrow missing"
);

/* ============================================================
 * 3. Article selector
 * ============================================================ */

has(
  'id="agriculture-article"',
  "Article selector missing"
);

has(
  'className="ef-select"',
  "Shared article select styling missing"
);

has(
  "انتخاب ماده تعرفه",
  "Article selection section title missing"
);

has(
  "ماده تعرفه",
  "Article selector label missing"
);

/* ============================================================
 * 4. Required tariff articles
 * ============================================================ */

[
  "48",
  "49",
  "51",
  "52",
  "53"
].forEach((article) => {
  has(
    article,
    `Article ${article} contract missing`
  );
});

/* ============================================================
 * 5. Expert discipline selector must be removed from UI
 * ============================================================ */

notHas(
  "AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES",
  "Discipline list import must be removed"
);

notHas(
  "disciplineLabels",
  "Discipline labels must be removed"
);

notHas(
  "setDiscipline",
  "Discipline UI state must be removed"
);

notHas(
  "رشته کارشناسی",
  "Expert discipline selector must be removed from UI"
);

/* ============================================================
 * 6. Required discipline remains internal for Engine
 * ============================================================ */

has(
  "FIXED_DISCIPLINE",
  "Internal fixed discipline contract missing"
);

has(
  '"AGRICULTURE_NATURAL_RESOURCES"',
  "Internal agriculture discipline value missing"
);

has(
  "discipline:",
  "Engine discipline routing missing"
);

/* ============================================================
 * 7. Money / area inputs
 * ============================================================ */

has(
  "<MoneyInput",
  "Shared MoneyInput missing"
);

has(
  "parseMoneyValue",
  "Shared money parser missing"
);

has(
  'id="agriculture-evaluation-value"',
  "Evaluation value input missing"
);

has(
  'id="agriculture-area"',
  "Article 51 area input missing"
);

has(
  'className="ef-input"',
  "Shared centered area input missing"
);

has(
  "مساحت",
  "Article 51 area label missing"
);

/* ============================================================
 * 8. Calculate button
 * ============================================================ */

has(
  "<CalculateButton",
  "Shared CalculateButton missing"
);

has(
  "محاسبه دستمزد",
  "Calculate button text missing"
);

/* ============================================================
 * 9. Result card
 * ============================================================ */

has(
  "<FeeResultCard",
  "Shared FeeResultCard missing"
);

has(
  'title="دستمزد کارشناسی"',
  "Fee result title missing"
);

has(
  "expertFeeToman",
  "Expert fee result contract missing"
);

/* ============================================================
 * 10. Article 52 increase
 * ============================================================ */

has(
  "additionalPercent",
  "Additional-percent result contract missing"
);

has(
  "ضریب افزایشی اعمال‌شده",
  "Additional-percent result row missing"
);

has(
  "در صورت نیاز",
  "Article 52 surveying note missing"
);

/* ============================================================
 * 11. Mission
 * ============================================================ */

has(
  "<MissionSelector",
  "Shared MissionSelector missing"
);

has(
  'title="مأموریت کارشناسی"',
  "Mission section title missing"
);

has(
  "missionType",
  "Mission type contract missing"
);

has(
  "missionDays",
  "Mission days contract missing"
);

/* ============================================================
 * 12. Legacy local UI must be removed
 * ============================================================ */

notHas(
  "Vazirmatn, IRANSans",
  "Legacy local font stack must be removed"
);

notHas(
  "const card=",
  "Legacy local card style must be removed"
);

notHas(
  'background:num>0?"#1565c0"',
  "Legacy custom calculate button must be removed"
);

notHas(
  "missionChoice",
  "Legacy mission-choice UI must be removed"
);

notHas(
  "fontFamily:font",
  "Legacy inline font declaration must be removed"
);

/* ============================================================
 * 13. Final confirmation
 * ============================================================ */

console.log(
  "AGRICULTURE SHARED UI: ALL TESTS PASSED"
);