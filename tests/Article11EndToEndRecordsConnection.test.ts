import fs from "node:fs";
import path from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`ARTICLE 11 END-TO-END RECORDS TEST FAILED: ${message}`);
  }
}

function read(relativePath: string): string {
  return fs.readFileSync(path.resolve(relativePath), "utf8");
}

const app = read("src/App.tsx");
const article11 = read("src/components/Article11CalculatorPanel.tsx");
const records = read("src/pages/ExpertRecordsPage.tsx");

/*
 * 1. Article 11 must create an ExpertCaseDraft through the existing callback.
 */
for (const token of [
  "onSaveCalculation",
  "tariffArticle",
  "grossFeeToman",
  "sourceCalculation",
  '"ARTICLE_11"',
  "evaluationValueToman",
  "expertCount",
  "panelFieldMode",
  "missionType",
  "missionDays",
  "missionFeeToman",
  "increaseRuleCode",
  "applyFiftyPercentIncrease",
]) {
  assert(
    article11.includes(token),
    `Article 11 draft field missing: ${token}`,
  );
}

assert(
  /tariffArticle\s*:\s*11/.test(article11),
  "Article 11 tariffArticle must be 11",
);

assert(
  /grossFeeToman\s*:\s*finalCalculatedFeeToman/.test(article11),
  "Article 11 must transfer finalCalculatedFeeToman as grossFeeToman",
);

/*
 * 2. App must carry the draft into ExpertRecordsPage.
 */
for (const token of [
  "pendingExpertCaseDraft",
  "setPendingExpertCaseDraft",
  "initialDraft=",
  "<ExpertRecordsPage",
  "onDraftConsumed",
]) {
  assert(app.includes(token), `App draft navigation contract missing: ${token}`);
}

/*
 * 3. Records page must consume the draft and prefill the amount.
 */
for (const token of [
  "initialDraft.grossFeeToman",
  "initialDraft.calculationCategory",
  "initialDraft.tariffArticle",
  "setActiveDraft(initialDraft)",
  "setGrossFee(",
  "نتیجه نهایی محاسبه به فرم ثبت سابقه منتقل شد",
]) {
  assert(
    records.includes(token),
    `Records draft consumption contract missing: ${token}`,
  );
}

/*
 * 4. Records save must persist the transferred gross amount.
 */
assert(
  /grossFeeToman\s*,/.test(records) || /grossFeeToman\s*[,}]/.test(records),
  "Records save payload must contain grossFeeToman",
);

for (const token of [
  "repository.create({",
  "referralSource",
  "calculationCategory",
  "tariffArticle",
  "subject",
  "grossFeeToman",
]) {
  assert(records.includes(token), `Repository save contract missing: ${token}`);
}

/*
 * 5. Financial layer must remain in Records, not Article 11.
 */
assert(
  records.includes("calculateExpertCaseFinancials(") &&
    records.includes("grossFeeIsSafe ? grossFeeToman : 0"),
  "Records financial calculation layer is missing",
);

assert(
  !article11.includes("calculateExpertCaseFinancials("),
  "Institutional deduction logic must not be moved into Article 11",
);

/*
 * 6. Payment lifecycle must remain connected.
 */
for (const token of [
  "repository.markReceived(",
  "repository.markPending(record.id)",
  "record.paymentStatus",
  "receivedAmountToman",
  "pendingReceivableToman",
]) {
  assert(
    records.includes(token),
    `Payment lifecycle contract missing: ${token}`,
  );
}

console.log("ARTICLE 11 END-TO-END RECORDS CONNECTION: ALL TESTS PASSED");
