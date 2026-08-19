import {
  calculateArticle22Metal,
  calculateArticle22Mining,
} from "../src/engine/mining/Article22Calculator";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

const metalZero = calculateArticle22Metal({ article11FeeToman: 0 });
assert(metalZero.finalFeeToman === 0, "Metal valuation has no independent minimum");

const metal = calculateArticle22Metal({ article11FeeToman: 130_000_000 });
assert(metal.finalFeeToman === 130_000_000, "Metal valuation preserves Article 11 fee");
assert(!metal.maximumApplied, "Metal valuation does not use old 5 million cap");

const metalCapped = calculateArticle22Metal({ article11FeeToman: 140_000_000 });
assert(metalCapped.finalFeeToman === 135_000_000, "Metal valuation uses 1405 cap");

const surface = calculateArticle22Mining({
  article11FeeToman: 130_000_000,
  operationType: "SURFACE",
});
assert(surface.finalFeeToman === 130_000_000, "Surface mining preserves Article 11 fee");

const underground = calculateArticle22Mining({
  article11FeeToman: 50_000_000,
  operationType: "UNDERGROUND",
});
assert(underground.undergroundIncreaseFeeToman === 17_500_000, "Underground rate is 35 percent");
assert(underground.finalFeeToman === 67_500_000, "Underground increase is applied once");

const undergroundCapped = calculateArticle22Mining({
  article11FeeToman: 130_000_000,
  operationType: "UNDERGROUND",
});
assert(undergroundCapped.finalFeeToman === 135_000_000, "Underground result respects 1405 cap");

for (const calculator of [
  () => calculateArticle22Metal({ article11FeeToman: -1 }),
  () => calculateArticle22Mining({
    article11FeeToman: Number.NaN,
    operationType: "SURFACE",
  }),
]) {
  let rejected = false;
  try {
    calculator();
  } catch {
    rejected = true;
  }
  assert(rejected, "Invalid Article 22 input is rejected");
}

console.log("Article 22 tariff 1405 tests completed.");
