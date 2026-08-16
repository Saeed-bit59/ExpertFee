import fs from "node:fs";
import path from "node:path";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `SHARED UI LAYOUT PROTECTION FAILED: ${message}`
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
    `Missing file: ${relativePath}`
  );

  return fs.readFileSync(
    fullPath,
    "utf8"
  );
}

const css = read(
  "src/styles/globals.css"
);

for (const selector of [
  ".ef-form-shell",
  ".ef-section-card",
  ".ef-money-control",
  ".ef-money-input",
  ".ef-money-unit",
  ".ef-calculate-button",
  ".ef-result-card",
  ".ef-counter",
  ".ef-choice-grid",
  ".ef-choice",
  ".ef-mission-box",
  ".ef-advanced"
]) {
  assert(
    css.includes(selector),
    `Protected selector missing: ${selector}`
  );
}

assert(
  css.includes(
    ".ef-page button,"
  ),
  "Shared controls must be scoped under .ef-page"
);

assert(
  css.includes(
    ".ef-page input,"
  ),
  "Shared inputs must be scoped under .ef-page"
);

assert(
  css.includes(
    "!important"
  ),
  "Layout protection against legacy global CSS is missing"
);

assert(
  css.includes(
    "@media (max-width: 560px)"
  ),
  "Mobile responsive contract is missing"
);

console.log(
  "SHARED UI LAYOUT PROTECTION: ALL TESTS PASSED"
);
