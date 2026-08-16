import fs from "node:fs";
import path from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`ARTICLE 11 FINAL AMOUNT REGRESSION TEST FAILED: ${message}`);
  }
}

const source = fs.readFileSync(
  path.resolve("src/components/Article11CalculatorPanel.tsx"),
  "utf8",
);

for (const token of [
  "calculateArticle11Engine({",
  "evaluationValueToman,",
  "expertCount,",
  "panelFieldMode,",
  "increaseRuleCode:",
  "applyFiftyPercentIncrease:",
  "calculateMission({",
  "missionFeeToman:",
  "increaseRuleCode:",
  "applyFiftyPercentIncrease:",
]) {
  assert(source.includes(token), `existing financial contract missing: ${token}`);
}

assert(
  source.includes("const finalCalculatedFeeToman ="),
  "finalCalculatedFeeToman contract missing",
);
assert(
  source.includes("grossFeeToman:\n        finalCalculatedFeeToman"),
  "saved amount is not the final calculated amount",
);

// Institutional deductions belong to the Records financial layer, not Article 11.
assert(
  !source.includes("0.05 * finalCalculatedFeeToman"),
  "5% deduction was incorrectly added to Article 11 UI",
);
assert(
  !source.includes("0.10 * finalCalculatedFeeToman"),
  "10% deduction was incorrectly added to Article 11 UI",
);

console.log("ARTICLE 11 FINAL AMOUNT REGRESSION: ALL TESTS PASSED");
