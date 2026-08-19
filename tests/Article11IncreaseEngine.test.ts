import { calculateArticle11Engine } from "../src/engine/Article11Engine";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

const standard = calculateArticle11Engine({
  evaluationValueToman: 10_000_000_000,
});
assert(!standard.increaseRuleApplied, "Standard mode has no increase");

const contract = calculateArticle11Engine({
  evaluationValueToman: 10_000_000_000,
  increaseRuleCode: "NOTE3_CONTRACT_FULL",
});
assert(contract.increaseRuleApplied, "Contract increase is applied");
assert(contract.increaseRate === 1, "Contract rate is 100 percent");
assert(
  contract.feePerExpertToman >= contract.feeAfterAdjustmentToman,
  "Positive increase does not lower the fee",
);

const capped = calculateArticle11Engine({
  evaluationValueToman: 500_000_000_000,
  increaseRuleCode: "NOTE3_CONTRACT_FULL",
});
assert(capped.feeAfterAdjustmentToman === 135_000_000, "Base reaches 1405 cap");
assert(capped.feePerExpertToman === 135_000_000, "Final fee stays at 1405 cap");
assert(
  capped.feePerExpertToman >= capped.feeAfterAdjustmentToman,
  "Capped increase is non-decreasing",
);

const intangible = calculateArticle11Engine({
  evaluationValueToman: 10_000_000_000,
  increaseRuleCode: "NOTE4_INTANGIBLE_ASSETS",
});
assert(intangible.increaseRuleNoteNumber === 4, "Intangible assets use Note 4");

let note1ReferralRequired = false;
try {
  calculateArticle11Engine({
    evaluationValueToman: 5_000_000_000_000,
  });
} catch (error) {
  note1ReferralRequired =
    error instanceof Error && error.message.includes("مبلغ قطعی محاسبه نمی‌کند");
}
assert(note1ReferralRequired, "Exactly 5 HEMMAT requires council decision");

let deprecatedRuleRejected = false;
try {
  calculateArticle11Engine({
    evaluationValueToman: 10_000_000_000,
    increaseRuleCode: "NOTE4_DAMAGE",
  });
} catch {
  deprecatedRuleRejected = true;
}
assert(deprecatedRuleRejected, "Deprecated damage rule is rejected");

console.log("Article 11 increase engine tests completed.");
