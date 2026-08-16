import {
  calculateArticle15,
  calculateWaterFixedFee,
  getArticle18Definition,
  calculateArticle20
} from "../src/engine/water/WaterEngineeringCalculator";


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
 * ARTICLE 15
 * ============================================================
 */


/*
 * تا 50 لیتر
 */

{

  const result =
    calculateArticle15({
      flowRateLps: 50
    });


  testNumber(
    "A15 - 50 L/s",
    result.finalFeeToman,
    600_000
  );

}


/*
 * کمتر از 50
 */

{

  const result =
    calculateArticle15({
      flowRateLps: 25
    });


  testNumber(
    "A15 - 25 L/s",
    result.finalFeeToman,
    600_000
  );

}


/*
 * 51 لیتر
 */

{

  const result =
    calculateArticle15({
      flowRateLps: 51
    });


  testNumber(
    "A15 - 51 L/s",
    result.finalFeeToman,
    600_400
  );

}


/*
 * 100 لیتر
 *
 * 600,000
 * +
 * 50 × 400
 */

{

  const result =
    calculateArticle15({
      flowRateLps: 100
    });


  testNumber(
    "A15 - 100 L/s",
    result.finalFeeToman,
    620_000
  );

}


/*
 * 1000 لیتر
 *
 * 950 × 400
 * = 380,000
 *
 * total = 980,000
 */

{

  const result =
    calculateArticle15({
      flowRateLps: 1000
    });


  testNumber(
    "A15 - 1000 L/s",
    result.finalFeeToman,
    980_000
  );


  testNumber(
    "A15 - 1000 second tier",
    result.secondTierFeeToman,
    380_000
  );

}


/*
 * 1001 لیتر
 */

{

  const result =
    calculateArticle15({
      flowRateLps: 1001
    });


  testNumber(
    "A15 - 1001 L/s",
    result.finalFeeToman,
    980_160
  );

}


/*
 * کنترل سقف
 */

{

  const result =
    calculateArticle15({
      flowRateLps:
        100_000
    });


  testNumber(
    "A15 - Maximum Cap",
    result.finalFeeToman,
    7_000_000
  );


  testBoolean(
    "A15 - Cap Activated",
    result.capped,
    true
  );

}


/*
 * ورودی نامعتبر
 */

testThrows(
  "A15 - Zero Flow",
  () => {

    calculateArticle15({
      flowRateLps: 0
    });

  }
);


testThrows(
  "A15 - Negative Flow",
  () => {

    calculateArticle15({
      flowRateLps: -10
    });

  }
);


/*
 * ============================================================
 * FIXED ARTICLES
 * ============================================================
 */

{

  const result =
    calculateWaterFixedFee(
      16
    );


  testNumber(
    "A16 - Fixed Fee",
    result.finalFeeToman,
    600_000
  );

}


{

  const result =
    calculateWaterFixedFee(
      17
    );


  testNumber(
    "A17 - Fixed Fee",
    result.finalFeeToman,
    1_600_000
  );

}


{

  const result =
    calculateWaterFixedFee(
      19
    );


  testNumber(
    "A19 - Fixed Fee",
    result.finalFeeToman,
    1_400_000
  );

}


{

  const result =
    calculateWaterFixedFee(
      21
    );


  testNumber(
    "A21 - Fixed Fee",
    result.finalFeeToman,
    1_000_000
  );

}


/*
 * ============================================================
 * ARTICLE 18
 * ============================================================
 */

{

  const result =
    getArticle18Definition();


  testBoolean(
    "A18 - Uses Article 11",
    result.usesArticle11,
    true
  );

}


/*
 * ============================================================
 * ARTICLE 20
 * ============================================================
 */


/*
 * تا 12 متر
 * حداقل
 */

{

  const result =
    calculateArticle20({

      mode:
        "CHANNEL_UP_TO_12M",

      lengthKm:
        0.5

    });


  testNumber(
    "A20 - Up To 12m Minimum",
    result.finalFeeToman,
    600_000
  );


  testBoolean(
    "A20 - Minimum Applied",
    result.minimumApplied,
    true
  );

}


/*
 * تا 12 متر
 * 3.5 km
 */

{

  const result =
    calculateArticle20({

      mode:
        "CHANNEL_UP_TO_12M",

      lengthKm:
        3.5

    });


  testNumber(
    "A20 - Up To 12m 3.5km",
    result.finalFeeToman,
    2_100_000
  );

}


/*
 * سقف 6 میلیون
 */

{

  const result =
    calculateArticle20({

      mode:
        "CHANNEL_UP_TO_12M",

      lengthKm:
        20

    });


  testNumber(
    "A20 - Up To 12m Maximum",
    result.finalFeeToman,
    6_000_000
  );


  testBoolean(
    "A20 - Up To 12m Cap Applied",
    result.maximumApplied,
    true
  );

}


/*
 * بیش از 12 متر
 */

{

  const result =
    calculateArticle20({

      mode:
        "RIVER_OR_CHANNEL_OVER_12M",

      lengthKm:
        5

    });


  testNumber(
    "A20 - Over 12m 5km",
    result.finalFeeToman,
    4_000_000
  );

}


/*
 * سقف 10 میلیون
 */

{

  const result =
    calculateArticle20({

      mode:
        "RIVER_OR_CHANNEL_OVER_12M",

      lengthKm:
        20

    });


  testNumber(
    "A20 - Over 12m Maximum",
    result.finalFeeToman,
    10_000_000
  );


  testBoolean(
    "A20 - Over 12m Cap Applied",
    result.maximumApplied,
    true
  );

}


/*
 * حقابه
 */

{

  const result =
    calculateArticle20({

      mode:
        "WATER_RIGHT"

    });


  testNumber(
    "A20 - Water Right",
    result.finalFeeToman,
    1_500_000
  );

}


/*
 * قدمت منابع
 */

{

  const result =
    calculateArticle20({

      mode:
        "WATER_SOURCE_AGE"

    });


  testNumber(
    "A20 - Water Source Age",
    result.finalFeeToman,
    1_000_000
  );

}


/*
 * طول منفی
 */

testThrows(
  "A20 - Negative Length",
  () => {

    calculateArticle20({

      mode:
        "CHANNEL_UP_TO_12M",

      lengthKm:
        -1

    });

  }
);


/*
 * ============================================================
 * FINAL REPORT
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
  "WATER ENGINEERING BENCHMARK"
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
    "Water Engineering Benchmark FAILED."
  );

}


console.log(
  "ALL TESTS PASSED."
);