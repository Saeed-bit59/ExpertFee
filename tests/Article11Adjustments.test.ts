import { applyArticle11Adjustments } from "../src/engine/Article11Adjustments";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

const full = applyArticle11Adjustments(100_000_000, ["CONTRACT_FULL"]);
assert(full.adjustedFee === 200_000_000, "Full contract raw increase is 100 percent");
assert(full.finalFee === 135_000_000, "Full contract respects 1405 cap");

const partial = applyArticle11Adjustments(60_000_000, ["CONTRACT_PARTIAL"]);
assert(partial.finalFee === 90_000_000, "Partial contract adds 50 percent");

const intangible = applyArticle11Adjustments(60_000_000, ["INTANGIBLE_ASSET"]);
assert(intangible.finalFee === 90_000_000, "Intangible assets add 50 percent");
assert(intangible.appliedAdjustments[0]?.sourceNote === 4, "Intangible assets use Note 4");

const panel = applyArticle11Adjustments(100_000_000, [
  "MULTI_EXPERT_SAME_FIELD",
]);
assert(panel.finalFee === 70_000_000, "Article 56 same-field reduction is 30 percent");

for (const deprecated of ["DAMAGE", "USED_PARTS"] as const) {
  let rejected = false;
  try {
    applyArticle11Adjustments(10_000_000, [deprecated]);
  } catch {
    rejected = true;
  }
  assert(rejected, `${deprecated} is rejected for tariff 1405`);
}

console.log("Article 11 adjustment tests completed.");
