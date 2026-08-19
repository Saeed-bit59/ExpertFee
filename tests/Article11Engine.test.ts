import { calculateArticle11Engine } from "../src/engine/Article11Engine";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

const fixed = calculateArticle11Engine({
  evaluationValueToman: 50_000_000,
});
assert(fixed.mode === "STANDARD", "Value below Note 1 uses standard mode");
assert(fixed.feePerExpertToman === 2_000_000, "1405 fixed fee is 2 million toman");

const capped = calculateArticle11Engine({
  evaluationValueToman: 500_000_000_000,
});
assert(capped.feePerExpertToman === 135_000_000, "1405 cap is 135 million toman");

const sameFieldPanel = calculateArticle11Engine({
  evaluationValueToman: 10_000_000_000,
  expertCount: 3,
  panelFieldMode: "SAME_FIELD",
});
assert(
  sameFieldPanel.sameFieldThirtyPercentReductionApplied,
  "Article 56 same-field reduction is applied",
);
assert(
  sameFieldPanel.totalFeeToman ===
    sameFieldPanel.feePerExpertToman * sameFieldPanel.expertCount,
  "Panel total matches per-expert fee",
);

for (const value of [
  5_000_000_000_000,
  5_000_000_000_001,
  40_131_293_000_000,
]) {
  let referralRequired = false;
  try {
    calculateArticle11Engine({
      evaluationValueToman: value,
    });
  } catch (error) {
    referralRequired =
      error instanceof Error &&
      error.message.includes("مبلغ قطعی محاسبه نمی‌کند");
  }
  assert(referralRequired, `${value} requires council decision`);
}

console.log("Article 11 Engine tests completed.");
