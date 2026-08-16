Article 11 -> Records End-to-End Regression V1

This package adds tests only. It does not modify application source files.

Test 1:
npx tsx tests/Article11EndToEndRecordsConnection.test.ts

Test 2:
npx tsx tests/Article11RecordsFinancialSmoke.test.ts

Then:
npx tsc --noEmit

Expected:
ARTICLE 11 END-TO-END RECORDS CONNECTION: ALL TESTS PASSED
ARTICLE 11 RECORDS FINANCIAL SMOKE: ALL TESTS PASSED

The financial smoke test uses a 100,000,000 Toman reference:
JUDICIARY -> 5% -> 95,000,000 net
CENTER -> 10% -> 90,000,000 net
BAR_ASSOCIATION -> 10% -> 90,000,000 net
