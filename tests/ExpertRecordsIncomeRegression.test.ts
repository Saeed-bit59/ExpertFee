import {
  buildExpertCaseReport,
} from "../src/reports/ExpertCaseReportService";
import type { ExpertCaseRecord } from "../src/database/ExpertCaseTypes";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`EXPERT RECORDS INCOME REGRESSION FAILED: ${message}`);
  }
}

const records: ExpertCaseRecord[] = [
  {
    id: "a",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    referralSource: "JUDICIARY",
    processingInstitution: "CENTER",
    calculationCategory: "ارزیابی عمومی",
    tariffArticle: 11,
    grossFeeToman: 100_000_000,
    institutionSharePercent: 5,
    institutionShareToman: 5_000_000,
    netReceivableToman: 95_000_000,
    paymentStatus: "RECEIVED",
    receivedAt: "2026-01-10T00:00:00.000Z",
    receivedAmountToman: 95_000_000,
  },
  {
    id: "b",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
    referralSource: "CENTER",
    processingInstitution: "CENTER",
    calculationCategory: "ارزیابی عمومی",
    tariffArticle: 11,
    grossFeeToman: 200_000_000,
    institutionSharePercent: 10,
    institutionShareToman: 20_000_000,
    netReceivableToman: 180_000_000,
    paymentStatus: "PENDING",
    receivedAmountToman: 0,
  },
];

const report = buildExpertCaseReport(records);

assert(report.summary.recordCount === 2, "Record count mismatch");
assert(report.summary.grossFeeToman === 300_000_000, "Gross total mismatch");
assert(report.summary.institutionShareToman === 25_000_000, "Institution share mismatch");
assert(report.summary.netReceivableToman === 275_000_000, "Net receivable mismatch");
assert(report.summary.receivedAmountToman === 95_000_000, "Actual income must include received records only");
assert(report.summary.pendingReceivableToman === 180_000_000, "Pending receivable mismatch");
assert(report.summary.receivedCount === 1, "Received count mismatch");
assert(report.summary.pendingCount === 1, "Pending count mismatch");

console.log("EXPERT RECORDS INCOME REGRESSION: ALL TESTS PASSED");
