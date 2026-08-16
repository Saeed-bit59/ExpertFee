ExpertFee AI - Records Reporting V1

PURPOSE
Adds:
- Date range filtering
- Filter by registration date or receipt date
- Financial dashboard
- Breakdown by referral source
- Excel-compatible 3-sheet export
- No third-party Excel dependency

REPLACE
src/pages/ExpertRecordsPage.tsx

ADD
src/reports/ExpertCaseReportService.ts
src/reports/ExpertCaseExcelExporter.ts
tests/ExpertRecordsReporting.test.ts
tests/ExpertRecordsIncomeRegression.test.ts

EXCEL OUTPUT
The generated .xls file is SpreadsheetML (Excel XML 2003) and opens directly in Microsoft Excel.
It contains:
1. خلاصه مالی
2. جزئیات پرونده‌ها
3. مطالبات وصول‌نشده

IMPORTANT FINANCIAL RULE
Actual income = receivedAmountToman only.
Pending records are not counted as actual received income.

DATE FILTER
The page uses the browser date input.
- تاریخ ثبت سابقه -> createdFrom / createdTo
- تاریخ وصول -> receivedFrom / receivedTo

RUN
npx tsx tests/ExpertRecordsReporting.test.ts
npx tsx tests/ExpertRecordsIncomeRegression.test.ts
npx tsx tests/ExpertRecordsNavigation.test.ts
npx tsx tests/ExpertRecordsRepositoryUI.test.ts
npx tsx tests/ExpertCaseFinancialRules.test.ts
npx tsx tests/ExpertCaseRepository.test.ts
npx tsx tests/Article11RecordsConnection.test.ts
npx tsx tests/Article11FinalAmountRegression.test.ts
npx tsc --noEmit
