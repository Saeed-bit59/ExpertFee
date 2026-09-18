import fs from "node:fs";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(
      `EXPERT RECORDS REPOSITORY UI TEST FAILED: ${message}`,
    );
  }
}

const page = fs.readFileSync(
  "src/pages/ExpertRecordsPage.tsx",
  "utf8",
);

/*
 * ========================================
 * Repository / Financial Contracts
 * ========================================
 */

[
  "../database/ExpertCaseRepository",
  "../database/ExpertCaseFinancialRules",
  "../database/ExpertCaseTypes",
  "new ExpertCaseRepository()",
  "calculateExpertCaseFinancials(",
  "grossFeeIsSafe ? grossFeeToman : 0",
  'referralSource === "JUDICIARY"',
  "processingInstitution",
  "caseNumber",
  "plaintiff",
  "defendant",
  "notificationNumber",
  "requestingAuthority",
  "repository.create",
  "repository.list",
  "repository.summary",
  "repository.markReceived",
  "repository.markPending",
  "repository.delete",
  "receivedAmountToman",
  "pendingReceivableToman",
].forEach((contract) => {
  assert(
    page.includes(contract),
    `Contract missing: ${contract}`,
  );
});

/*
 * ========================================
 * UI Contracts
 * ========================================
 */

/*
 * وضعیت وصول کامل
 */
assert(
  page.includes("اعلام وصول کامل"),
  "Full-receipt UI missing",
);

/*
 * وضعیت در انتظار وصول
 */
assert(
  page.includes("در انتظار وصول"),
  "Pending status UI missing",
);

/*
 * مبلغ واقعی وصول‌شده
 *
 * نام فعلی UI:
 * "مبلغ وصول‌شده واقعی"
 */
assert(
  page.includes("مبلغ وصول‌شده واقعی"),
  "Received summary UI missing",
);

/*
 * مطالبات وصول‌نشده
 *
 * نام فعلی UI:
 * "مطالبات وصول‌نشده"
 */
assert(
  page.includes("مطالبات وصول‌نشده"),
  "Pending summary UI missing",
);

/*
 * قرارداد فونت مشترک
 */
assert(
  page.includes('fontFamily: "inherit"'),
  "Shared font contract missing",
);

/*
 * ========================================
 * Financial Safety Contract
 * ========================================
 *
 * محاسبه درصدهای 5% و 10% نباید
 * مستقیماً داخل UI انجام شود.
 *
 * این محاسبات متعلق به
 * ExpertCaseFinancialRules است.
 */
assert(
  !page.includes("grossFeeToman * 0.05") &&
    !page.includes("grossFeeToman * 0.1") &&
    !page.includes("grossFeeToman * 0.10"),
  "Financial percentages must not be recalculated inside UI",
);

/*
 * ========================================
 * Final Result
 * ========================================
 */

console.log(
  "EXPERT RECORDS REPOSITORY UI: ALL TESTS PASSED",
);
