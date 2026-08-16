import {
  calculateArticle14,
  ARTICLE14_BASE_FEE_TOMAN,
  ARTICLE14_PAST_YEAR_FEE_TOMAN,
  ARTICLE14_ADDITIONAL_PARCEL_RATE
} from "../src/engine/Article14Calculator";


/*
 * ==========================================
 * Article 14 Benchmark
 * ==========================================
 */


interface TestResult {
  name: string;
  passed: boolean;
  expected: number;
  actual: number;
}


const results: TestResult[] = [];


/*
 * ==========================================
 * Number Test
 * ==========================================
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
    passed,
    expected,
    actual
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


/*
 * ==========================================
 * Error Test
 * ==========================================
 */

function testThrows(
  name: string,
  callback: () => void
): void {

  let passed = false;

  try {

    callback();

  } catch {

    passed = true;

  }


  results.push({
    name,
    passed,
    expected: 1,
    actual: passed ? 1 : 0
  });


  console.log(
    passed
      ? `PASS - ${name}`
      : `FAIL - ${name}`
  );
}


/*
 * ==========================================
 * TEST 1
 *
 * یک پلاک
 * بدون تصویر سال گذشته
 * ==========================================
 */

{

  const result =
    calculateArticle14({

      pastImageYearCount: 0,

      hasAdditionalConnectedParcels:
        false,

      additionalConnectedParcelCount:
        0

    });


  testNumber(
    "Base Fee",
    result.baseFeeToman,
    600_000
  );


  testNumber(
    "Single Parcel Final Fee",
    result.finalFeeToman,
    600_000
  );


  testNumber(
    "Single Parcel Total Count",
    result.totalParcelCount,
    1
  );

}


/*
 * ==========================================
 * TEST 2
 *
 * سه سال تصویر گذشته
 * بدون پلاک اضافی
 *
 * 600,000
 * +
 * 3 × 50,000
 *
 * = 750,000
 * ==========================================
 */

{

  const result =
    calculateArticle14({

      pastImageYearCount: 3,

      hasAdditionalConnectedParcels:
        false,

      additionalConnectedParcelCount:
        0

    });


  testNumber(
    "Past Images - 3 Years",
    result.pastImagesAdditionalFeeToman,
    150_000
  );


  testNumber(
    "Past Images - Final Fee",
    result.finalFeeToman,
    750_000
  );

}


/*
 * ==========================================
 * TEST 3
 *
 * یک پلاک اضافی
 *
 * افزایش:
 *
 * 40% × 600,000
 * = 240,000
 *
 * نهایی:
 *
 * 840,000
 * ==========================================
 */

{

  const result =
    calculateArticle14({

      pastImageYearCount: 0,

      hasAdditionalConnectedParcels:
        true,

      additionalConnectedParcelCount:
        1

    });


  testNumber(
    "One Additional Parcel Fee",
    result.additionalParcelsFeeToman,
    240_000
  );


  testNumber(
    "One Additional Parcel Final Fee",
    result.finalFeeToman,
    840_000
  );


  testNumber(
    "One Additional Parcel Total Count",
    result.totalParcelCount,
    2
  );

}


/*
 * ==========================================
 * TEST 4
 *
 * دو پلاک اضافی
 * + سه سال تصویر گذشته
 *
 * پایه:
 * 600,000
 *
 * تصاویر:
 * 3 × 50,000 = 150,000
 *
 * پلاک:
 * 2 × 240,000 = 480,000
 *
 * نهایی:
 * 1,230,000
 * ==========================================
 */

{

  const result =
    calculateArticle14({

      pastImageYearCount: 3,

      hasAdditionalConnectedParcels:
        true,

      additionalConnectedParcelCount:
        2

    });


  testNumber(
    "Combined - Past Images Fee",
    result.pastImagesAdditionalFeeToman,
    150_000
  );


  testNumber(
    "Combined - Additional Parcels Fee",
    result.additionalParcelsFeeToman,
    480_000
  );


  testNumber(
    "Combined - Total Parcel Count",
    result.totalParcelCount,
    3
  );


  testNumber(
    "Combined - Final Fee",
    result.finalFeeToman,
    1_230_000
  );

}


/*
 * ==========================================
 * TEST 5
 *
 * خاموش بودن گزینه پلاک اضافی
 *
 * حتی اگر state قبلی عددی داشته باشد،
 * نباید در محاسبه اعمال شود.
 * ==========================================
 */

{

  const result =
    calculateArticle14({

      pastImageYearCount: 0,

      hasAdditionalConnectedParcels:
        false,

      additionalConnectedParcelCount:
        5

    });


  testNumber(
    "Disabled Additional Parcels Fee",
    result.additionalParcelsFeeToman,
    0
  );


  testNumber(
    "Disabled Additional Parcels Count",
    result.additionalConnectedParcelCount,
    0
  );


  testNumber(
    "Disabled Additional Parcels Total Count",
    result.totalParcelCount,
    1
  );


  testNumber(
    "Disabled Additional Parcels Final Fee",
    result.finalFeeToman,
    600_000
  );

}


/*
 * ==========================================
 * TEST 6
 *
 * کنترل Constants تعرفه
 * ==========================================
 */

{

  testNumber(
    "Article 14 Base Constant",
    ARTICLE14_BASE_FEE_TOMAN,
    600_000
  );


  testNumber(
    "Article 14 Past Year Constant",
    ARTICLE14_PAST_YEAR_FEE_TOMAN,
    50_000
  );


  testNumber(
    "Article 14 Additional Parcel Rate",
    ARTICLE14_ADDITIONAL_PARCEL_RATE,
    0.40
  );

}


/*
 * ==========================================
 * TEST 7
 *
 * ورودی منفی سال
 * ==========================================
 */

testThrows(
  "Negative Past Image Year Count",
  () => {

    calculateArticle14({

      pastImageYearCount: -1,

      hasAdditionalConnectedParcels:
        false,

      additionalConnectedParcelCount:
        0

    });

  }
);


/*
 * ==========================================
 * TEST 8
 *
 * تعداد اعشاری سال
 * ==========================================
 */

testThrows(
  "Decimal Past Image Year Count",
  () => {

    calculateArticle14({

      pastImageYearCount: 1.5,

      hasAdditionalConnectedParcels:
        false,

      additionalConnectedParcelCount:
        0

    });

  }
);


/*
 * ==========================================
 * TEST 9
 *
 * تعداد منفی پلاک اضافی
 * ==========================================
 */

testThrows(
  "Negative Additional Parcel Count",
  () => {

    calculateArticle14({

      pastImageYearCount: 0,

      hasAdditionalConnectedParcels:
        true,

      additionalConnectedParcelCount:
        -1

    });

  }
);


/*
 * ==========================================
 * TEST 10
 *
 * تعداد اعشاری پلاک اضافی
 * ==========================================
 */

testThrows(
  "Decimal Additional Parcel Count",
  () => {

    calculateArticle14({

      pastImageYearCount: 0,

      hasAdditionalConnectedParcels:
        true,

      additionalConnectedParcelCount:
        2.5

    });

  }
);


/*
 * ==========================================
 * Final Report
 * ==========================================
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
  "ARTICLE 14 BENCHMARK"
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


if (failedCount > 0) {

  throw new Error(
    "Article 14 Benchmark FAILED."
  );

}


console.log(
  "ALL TESTS PASSED."
);