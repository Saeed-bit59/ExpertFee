import fs from "node:fs";
import path from "node:path";

function assert(
  condition: unknown,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(
      `ARTICLE 11 RECORDS CONNECTION TEST FAILED: ${message}`
    );
  }
}

const source = fs.readFileSync(
  path.resolve(
    "src/components/Article11CalculatorPanel.tsx"
  ),
  "utf8"
);

function has(text: string, message: string): void {
  assert(
    source.includes(text),
    message
  );
}

function hasRegex(
  pattern: RegExp,
  message: string
): void {
  assert(
    pattern.test(source),
    message
  );
}

/*
 * ---------------------------------------------------------
 * 1. Draft / Records contract
 * ---------------------------------------------------------
 */

has(
  'import type { ExpertCaseDraft } from "../records/ExpertCaseDraft";',
  "ExpertCaseDraft import missing"
);

has(
  "onSaveCalculation",
  "onSaveCalculation contract missing"
);

/*
 * ---------------------------------------------------------
 * 2. Final amount contract
 * ---------------------------------------------------------
 */

has(
  "const finalCalculatedFeeToman",
  "finalCalculatedFeeToman contract missing"
);

hasRegex(
  /grossFeeToman\s*:\s*finalCalculatedFeeToman/,
  "Saved gross fee must equal finalCalculatedFeeToman"
);

/*
 * ---------------------------------------------------------
 * 3. Article 11 identification
 * ---------------------------------------------------------
 */

hasRegex(
  /tariffArticle\s*:\s*11/,
  "Article 11 tariffArticle contract missing"
);

hasRegex(
  /sourceCalculation\s*:\s*"ARTICLE_11"/,
  "ARTICLE_11 sourceCalculation contract missing"
);

/*
 * ---------------------------------------------------------
 * 4. Calculation inputs must survive
 * ---------------------------------------------------------
 */

has(
  "evaluationValueToman",
  "evaluationValueToman contract missing"
);

has(
  "expertCount",
  "expertCount contract missing"
);

has(
  "panelFieldMode",
  "panelFieldMode contract missing"
);

has(
  "missionType",
  "missionType contract missing"
);

has(
  "missionDays",
  "missionDays contract missing"
);

has(
  "missionFeeToman",
  "missionFeeToman contract missing"
);

/*
 * ---------------------------------------------------------
 * 5. Increase coefficients must survive
 * ---------------------------------------------------------
 */

has(
  "increaseRuleCode",
  "increaseRuleCode contract missing"
);

has(
  "applyFiftyPercentIncrease",
  "applyFiftyPercentIncrease contract missing"
);

/*
 * ---------------------------------------------------------
 * 6. UI confirmation of the amount being transferred
 * ---------------------------------------------------------
 */

has(
  'data-testid="article11-save-result"',
  "Article 11 save-result UI missing"
);

has(
  'data-testid="article11-save-amount"',
  "Article 11 save amount UI missing"
);

has(
  'data-testid="article11-save-calculation"',
  "Article 11 save button missing"
);

/*
 * ---------------------------------------------------------
 * 7. No duplicate institutional deduction in Article 11
 * ---------------------------------------------------------
 */

assert(
  !source.includes(
    "0.05 * finalCalculatedFeeToman"
  ),
  "5% institutional deduction must not be applied in Article 11 UI"
);

assert(
  !source.includes(
    "0.10 * finalCalculatedFeeToman"
  ),
  "10% institutional deduction must not be applied in Article 11 UI"
);

console.log(
  "ARTICLE 11 RECORDS CONNECTION: ALL TESTS PASSED"
);