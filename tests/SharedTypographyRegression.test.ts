import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(
      `SHARED TYPOGRAPHY REGRESSION TEST FAILED: ${message}`
    );
  }
}

const file = path.resolve(
  process.cwd(),
  "src/styles/globals.css"
);

assert(
  fs.existsSync(file),
  "src/styles/globals.css is missing"
);

const css = fs.readFileSync(file, "utf8");

function has(token: string, message: string): void {
  assert(css.includes(token), message);
}

has(
  '@import "./fonts.css";',
  "fonts.css import missing"
);

has(
  '@import "./theme.css";',
  "theme.css import missing"
);

has(
  ".ef-section-card button,",
  "Shared controls are not typography-protected outside .ef-page"
);

has(
  ".ef-result-card *,",
  "FeeResultCard descendants are not typography-protected"
);

has(
  ".ef-calculate-button {",
  "CalculateButton typography contract missing"
);

has(
  "font-family: var(--ef-font-family) !important;",
  "Shared Persian font family contract missing"
);

has(
  ".ef-result-value {",
  "Fee result typography contract missing"
);

has(
  "font-size: var(--ef-font-result) !important;",
  "Fee result size must come from Design System token"
);

has(
  ".home-quick-calculation .ef-calculate-button,",
  "HomePage quick CalculateButton typography protection missing"
);

has(
  ".home-quick-calculation .ef-result-card * {",
  "HomePage quick result typography protection missing"
);

has(
  "font-variant-numeric: normal !important;",
  "Numeric font variant protection missing"
);

console.log(
  "SHARED TYPOGRAPHY REGRESSION: ALL TESTS PASSED"
);
