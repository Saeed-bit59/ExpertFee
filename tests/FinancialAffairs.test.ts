import { calculateFinancialAffairs } from "../src/engine/financial/FinancialCalculator";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

const auditing = calculateFinancialAffairs({
  article11FeeToman: 80_000_000,
  field: "ACCOUNTING_AUDITING",
  accountingMode: "ARTICLE_25_AUDITING",
});
assert(auditing.articleNumber === 25, "Auditing uses Article 25");
assert(auditing.finalFeeToman === 120_000_000, "Article 25 adds 50 percent");

const auditingCapped = calculateFinancialAffairs({
  article11FeeToman: 100_000_000,
  field: "ACCOUNTING_AUDITING",
  accountingMode: "ARTICLE_25_AUDITING",
});
assert(auditingCapped.finalFeeToman === 135_000_000, "Article 25 respects 1405 cap");

const article26 = calculateFinancialAffairs({
  article11FeeToman: 130_000_000,
  field: "ACCOUNTING_AUDITING",
  accountingMode: "ARTICLE_26_SHARE_VALUE",
});
assert(article26.finalFeeToman === 130_000_000, "Article 26 preserves Article 11 fee");

for (const field of [
  "COMMERCIAL_AFFAIRS",
  "ALIMONY",
  "MONETARY_CREDIT_INVESTMENT",
  "INSURANCE",
] as const) {
  const result = calculateFinancialAffairs({
    article11FeeToman: 130_000_000,
    field,
  });
  assert(result.finalFeeToman === 130_000_000, `${field} preserves Article 11 valuation`);
}

const zero = calculateFinancialAffairs({
  article11FeeToman: 0,
  field: "COMMERCIAL_AFFAIRS",
});
assert(zero.finalFeeToman === 0, "Financial valuation has no old minimum");

let missingModeRejected = false;
try {
  calculateFinancialAffairs({
    article11FeeToman: 10_000_000,
    field: "ACCOUNTING_AUDITING",
  });
} catch {
  missingModeRejected = true;
}
assert(missingModeRejected, "Missing accounting mode is rejected");

let negativeRejected = false;
try {
  calculateFinancialAffairs({
    article11FeeToman: -1,
    field: "COMMERCIAL_AFFAIRS",
  });
} catch {
  negativeRejected = true;
}
assert(negativeRejected, "Negative financial input is rejected");

console.log("Financial affairs tariff 1405 tests completed.");
