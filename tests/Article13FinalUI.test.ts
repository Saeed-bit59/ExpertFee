import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`ARTICLE 13 FINAL UI TEST FAILED: ${message}`);
  }
}

function read(relativePath: string): string {
  const full = path.resolve(process.cwd(), relativePath);
  assert(fs.existsSync(full), `Missing file: ${relativePath}`);
  return fs.readFileSync(full, "utf8");
}

const panel = read("src/components/Article13CalculatorPanel.tsx");
const page = read("src/pages/Article13Page.tsx");
const css = read("src/styles/globals.css");

function has(source: string, token: string, message: string): void {
  assert(source.includes(token), message);
}

function notHas(source: string, token: string, message: string): void {
  assert(!source.includes(token), message);
}

/* Article 13 calculator stays on Shared UI */
has(panel, "<MoneyInput", "MoneyInput missing");
has(panel, "<CalculateButton", "CalculateButton missing");
has(panel, "<FeeResultCard", "FeeResultCard missing");
has(panel, "<MissionSelector", "MissionSelector missing");
has(panel, "calculateArticle13({", "Article 13 engine call missing");
has(panel, "calculateMission({", "Mission engine call missing");

/* Requested removal */
notHas(panel, "AdvancedOptions", "AdvancedOptions must be removed from Article 13");
notHas(panel, "جزئیات روش محاسبه", "Calculation details box must be removed");

/* Back button typography */
has(
  page,
  'className="article13-back-button"',
  "Article 13 back button class missing"
);
has(
  css,
  ".article13-back-button {",
  "Article 13 back button typography rule missing"
);
has(
  css,
  "font-family: var(--ef-font-family) !important;",
  "Shared Persian font family rule missing"
);

/* Do not reintroduce a page-local font on the back button */
const backIndex = page.indexOf('className="article13-back-button"');
assert(backIndex >= 0, "Back button not found");
const backSlice = page.slice(backIndex, backIndex + 1200);
notHas(
  backSlice,
  "fontFamily:",
  "Back button must not override the Shared UI font"
);

console.log("ARTICLE 13 FINAL UI: ALL TESTS PASSED");
