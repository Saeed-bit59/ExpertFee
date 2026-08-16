import {
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  calculateCommonFee
} from "../src/engine/CommonFeeEngine";

import {
  calculateArticle11Engine
} from "../src/engine/Article11Engine";

import {
  getMissionDailyRate
} from "../src/engine/MissionCalculator";


function assert(
  condition: boolean,
  message: string
): void {

  if (!condition) {

    throw new Error(
      `TEST FAILED: ${message}`
    );
  }
}


function assertEqual(
  actual: number,
  expected: number,
  message: string
): void {

  if (
    actual !== expected
  ) {

    throw new Error(
      [
        `TEST FAILED: ${message}`,
        `expected=${expected}`,
        `actual=${actual}`
      ].join(" | ")
    );
  }
}


/*
 * ========================================
 * Test 1
 * مبلغ ثابت بدون مأموریت
 * ========================================
 */

const fixed =
  calculateCommonFee({

    baseMode:
      "FIXED",

    fixedFeeToman:
      600_000
  });


assertEqual(
  fixed.baseFeeToman,
  600_000,
  "Fixed base fee"
);

assertEqual(
  fixed.finalExpertFeeToman,
  600_000,
  "Fixed final fee"
);

assertEqual(
  fixed.missionFeeToman,
  0,
  "No mission fee"
);

assertEqual(
  fixed.totalPayableToman,
  600_000,
  "Fixed total payable"
);


/*
 * ========================================
 * Test 2
 * اتصال مستقیم به ماده 11
 * ========================================
 */

const evaluationValueToman =
  1_000_000_000;


const directArticle11 =
  calculateArticle11Engine({

    evaluationValueToman,

    expertCount:
      1
  });


const commonArticle11 =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman
  });


assertEqual(
  commonArticle11.baseFeeToman,
  directArticle11.feePerExpertToman,
  "Common engine must use Article11Engine result"
);

assertEqual(
  commonArticle11.finalExpertFeeToman,
  directArticle11.feePerExpertToman,
  "Article 11 without extra rule must preserve fee"
);


/*
 * ========================================
 * Test 3
 * افزایش 20 درصدی
 * ========================================
 */

const plusTwenty =
  calculateCommonFee({

    baseMode:
      "FIXED",

    fixedFeeToman:
      10_000_000,

    increasePercent:
      20
  });


assertEqual(
  plusTwenty.increaseAmountToman,
  2_000_000,
  "20 percent increase amount"
);

assertEqual(
  plusTwenty.finalExpertFeeToman,
  12_000_000,
  "20 percent increased fee"
);


/*
 * ========================================
 * Test 4
 * حداقل اختصاصی
 * ========================================
 */

const minimum =
  calculateCommonFee({

    baseMode:
      "FIXED",

    fixedFeeToman:
      2_000_000,

    minimumFeeToman:
      5_000_000
  });


assert(
  minimum.minimumApplied,
  "Minimum must be applied"
);

assertEqual(
  minimum.finalExpertFeeToman,
  5_000_000,
  "Minimum fee result"
);


/*
 * ========================================
 * Test 5
 * حداکثر اختصاصی
 * ========================================
 */

const maximum =
  calculateCommonFee({

    baseMode:
      "FIXED",

    fixedFeeToman:
      20_000_000,

    maximumFeeToman:
      8_000_000
  });


assert(
  maximum.maximumApplied,
  "Maximum must be applied"
);

assertEqual(
  maximum.finalExpertFeeToman,
  8_000_000,
  "Maximum fee result"
);


/*
 * ========================================
 * Test 6
 * سقف عمومی ماده 11 پس از ضریب
 * ========================================
 *
 * از خود Article11Engine یک مبلغ ارزیابی
 * بزرگ می‌گیریم تا دستمزد پایه به سقف نزدیک
 * یا برابر سقف برسد و سپس ضریب 50 درصدی
 * CommonFeeEngine را اعمال می‌کنیم.
 */

const capped =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      1_000_000_000_000_000,

    increasePercent:
      50
  });


assert(
  capped.finalExpertFeeToman <=
    ARTICLE_11_GENERAL_MAXIMUM_TOMAN,

  "Article 11 result must never exceed general maximum"
);

assertEqual(
  capped.finalExpertFeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "General Article 11 maximum after increase"
);

assert(
  capped.maximumApplied ||
  capped.baseFeeToman ===
    ARTICLE_11_GENERAL_MAXIMUM_TOMAN,

  "Maximum state must be detectable"
);


/*
 * ========================================
 * Test 7
 * مأموریت بعد از سقف
 * ========================================
 */

const missionDailyRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const withMission =
  calculateCommonFee({

    baseMode:
      "FIXED",

    fixedFeeToman:
      10_000_000,

    missionType:
      "IN_PROVINCE",

    missionDays:
      2
  });


assertEqual(
  withMission.missionFeeToman,
  missionDailyRate * 2,
  "Mission fee"
);

assertEqual(
  withMission.totalPayableToman,
  10_000_000 +
    missionDailyRate * 2,
  "Mission must be added after expert fee"
);


/*
 * ========================================
 * Test 8
 * مأموریت وارد سقف ماده 11 نمی‌شود
 * ========================================
 */

const cappedWithMission =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      1_000_000_000_000_000,

    increasePercent:
      50,

    missionType:
      "IN_PROVINCE",

    missionDays:
      1
  });


assertEqual(
  cappedWithMission.finalExpertFeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Expert fee must remain capped"
);

assert(
  cappedWithMission.totalPayableToman >
    ARTICLE_11_GENERAL_MAXIMUM_TOMAN,

  "Mission must be added outside Article 11 maximum"
);


/*
 * ========================================
 * Test 9
 * اعتبارسنجی حداقل و حداکثر
 * ========================================
 */

let invalidLimitsThrown =
  false;


try {

  calculateCommonFee({

    baseMode:
      "FIXED",

    fixedFeeToman:
      1_000_000,

    minimumFeeToman:
      10_000_000,

    maximumFeeToman:
      5_000_000
  });

} catch {

  invalidLimitsThrown =
    true;
}


assert(
  invalidLimitsThrown,
  "Invalid min/max combination must throw"
);


/*
 * ========================================
 * Test 10
 * مأموریت انتخاب شده بدون روز معتبر
 * ========================================
 */

let invalidMissionThrown =
  false;


try {

  calculateCommonFee({

    baseMode:
      "FIXED",

    fixedFeeToman:
      1_000_000,

    missionType:
      "OUT_PROVINCE",

    missionDays:
      0
  });

} catch {

  invalidMissionThrown =
    true;
}


assert(
  invalidMissionThrown,
  "Selected mission must require at least one day"
);


console.log(
  "\n========================================"
);

console.log(
  "Common Fee Engine: ALL TESTS PASSED"
);

console.log(
  "========================================"
);
