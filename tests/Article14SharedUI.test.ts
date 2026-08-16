import fs from "node:fs";
import path from "node:path";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `ARTICLE 14 SHARED UI TEST FAILED: ${message}`
    );
  }
}

const file =
  path.resolve(
    process.cwd(),
    "src/components/Article14CalculatorPanel.tsx"
  );

assert(
  fs.existsSync(file),
  "Article14CalculatorPanel.tsx is missing"
);

const source =
  fs.readFileSync(
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

/*
 * Engine contracts stay intact.
 */
has(
  'from "../engine/Article14Calculator"',
  "Article14Calculator import missing"
);

has(
  "calculateArticle14({",
  "Article 14 calculation call missing"
);

has(
  "pastImageYearCount",
  "Past-image-year contract missing"
);

has(
  "hasAdditionalConnectedParcels",
  "Connected-parcels contract missing"
);

has(
  "additionalConnectedParcelCount",
  "Additional parcel count contract missing"
);

has(
  'from "../engine/MissionCalculator"',
  "MissionCalculator import missing"
);

has(
  "calculateMission({",
  "Mission calculation call missing"
);

/*
 * Shared UI contracts.
 */
[
  'from "./ui/PageHeader"',
  'from "./ui/SectionCard"',
  'from "./ui/CalculateButton"',
  'from "./ui/FeeResultCard"',
  'from "./ui/MissionSelector"'
].forEach((token) => {
  has(
    token,
    `Shared UI dependency missing: ${token}`
  );
});

has(
  'className="ef-page"',
  "Article 14 must use the shared page namespace"
);

has(
  'className="ef-form-shell"',
  "Article 14 must use the shared bounded form shell"
);

has(
  'eyebrow="ماده ۱۴"',
  "Article 14 eyebrow missing"
);

has(
  'title="تفسیر عکس‌های هوایی و ماهواره‌ای"',
  "Article 14 title missing"
);

has(
  "<CalculateButton",
  "Shared CalculateButton missing"
);

has(
  "محاسبه دستمزد",
  "Calculate action missing"
);

has(
  "<FeeResultCard",
  "Shared FeeResultCard missing"
);

has(
  "<MissionSelector",
  "Shared MissionSelector missing"
);

/*
 * User requirement:
 * do not add expert-count UI.
 */
notHas(
  "ExpertCountSelector",
  "Expert-count selector must NOT be added to Article 14"
);

notHas(
  "expertCount",
  "Article 14 must not introduce expert-count state/calculation"
);

/*
 * Remove the legacy font/button/card styling.
 */
notHas(
  "Vazirmatn, IRANSans",
  "Legacy local font stack must be removed"
);

notHas(
  "const card=",
  "Legacy local card style must be removed"
);

notHas(
  'background:"#1565c0"',
  "Legacy inline calculate-button style must be removed"
);

notHas(
  "fontFamily:font",
  "Legacy inline font declarations must be removed"
);

console.log(
  "ARTICLE 14 SHARED UI: ALL TESTS PASSED"
);
