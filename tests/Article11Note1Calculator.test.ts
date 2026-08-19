import {
  NOTE1_STATUTORY_MAXIMUM_FEE_TOMAN,
  NOTE1_THRESHOLD_TOMAN,
  calculateArticle11Note1,
  isArticle11Note1Applicable,
} from "../src/engine/Article11Note1Calculator";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

assert(
  !isArticle11Note1Applicable(NOTE1_THRESHOLD_TOMAN - 1),
  "Value below 5 HEMMAT is outside Note 1",
);
assert(
  isArticle11Note1Applicable(NOTE1_THRESHOLD_TOMAN),
  "Exactly 5 HEMMAT enters Note 1",
);
assert(
  isArticle11Note1Applicable(NOTE1_THRESHOLD_TOMAN + 1),
  "Value above 5 HEMMAT enters Note 1",
);

const referral = calculateArticle11Note1({
  evaluationValueToman: NOTE1_THRESHOLD_TOMAN,
  expertCount: 3,
  applyFiftyPercentIncrease: true,
});

assert(referral.requiresCouncilDecision, "Council decision is required");
assert(
  referral.statutoryMaximumFeePerExpertToman ===
    NOTE1_STATUTORY_MAXIMUM_FEE_TOMAN,
  "Statutory maximum is 300 million toman",
);
assert(referral.expertCount === 3, "Expert count is preserved");
assert(referral.warning.includes("مبلغ قطعی محاسبه نمی‌کند"), "No automatic fee warning");
assert(
  !("feePerExpert" in referral),
  "No unsupported calculated fee is returned",
);

let belowThresholdRejected = false;
try {
  calculateArticle11Note1({
    evaluationValueToman: NOTE1_THRESHOLD_TOMAN - 1,
  });
} catch {
  belowThresholdRejected = true;
}
assert(belowThresholdRejected, "Below-threshold referral is rejected");

let invalidExpertCountRejected = false;
try {
  calculateArticle11Note1({
    evaluationValueToman: NOTE1_THRESHOLD_TOMAN,
    expertCount: 0,
  });
} catch {
  invalidExpertCountRejected = true;
}
assert(invalidExpertCountRejected, "Invalid expert count is rejected");

console.log("Article 11 Note 1 council-referral tests completed.");
