import {
  calculateFinancialAffairs
} from "../src/engine/financial/FinancialCalculator";


let passCount = 0;
let failCount = 0;


function expectEqual<T>(
  name: string,
  actual: T,
  expected: T
): void {

  if (actual === expected) {

    console.log(
      `PASS - ${name}`
    );

    passCount++;

  } else {

    console.error(
      `FAIL - ${name}`
    );

    console.error(
      "Expected:",
      expected
    );

    console.error(
      "Actual:",
      actual
    );

    failCount++;

  }

}


/* ============================================================
   Article 25
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "ACCOUNTING_AUDITING",
      accountingMode: "ARTICLE_25_AUDITING",
      article11FeeToman: 10_000_000
    });

  expectEqual(
    "Article25 number",
    result.articleNumber,
    25
  );

  expectEqual(
    "Article25 base",
    result.article11FeeToman,
    10_000_000
  );

  expectEqual(
    "Article25 increase",
    result.increaseFeeToman,
    5_000_000
  );

  expectEqual(
    "Article25 final",
    result.finalFeeToman,
    15_000_000
  );

}


/* ============================================================
   Article 25 - Ceiling
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "ACCOUNTING_AUDITING",
      accountingMode: "ARTICLE_25_AUDITING",
      article11FeeToman: 100_000_000
    });

  expectEqual(
    "Article25 ceiling",
    result.finalFeeToman,
    118_000_000
  );

  expectEqual(
    "Article25 ceiling flag",
    result.maximumApplied,
    true
  );

}


/* ============================================================
   Article 26 - Share Value
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "ACCOUNTING_AUDITING",
      accountingMode: "ARTICLE_26_SHARE_VALUE",
      article11FeeToman: 20_000_000
    });

  expectEqual(
    "Article26 share number",
    result.articleNumber,
    26
  );

  expectEqual(
    "Article26 share final",
    result.finalFeeToman,
    20_000_000
  );

}


/* ============================================================
   Article 26 - Financial Statements
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "ACCOUNTING_AUDITING",
      accountingMode:
        "ARTICLE_26_FINANCIAL_STATEMENTS",
      article11FeeToman: 25_000_000
    });

  expectEqual(
    "Article26 statements final",
    result.finalFeeToman,
    25_000_000
  );

}


/* ============================================================
   Article 26 - Costing
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "ACCOUNTING_AUDITING",
      accountingMode:
        "ARTICLE_26_COSTING",
      article11FeeToman: 30_000_000
    });

  expectEqual(
    "Article26 costing final",
    result.finalFeeToman,
    30_000_000
  );

}


/* ============================================================
   Article 27
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "COMMERCIAL_AFFAIRS",
      article11FeeToman: 18_000_000
    });

  expectEqual(
    "Article27 number",
    result.articleNumber,
    27
  );

  expectEqual(
    "Article27 final",
    result.finalFeeToman,
    18_000_000
  );

}


/* ============================================================
   Article 28
   One single item
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "ALIMONY",
      article11FeeToman: 12_000_000
    });

  expectEqual(
    "Article28 number",
    result.articleNumber,
    28
  );

  expectEqual(
    "Article28 title",
    result.subjectTitle,
    "تعیین نفقه"
  );

  expectEqual(
    "Article28 final",
    result.finalFeeToman,
    12_000_000
  );

}


/* ============================================================
   Article 29 - Investment
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field:
        "MONETARY_CREDIT_INVESTMENT",
      article11FeeToman:
        40_000_000
    });

  expectEqual(
    "Article29 investment number",
    result.articleNumber,
    29
  );

  expectEqual(
    "Article29 investment final",
    result.finalFeeToman,
    40_000_000
  );

}


/* ============================================================
   Article 29 - Insurance
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "INSURANCE",
      article11FeeToman: 45_000_000
    });

  expectEqual(
    "Article29 insurance number",
    result.articleNumber,
    29
  );

  expectEqual(
    "Article29 insurance final",
    result.finalFeeToman,
    45_000_000
  );

}


/* ============================================================
   Maximum Protection
   ============================================================ */

{

  const result =
    calculateFinancialAffairs({
      field: "INSURANCE",
      article11FeeToman:
        150_000_000
    });

  expectEqual(
    "Maximum protection",
    result.finalFeeToman,
    118_000_000
  );

}


/* ============================================================
   Final Report
   ============================================================ */

console.log(
  "\n=============================="
);

console.log(
  `PASS: ${passCount}`
);

console.log(
  `FAIL: ${failCount}`
);

console.log(
  "=============================="
);


if (failCount > 0) {

  throw new Error(
    "FINANCIAL AFFAIRS TEST FAILED"
  );

}


console.log(
  "ALL TESTS PASSED."
);