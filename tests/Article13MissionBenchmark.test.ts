import {
  calculateArticle13
} from "../src/engine/Article13Calculator";

import {
  calculateMission,
  getMissionDailyRate
} from "../src/engine/MissionCalculator";

import type {
  MissionType
} from "../src/engine/MissionCalculator";


/*
 * ==========================================
 * Article 13 + Mission Benchmark
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
 * ابزار تست عددی
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
 * تابع کمکی:
 * ماده 13 + مأموریت
 * ==========================================
 */

function calculateArticle13WithMission(
  monthlyRentToman: number,
  missionType: MissionType,
  missionDays: number
) {

  const article13 =
    calculateArticle13({
      monthlyRentToman
    });


  const mission =
    calculateMission({

      expertFeeToman:
        article13.finalFeeToman,

      missionType,

      missionDays

    });


  return {
    article13,
    mission
  };
}


/*
 * ==========================================
 * داده مبنای Benchmark
 * ==========================================
 */

const TEST_MONTHLY_RENT =
  100_000_000;


/*
 * دستمزد مورد انتظار ماده 13
 * برای اجاره‌بهای ماهانه
 * 100,000,000 تومان
 */

const EXPECTED_ARTICLE13_FEE =
  19_500_000;


/*
 * ==========================================
 * TEST 1
 *
 * ماده 13 بدون مأموریت
 * ==========================================
 */

{

  const result =
    calculateArticle13WithMission(
      TEST_MONTHLY_RENT,
      "NONE",
      0
    );


  testNumber(
    "Article 13 - No Mission",
    result.article13.finalFeeToman,
    EXPECTED_ARTICLE13_FEE
  );


  testNumber(
    "Article 13 - Total Without Mission",
    result.mission.totalPayableToman,
    EXPECTED_ARTICLE13_FEE
  );

}


/*
 * ==========================================
 * TEST 2
 *
 * یک روز مأموریت داخل استان
 * ==========================================
 */

{

  const dailyRate =
    getMissionDailyRate(
      "IN_PROVINCE"
    );


  const result =
    calculateArticle13WithMission(
      TEST_MONTHLY_RENT,
      "IN_PROVINCE",
      1
    );


  testNumber(
    "Mission - In Province - 1 Day",
    result.mission.missionFeeToman,
    dailyRate
  );


  testNumber(
    "Total - In Province - 1 Day",
    result.mission.totalPayableToman,
    EXPECTED_ARTICLE13_FEE +
      dailyRate
  );

}


/*
 * ==========================================
 * TEST 3
 *
 * سه روز مأموریت داخل استان
 * ==========================================
 */

{

  const dailyRate =
    getMissionDailyRate(
      "IN_PROVINCE"
    );


  const result =
    calculateArticle13WithMission(
      TEST_MONTHLY_RENT,
      "IN_PROVINCE",
      3
    );


  testNumber(
    "Mission - In Province - 3 Days",
    result.mission.missionFeeToman,
    dailyRate * 3
  );


  testNumber(
    "Total - In Province - 3 Days",
    result.mission.totalPayableToman,
    EXPECTED_ARTICLE13_FEE +
      dailyRate * 3
  );

}


/*
 * ==========================================
 * TEST 4
 *
 * سه روز مأموریت خارج استان
 * ==========================================
 */

{

  const dailyRate =
    getMissionDailyRate(
      "OUT_PROVINCE"
    );


  const result =
    calculateArticle13WithMission(
      TEST_MONTHLY_RENT,
      "OUT_PROVINCE",
      3
    );


  testNumber(
    "Mission - Out Province - 3 Days",
    result.mission.missionFeeToman,
    dailyRate * 3
  );


  testNumber(
    "Total - Out Province - 3 Days",
    result.mission.totalPayableToman,
    EXPECTED_ARTICLE13_FEE +
      dailyRate * 3
  );

}


/*
 * ==========================================
 * TEST 5
 *
 * کنترل مستقل بودن نرخ
 * داخل و خارج استان
 * ==========================================
 */

{

  const inProvinceRate =
    getMissionDailyRate(
      "IN_PROVINCE"
    );


  const outProvinceRate =
    getMissionDailyRate(
      "OUT_PROVINCE"
    );


  const passed =
    inProvinceRate !==
    outProvinceRate;


  results.push({

    name:
      "Mission Rate Difference",

    passed,

    expected:
      1,

    actual:
      passed ? 1 : 0

  });


  console.log(
    passed
      ? "PASS - Mission rates are different"
      : "FAIL - Mission rates must be different"
  );

}


/*
 * ==========================================
 * TEST 6
 *
 * کنترل اعمال مأموریت پس از
 * محاسبه و کنترل سقف ماده 13
 * ==========================================
 */

{

  /*
   * مبلغ بزرگ برای فعال شدن
   * سقف ماده 13
   */

  const highRent =
    100_000_000_000;


  const article13 =
    calculateArticle13({

      monthlyRentToman:
        highRent

    });


  const dailyRate =
    getMissionDailyRate(
      "OUT_PROVINCE"
    );


  const mission =
    calculateMission({

      expertFeeToman:
        article13.finalFeeToman,

      missionType:
        "OUT_PROVINCE",

      missionDays:
        2

    });


  testNumber(
    "Mission Added After Article 13 Cap",
    mission.totalPayableToman,
    article13.finalFeeToman +
      dailyRate * 2
  );

}


/*
 * ==========================================
 * گزارش نهایی Benchmark
 * ==========================================
 */

const passedCount =
  results.filter(
    item =>
      item.passed
  ).length;


const failedCount =
  results.length -
  passedCount;


console.log(
  "\n=============================="
);

console.log(
  "ARTICLE 13 + MISSION BENCHMARK"
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


/*
 * ==========================================
 * شکست Benchmark
 * ==========================================
 */

if (
  failedCount > 0
) {

  throw new Error(
    "Article 13 Mission Benchmark FAILED."
  );

}


/*
 * ==========================================
 * موفقیت کامل
 * ==========================================
 */

console.log(
  "ALL TESTS PASSED."
);
