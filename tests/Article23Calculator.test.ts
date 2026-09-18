import {
  calculateArticle23
} from "../src/engine/movable-property/Article23Calculator";


interface TestResult {
  name: string;
  passed: boolean;
}


const results: TestResult[] =
  [];


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
 * اموال منقول
 * ============================================================
 */

{

  const result =
    calculateArticle23({

      article11FeeToman:
        600_000,

      mode:
        "MOVABLE_PROPERTY"

    });


  testNumber(
    "Movable - Minimum",
    result.finalFeeToman,
    2_000_000
  );

}


{

  const result =
    calculateArticle23({

      article11FeeToman:
        12_500_000,

      mode:
        "MOVABLE_PROPERTY"

    });


  testNumber(
    "Movable - Normal",
    result.finalFeeToman,
    12_500_000
  );


  testNumber(
    "Movable - No Increase",
    result.increaseFeeToman,
    0
  );

}


{

  const result =
    calculateArticle23({

      article11FeeToman:
        135_000_000,

      mode:
        "MOVABLE_PROPERTY"

    });


  testNumber(
    "Movable - Maximum",
    result.finalFeeToman,
    135_000_000
  );

}


/*
 * تست دفاعی سقف
 */

{

  const result =
    calculateArticle23({

      article11FeeToman:
        130_000_000,

      mode:
        "MOVABLE_PROPERTY"

    });


  testNumber(
    "Movable - Maximum Protection",
    result.finalFeeToman,
    130_000_000
  );


  testBoolean(
    "Movable - Maximum Flag",
    result.maximumApplied,
    false
  );

}


/*
 * ============================================================
 * لوازم خانگی و اداری
 * ============================================================
 */


/*
 * 10,000,000 + 20%
 * =
 * 12,000,000
 */

{

  const result =
    calculateArticle23({

      article11FeeToman:
        10_000_000,

      mode:
        "HOUSEHOLD_OFFICE"

    });


  testNumber(
    "Household - Increase",
    result.increaseFeeToman,
    2_000_000
  );


  testNumber(
    "Household - Before Limits",
    result.feeBeforeLimitsToman,
    12_000_000
  );


  testNumber(
    "Household - Final",
    result.finalFeeToman,
    12_000_000
  );


  testBoolean(
    "Household - Maximum Not Applied",
    result.maximumApplied,
    false
  );

}


/*
 * 90,000,000 + 20%
 * =
 * 108,000,000
 */

{

  const result =
    calculateArticle23({

      article11FeeToman:
        90_000_000,

      mode:
        "HOUSEHOLD_OFFICE"

    });


  testNumber(
    "Household - Below Maximum",
    result.finalFeeToman,
    108_000_000
  );

}


/*
 * 100,000,000 + 20%
 * =
 * 120,000,000
 *
 * سقف:
 * 118,000,000
 */

{

  const result =
    calculateArticle23({

      article11FeeToman:
        100_000_000,

      mode:
        "HOUSEHOLD_OFFICE"

    });


  testNumber(
    "Household - Raw Above Maximum",
    result.feeBeforeLimitsToman,
    120_000_000
  );


  testNumber(
    "Household - Maximum Applied",
    result.finalFeeToman,
    120_000_000
  );


  testBoolean(
    "Household - Maximum Flag",
    result.maximumApplied,
    false
  );

}


/*
 * ماده 11 در سقف
 *
 * 118,000,000 + 20%
 * =
 * 141,600,000
 *
 * خروجی نهایی:
 * 118,000,000
 */

{

  const result =
    calculateArticle23({

      article11FeeToman:
        135_000_000,

      mode:
        "HOUSEHOLD_OFFICE"

    });


  testNumber(
    "Household - Maximum Article11 Increase",
    result.increaseFeeToman,
    27_000_000
  );


  testNumber(
    "Household - Raw Total At Article11 Maximum",
    result.feeBeforeLimitsToman,
    162_000_000
  );


  testNumber(
    "Household - Protected Maximum",
    result.finalFeeToman,
    135_000_000
  );


  testBoolean(
    "Household - Protected Maximum Flag",
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
  "Negative Fee Rejected",
  () => {

    calculateArticle23({

      article11FeeToman:
        -1,

      mode:
        "MOVABLE_PROPERTY"

    });

  }
);


/*
 * ============================================================
 * Final
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
  "ARTICLE 23 BENCHMARK"
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
    "Article 23 Benchmark FAILED."
  );

}


console.log(
  "ALL TESTS PASSED."
);
