import { calculateArticle23 } from "../src/engine/movable-property/Article23Calculator";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

const zero = calculateArticle23({
  article11FeeToman: 0,
  mode: "MOVABLE_PROPERTY",
});
assert(zero.finalFeeToman === 0, "Movable valuation has no independent minimum");

const movable = calculateArticle23({
  article11FeeToman: 130_000_000,
  mode: "MOVABLE_PROPERTY",
});
assert(movable.finalFeeToman === 130_000_000, "Movable valuation preserves Article 11 fee");
assert(!movable.maximumApplied, "Movable valuation does not use old 118 million cap");

const household = calculateArticle23({
  article11FeeToman: 100_000_000,
  mode: "HOUSEHOLD_OFFICE",
});
assert(household.increaseFeeToman === 20_000_000, "Household and office increase is 20 percent");
assert(household.finalFeeToman === 120_000_000, "Household increase is applied once");

const capped = calculateArticle23({
  article11FeeToman: 130_000_000,
  mode: "HOUSEHOLD_OFFICE",
});
assert(capped.finalFeeToman === 135_000_000, "Household result respects 1405 cap");

let invalidRejected = false;
try {
  calculateArticle23({
    article11FeeToman: -1,
    mode: "MOVABLE_PROPERTY",
  });
} catch {
  invalidRejected = true;
}
assert(invalidRejected, "Invalid Article 23 input is rejected");

console.log("Article 23 tariff 1405 tests completed.");
