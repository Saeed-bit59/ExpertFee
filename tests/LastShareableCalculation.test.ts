import {
  loadLastShareableCalculation,
  saveLastShareableCalculation,
} from "../src/share/LastShareableCalculation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`LAST SHAREABLE CALCULATION TEST FAILED: ${message}`);
}

const data = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  },
});

saveLastShareableCalculation({
  evaluationValueToman: 100_000_000,
  expertCount: 1,
  calculatedFeeToman: 2_225_000,
  calculationTitle: "آزمون",
});
assert(loadLastShareableCalculation()?.calculatedFeeToman === 2_225_000, "valid result was not restored");

data.set("expertfee:last-shareable-calculation", JSON.stringify({
  evaluationValueToman: Number.MAX_SAFE_INTEGER + 1,
  expertCount: 0,
  calculatedFeeToman: -1,
}));
assert(loadLastShareableCalculation() === undefined, "unsafe persisted result must be rejected");
assert(!data.has("expertfee:last-shareable-calculation"), "invalid persisted result must be removed");

console.log("LAST SHAREABLE CALCULATION: ALL TESTS PASSED");
