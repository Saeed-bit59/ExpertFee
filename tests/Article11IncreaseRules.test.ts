import {
  ARTICLE11_INCREASE_RULES,
  ARTICLE11_MAXIMUM_FEE_TOMAN,
  applyArticle11IncreaseRule,
} from "../src/engine/Article11IncreaseRules";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

assert(ARTICLE11_INCREASE_RULES.length === 4, "Four active Article 11 increase rules");
assert(
  ARTICLE11_MAXIMUM_FEE_TOMAN === 135_000_000,
  "Article 11 maximum is 135 million toman",
);
assert(
  ARTICLE11_INCREASE_RULES.every(rule => [3, 4, 5].includes(rule.noteNumber)),
  "Notes 3, 4 and 5 are exposed",
);

const full = applyArticle11IncreaseRule({
  baseFeeToman: 50_000_000,
  ruleCode: "NOTE3_CONTRACT_FULL",
});
assert(full.finalFeeToman === 100_000_000, "Full contract adds 100 percent");

const partial = applyArticle11IncreaseRule({
  baseFeeToman: 60_000_000,
  ruleCode: "NOTE3_CONTRACT_PARTIAL",
});
assert(partial.finalFeeToman === 90_000_000, "Partial contract adds 50 percent");

const intangible = applyArticle11IncreaseRule({
  baseFeeToman: 60_000_000,
  ruleCode: "NOTE4_INTANGIBLE_ASSETS",
});
assert(intangible.finalFeeToman === 90_000_000, "Intangible assets add 50 percent");
assert(intangible.noteNumber === 4, "Intangible assets use Note 4");

const specialItems = applyArticle11IncreaseRule({
  baseFeeToman: 60_000_000,
  ruleCode: "NOTE5_SPECIAL_ITEMS",
});
assert(specialItems.finalFeeToman === 90_000_000, "Special items add 50 percent");
assert(specialItems.noteNumber === 5, "Special items use Note 5");

const capped = applyArticle11IncreaseRule({
  baseFeeToman: 135_000_000,
  ruleCode: "NOTE3_CONTRACT_FULL",
});
assert(capped.finalFeeToman === 135_000_000, "Increase respects 135 million cap");
assert(
  capped.finalFeeToman >= capped.baseFeeToman,
  "A positive increase never lowers an already valid base fee",
);

for (const deprecatedCode of [
  "NOTE4_DAMAGE",
  "NOTE7_INTANGIBLE_ASSETS",
] as const) {
  let rejected = false;
  try {
    applyArticle11IncreaseRule({
      baseFeeToman: 10_000_000,
      ruleCode: deprecatedCode,
    });
  } catch {
    rejected = true;
  }
  assert(rejected, `${deprecatedCode} is rejected for tariff 1405`);
}

let negativeRejected = false;
try {
  applyArticle11IncreaseRule({
    baseFeeToman: -1,
    ruleCode: "NOTE3_CONTRACT_FULL",
  });
} catch {
  negativeRejected = true;
}
assert(negativeRejected, "Negative base fee is rejected");

console.log("Article 11 increase rule tests completed.");
