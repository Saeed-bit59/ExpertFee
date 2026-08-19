import fs from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`HOME QUICK TYPOGRAPHY TEST FAILED: ${message}`);
}

const source = fs.readFileSync("src/pages/HomePage.tsx", "utf8");
const quickStart = source.indexOf('data-testid="home-quick-calculation"');
const servicesStart = source.indexOf('title="اجاره‌بها"', quickStart);

assert(quickStart >= 0 && servicesStart > quickStart, "quick section boundaries missing");
const quickSection = source.slice(quickStart, servicesStart);

assert(quickSection.includes('className="home-quick-calculation"'), "protected quick typography class missing");
assert(quickSection.includes('fontFamily: "inherit"'), "quick controls must inherit the Persian font stack");
assert(!quickSection.includes('fontFamily: "Tahoma"'), "quick section must not force Tahoma");
assert(!quickSection.includes('fontFamily: "Arial"'), "quick section must not force Arial");

console.log("HOME QUICK TYPOGRAPHY: ALL TESTS PASSED");
