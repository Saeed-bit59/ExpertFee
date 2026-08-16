import { calculateExpertCaseFinancials } from "../src/database/ExpertCaseFinancialRules";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`ARTICLE 11 RECORDS FINANCIAL SMOKE TEST FAILED: ${message}`);
  }
}

const gross = 100_000_000;

const judiciary = calculateExpertCaseFinancials("JUDICIARY", gross);
const center = calculateExpertCaseFinancials("CENTER", gross);
const bar = calculateExpertCaseFinancials("BAR_ASSOCIATION", gross);

assert(
  judiciary.institutionSharePercent === 5,
  `JUDICIARY share must be 5%, got ${judiciary.institutionSharePercent}`,
);

assert(
  center.institutionSharePercent === 10,
  `CENTER share must be 10%, got ${center.institutionSharePercent}`,
);

assert(
  bar.institutionSharePercent === 10,
  `BAR_ASSOCIATION share must be 10%, got ${bar.institutionSharePercent}`,
);

assert(
  judiciary.institutionShareToman === 5_000_000,
  `JUDICIARY share amount must be 5,000,000, got ${judiciary.institutionShareToman}`,
);

assert(
  judiciary.netReceivableToman === 95_000_000,
  `JUDICIARY net must be 95,000,000, got ${judiciary.netReceivableToman}`,
);

assert(
  center.institutionShareToman === 10_000_000,
  `CENTER share amount must be 10,000,000, got ${center.institutionShareToman}`,
);

assert(
  center.netReceivableToman === 90_000_000,
  `CENTER net must be 90,000,000, got ${center.netReceivableToman}`,
);

assert(
  bar.institutionShareToman === 10_000_000,
  `BAR_ASSOCIATION share amount must be 10,000,000, got ${bar.institutionShareToman}`,
);

assert(
  bar.netReceivableToman === 90_000_000,
  `BAR_ASSOCIATION net must be 90,000,000, got ${bar.netReceivableToman}`,
);

console.log("ARTICLE 11 RECORDS FINANCIAL SMOKE: ALL TESTS PASSED");
