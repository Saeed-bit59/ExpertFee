import {
  calculateArticle22Metal,
  calculateArticle22Mining
} from "../src/engine/mining/Article22Calculator";


interface TestResult {
  name: string;
  passed: boolean;
}


const results: TestResult[] =
  [];


/*
 * ============================================================
 * Helpers
 * ============================================================
 */

function testNumber(
  name: string,
  actual: number,
  expected: number
): void {

  const passed =
    actual === expected;


  results.push({
    name,
    passed
  });


  console.log(
    passed
      ? `PASS - ${name}`
      : `FAIL - ${name}`,
    {
      expected,
      actual
    }
  );

}


function testBoolean(
  name: string,
  actual: boolean,
  expected: boolean
): void {

  const passed =
    actual === expected;


  results.push({
    name,
    passed
  });


  console.log(
    passed
      ? `PASS - ${name}`
      : `FAIL - ${name}`,
    {
      expected,
      actual
    }
  );

}


function testThrows(
  name: string,
  callback: () => void
): void {

  let passed =
    false;


  try {

    callback();

  } catch {

    passed =
      true;

  }


  results.push({
    name,
    passed
  });


  console.log(
    passed
      ? `PASS - ${name}`
      : `FAIL - ${name}`
  );

}


/*
 * ============================================================
 * فلزات
 * بند 1 ماده 22
 * ============================================================
 */


/*
 * کمتر از کف
 */

{

  const result =
    calculateArticle22Metal({
      article11FeeToman:
        1_000_000
    });


  testNumber(
    "Metal - Below Minimum",
    result.finalFeeToman,
    2_000_000
  );


  testBoolean(
    "Metal - Minimum Applied",
    result.minimumApplied,
    true
  );


  testBoolean(
    "Metal - Maximum Not Applied",
    result.maximumApplied,
    false
  );

}


/*
 * دقیقاً کف
 */

{

  const result =
    calculateArticle22Metal({
      article11FeeToman:
        2_000_000
    });


  testNumber(
    "Metal - Exact Minimum",
    result.finalFeeToman,
    2_000_000
  );


  testBoolean(
    "Metal - Exact Minimum Flag",
    result.minimumApplied,
    false
  );

}


/*
 * بین کف و سقف
 */

{

  const result =
    calculateArticle22Metal({
      article11FeeToman:
        3_500_000
    });


  testNumber(
    "Metal - Between Minimum And Maximum",
    result.finalFeeToman,
    3_500_000
  );


  testBoolean(
    "Metal - Minimum Not Applied",
    result.minimumApplied,
    false
  );


  testBoolean(
    "Metal - Maximum Not Applied",
    result.maximumApplied,
    false
  );

}


/*
 * دقیقاً سقف
 */

{

  const result =
    calculateArticle22Metal({
      article11FeeToman:
        5_000_000
    });


  testNumber(
    "Metal - Exact Maximum",
    result.finalFeeToman,
    5_000_000
  );


  testBoolean(
    "Metal - Exact Maximum Flag",
    result.maximumApplied,
    false
  );

}


/*
 * بالاتر از سقف
 */

{

  const result =
    calculateArticle22Metal({
      article11FeeToman:
        8_000_000
    });


  testNumber(
    "Metal - Above Maximum",
    result.finalFeeToman,
    5_000_000
  );


  testBoolean(
    "Metal - Maximum Applied",
    result.maximumApplied,
    true
  );

}


/*
 * مقدار صفر
 *
 * خروجی ماده 22 باید کف باشد.
 */

{

  const result =
    calculateArticle22Metal({
      article11FeeToman:
        0
    });


  testNumber(
    "Metal - Zero Uses Minimum",
    result.finalFeeToman,
    2_000_000
  );

}


/*
 * ============================================================
 * معادن روباز
 * بند 2 ماده 22
 * ============================================================
 */


/*
 * معدن روباز معمولی
 */

{

  const result =
    calculateArticle22Mining({

      article11FeeToman:
        10_000_000,

      operationType:
        "SURFACE"

    });


  testNumber(
    "Mining Surface - Normal",
    result.finalFeeToman,
    10_000_000
  );


  testNumber(
    "Mining Surface - No Increase",
    result.undergroundIncreaseFeeToman,
    0
  );


  testBoolean(
    "Mining Surface - Maximum Not Applied",
    result.maximumApplied,
    false
  );

}


/*
 * معدن روباز دقیقاً در سقف
 */

{

  const result =
    calculateArticle22Mining({

      article11FeeToman:
        118_000_000,

      operationType:
        "SURFACE"

    });


  testNumber(
    "Mining Surface - Exact Maximum",
    result.finalFeeToman,
    118_000_000
  );


  testBoolean(
    "Mining Surface - Exact Maximum Flag",
    result.maximumApplied,
    false
  );

}


/*
 * تست دفاعی:
 * اگر ورودی ماده 11 بیش از سقف باشد
 * ماده 22 اجازه عبور نمی‌دهد.
 */

{

  const result =
    calculateArticle22Mining({

      article11FeeToman:
        150_000_000,

      operationType:
        "SURFACE"

    });


  testNumber(
    "Mining Surface - Maximum Protection",
    result.finalFeeToman,
    118_000_000
  );


  testBoolean(
    "Mining Surface - Maximum Applied",
    result.maximumApplied,
    true
  );

}


/*
 * ============================================================
 * معادن زیرزمینی
 * ============================================================
 */


/*
 * 10,000,000
 * +
 * 35%
 *
 * = 13,500,000
 */

{

  const result =
    calculateArticle22Mining({

      article11FeeToman:
        10_000_000,

      operationType:
        "UNDERGROUND"

    });


  testNumber(
    "Mining Underground - Increase",
    result.undergroundIncreaseFeeToman,
    3_500_000
  );


  testNumber(
    "Mining Underground - Before Maximum",
    result.feeBeforeMaximumToman,
    13_500_000
  );


  testNumber(
    "Mining Underground - Final",
    result.finalFeeToman,
    13_500_000
  );


  testBoolean(
    "Mining Underground - Maximum Not Applied",
    result.maximumApplied,
    false
  );

}


/*
 * 80,000,000
 * +
 * 28,000,000
 *
 * = 108,000,000
 *
 * کمتر از سقف
 */

{

  const result =
    calculateArticle22Mining({

      article11FeeToman:
        80_000_000,

      operationType:
        "UNDERGROUND"

    });


  testNumber(
    "Mining Underground - Below Maximum",
    result.finalFeeToman,
    108_000_000
  );


  testBoolean(
    "Mining Underground - Below Maximum Flag",
    result.maximumApplied,
    false
  );

}


/*
 * 90,000,000
 * +
 * 31,500,000
 *
 * = 121,500,000
 *
 * اما سقف:
 * 118,000,000
 */

{

  const result =
    calculateArticle22Mining({

      article11FeeToman:
        90_000_000,

      operationType:
        "UNDERGROUND"

    });


  testNumber(
    "Mining Underground - Raw Above Maximum",
    result.feeBeforeMaximumToman,
    121_500_000
  );


  testNumber(
    "Mining Underground - Maximum Applied",
    result.finalFeeToman,
    118_000_000
  );


  testBoolean(
    "Mining Underground - Maximum Flag",
    result.maximumApplied,
    true
  );

}


/*
 * ماده 11 در سقف 118 میلیون
 *
 * افزایش نظری:
 * 41,300,000
 *
 * جمع نظری:
 * 159,300,000
 *
 * خروجی نهایی:
 * 118,000,000
 */

{

  const result =
    calculateArticle22Mining({

      article11FeeToman:
        118_000_000,

      operationType:
        "UNDERGROUND"

    });


  testNumber(
    "Mining Underground - Maximum Article11 Increase",
    result.undergroundIncreaseFeeToman,
    41_300_000
  );


  testNumber(
    "Mining Underground - Maximum Article11 Raw Total",
    result.feeBeforeMaximumToman,
    159_300_000
  );


  testNumber(
    "Mining Underground - Final Protected Maximum",
    result.finalFeeToman,
    118_000_000
  );


  testBoolean(
    "Mining Underground - Protected Maximum Flag",
    result.maximumApplied,
    true
  );

}


/*
 * ============================================================
 * Validation
 * ============================================================
 */

testThrows(
  "Metal - Negative Fee Rejected",
  () => {

    calculateArticle22Metal({
      article11FeeToman:
        -1
    });

  }
);


testThrows(
  "Mining - Negative Fee Rejected",
  () => {

    calculateArticle22Mining({

      article11FeeToman:
        -1,

      operationType:
        "SURFACE"

    });

  }
);


/*
 * ============================================================
 * Final Report
 * ============================================================
 */

const passedCount =
  results.filter(
    item => item.passed
  ).length;


const failedCount =
  results.length -
  passedCount;


console.log(
  "\n=============================="
);

console.log(
  "ARTICLE 22 BENCHMARK"
);

console.log(
  "=============================="
);

console.log(
  `PASS: ${passedCount}`
);

console.log(
  `FAIL: ${failedCount}`
);

console.log(
  "=============================="
);


if (
  failedCount > 0
) {

  throw new Error(
    "Article 22 Benchmark FAILED."
  );

}


console.log(
  "ALL TESTS PASSED."
);