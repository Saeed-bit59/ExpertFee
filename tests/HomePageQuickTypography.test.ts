import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(
      `HOME QUICK TYPOGRAPHY TEST FAILED: ${message}`
    );
  }
}

const file = path.resolve(
  process.cwd(),
  "src/pages/HomePage.tsx"
);

assert(
  fs.existsSync(file),
  "HomePage.tsx is missing"
);

const source = fs.readFileSync(file, "utf8");

function has(token: string, message: string): void {
  assert(source.includes(token), message);
}

has(
  'from "../components/ui/CalculateButton"',
  "Reference CalculateButton import missing"
);

has(
  'from "../components/ui/FeeResultCard"',
  "Reference FeeResultCard import missing"
);

has(
  "<CalculateButton",
  "Quick calculation must render the reference CalculateButton"
);

has(
  "<FeeResultCard",
  "Quick result must render the reference FeeResultCard"
);

has(
  "feeToman={quickFee}",
  "Quick fee must be passed directly to FeeResultCard"
);

has(
  'title="حق‌الزحمه پایه بر اساس ماده ۱۱"',
  "Quick result title missing"
);

const quickStart = source.indexOf(
  'data-testid="home-quick-calculation"'
);

const servicesStart = source.indexOf(
  "Services Heading",
  quickStart
);

assert(
  quickStart >= 0 && servicesStart > quickStart,
  "Quick calculation section boundaries not found"
);

const quickSection = source.slice(
  quickStart,
  servicesStart
);

assert(
  !quickSection.includes(
    'fontFamily: "Tahoma"'
  ),
  "Quick calculation must not override the reference Persian font with Tahoma"
);

assert(
  !quickSection.includes(
    'fontFamily: "Arial"'
  ),
  "Quick calculation must not override the reference Persian font with Arial"
);

assert(
  !quickSection.includes(
    'fontSize: "clamp(22px'
  ),
  "Quick result must not use the legacy custom result font size"
);

assert(
  !quickSection.includes(
    '"linear-gradient(90deg, #1565c0, #0d5bd7)"'
  ),
  "Quick button must not use the legacy custom button styling"
);

console.log(
  "HOME QUICK TYPOGRAPHY: ALL TESTS PASSED"
);
