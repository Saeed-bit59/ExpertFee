import fs from "node:fs";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`EXPERT RECORDS REPORTING TEST FAILED: ${message}`);
  }
}

const page = fs.readFileSync("src/pages/ExpertRecordsPage.tsx", "utf8");
const service = fs.readFileSync("src/reports/ExpertCaseReportService.ts", "utf8");
const excel = fs.readFileSync("src/reports/ExpertCaseExcelExporter.ts", "utf8");

assert(page.includes('dateMode'), "Date basis filter missing");
assert(page.includes('dateFrom'), "Date-from filter missing");
assert(page.includes('dateTo'), "Date-to filter missing");
assert(page.includes('filter.createdFrom'), "Created-from repository filter missing");
assert(page.includes('filter.createdTo'), "Created-to repository filter missing");
assert(page.includes('filter.receivedFrom'), "Received-from repository filter missing");
assert(page.includes('filter.receivedTo'), "Received-to repository filter missing");
assert(page.includes('خروجی Excel'), "Excel export button missing");
assert(page.includes('buildExpertCaseReport(records)'), "Active report calculation missing");

assert(service.includes('receivedAmountToman += record.receivedAmountToman'), "Actual received income aggregation missing");
assert(service.includes('paymentStatus === "PENDING"'), "Pending receivable aggregation missing");
assert(service.includes('byReferralSource'), "Referral-source breakdown missing");

assert(excel.includes('خلاصه مالی'), "Financial summary worksheet missing");
assert(excel.includes('جزئیات پرونده‌ها'), "Case details worksheet missing");
assert(excel.includes('مطالبات وصول‌نشده'), "Pending receivables worksheet missing");
assert(excel.includes('application/vnd.ms-excel'), "Excel MIME contract missing");
assert(excel.includes('DisplayRightToLeft'), "RTL Excel worksheet contract missing");

console.log("EXPERT RECORDS REPORTING: ALL TESTS PASSED");
