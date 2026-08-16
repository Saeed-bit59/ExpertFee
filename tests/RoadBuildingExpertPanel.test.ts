import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`ROAD BUILDING EXPERT PANEL TEST FAILED: ${message}`);
  }
}

const file = path.resolve(process.cwd(), "src/pages/RoadBuildingPage.tsx");
assert(fs.existsSync(file), "RoadBuildingPage.tsx is missing");
const source = fs.readFileSync(file, "utf8");

const has = (token: string, message: string) =>
  assert(source.includes(token), message);

const notHas = (token: string, message: string) =>
  assert(!source.includes(token), message);

/* Shared expert-count component */
has(
  'from "../components/ui/ExpertCountSelector"',
  "ExpertCountSelector import missing"
);
has(
  "const [expertCount, setExpertCount]",
  "Expert count state missing"
);
has(
  "<ExpertCountSelector",
  "ExpertCountSelector UI missing"
);
has(
  'title="تعداد کارشناسان"',
  "Expert count title missing"
);

/* Article-11-like valuation articles */
has(
  "article === 33 || article === 37",
  "Valuation-based expert-panel eligibility contract missing"
);
has(
  '"دستمزد هر کارشناس"',
  "Per-expert fee row missing"
);
has(
  '"مجموع دستمزد هیأت"',
  "Panel total fee row missing"
);
has(
  '"مجموع دستمزد هیأت کارشناسی"',
  "Panel result title missing"
);

/* Article 42 must not be visible/selectable */
notHas(
  '42: "امور ثبتی وابسته به ماده ۹"',
  "Article 42 must be removed from the dropdown title map"
);
notHas(
  "بررسی ماده ۴۲",
  "Article 42 standalone UI must be removed"
);

/*
 * Keep case 42 in the engine switch for type/backward compatibility.
 * The UI cannot select it because it is absent from titles.
 */
has(
  "case 42:",
  "Engine compatibility case 42 should remain"
);

/* Existing Shared UI remains */
has("<MoneyInput", "MoneyInput missing");
has("<CalculateButton", "CalculateButton missing");
has("<FeeResultCard", "FeeResultCard missing");
has("<MissionSelector", "MissionSelector missing");
has(
  'className="ef-back-button road-building-back-button"',
  "Shared back button missing"
);

console.log("ROAD BUILDING EXPERT PANEL: ALL TESTS PASSED");
