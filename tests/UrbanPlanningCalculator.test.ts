import {
  calculateArticle44
} from "../src/engine/UrbanPlanningCalculator";

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
  actual:
    number | string,
  expected:
    number | string,
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


function mustThrow(
  fn: () => void,
  message: string
): void {

  let thrown =
    false;

  try {

    fn();

  } catch {

    thrown =
      true;
  }


  assert(
    thrown,
    message
  );
}


/*
 * ========================================
 * بند 1
 * انطباق طرح تفکیک اراضی شهری
 * ========================================
 *
 * تا 2 مورد:
 * 3,000,000
 *
 * 3 تا 10:
 * +400,000 هر مورد
 *
 * بالاتر از 10:
 * +120,000 هر مورد
 */


/*
 * یک مورد نیز مبلغ پایه دارد
 */

assertEqual(
  calculateArticle44({
    serviceType:
      "SUBDIVISION_PLAN",

    itemCount:
      1
  }).expertFeeToman,

  4_000_000,

  "Article 44 subdivision one item"
);


/*
 * دو مورد
 */

assertEqual(
  calculateArticle44({
    serviceType:
      "SUBDIVISION_PLAN",

    itemCount:
      2
  }).expertFeeToman,

  4_000_000,

  "Article 44 subdivision two items"
);


/*
 * سه مورد:
 * 3,000,000 + 400,000
 */

const subdivision3 =
  calculateArticle44({

    serviceType:
      "SUBDIVISION_PLAN",

    itemCount:
      3
  });


assertEqual(
  subdivision3
    .expertFeeToman,

  4_600_000,

  "Article 44 subdivision three items"
);


assertEqual(
  subdivision3
    .middleBandItemCount,

  1,

  "Subdivision middle count at 3"
);


/*
 * ده مورد:
 *
 * 3,000,000
 * + 8 * 400,000
 * = 6,200,000
 */

const subdivision10 =
  calculateArticle44({

    serviceType:
      "SUBDIVISION_PLAN",

    itemCount:
      10
  });


assertEqual(
  subdivision10
    .expertFeeToman,

  8_800_000,

  "Article 44 subdivision ten items"
);


assertEqual(
  subdivision10
    .middleBandItemCount,

  8,

  "Subdivision middle count at 10"
);


assertEqual(
  subdivision10
    .upperBandItemCount,

  0,

  "Subdivision upper count at 10"
);


/*
 * یازده مورد:
 *
 * 6,200,000
 * + 120,000
 * = 6,320,000
 */

const subdivision11 =
  calculateArticle44({

    serviceType:
      "SUBDIVISION_PLAN",

    itemCount:
      11
  });


assertEqual(
  subdivision11
    .expertFeeToman,

  8_980_000,

  "Article 44 subdivision eleven items"
);


assertEqual(
  subdivision11
    .upperBandItemCount,

  1,

  "Subdivision upper count at 11"
);


/*
 * بیست مورد:
 *
 * 6,200,000
 * + 10 * 120,000
 * = 7,400,000
 */

assertEqual(
  calculateArticle44({

    serviceType:
      "SUBDIVISION_PLAN",

    itemCount:
      20

  }).expertFeeToman,

  10_600_000,

  "Article 44 subdivision twenty items"
);


/*
 * ========================================
 * بند 2
 * انطباق کاربری اراضی شهری
 * ========================================
 *
 * تا 2:
 * 2,000,000
 *
 * 3 تا 10:
 * +300,000
 *
 * بالاتر از 10:
 * +120,000
 */

assertEqual(
  calculateArticle44({

    serviceType:
      "LAND_USE_COMPLIANCE",

    itemCount:
      1

  }).expertFeeToman,

  3_000_000,

  "Article 44 land use one item"
);


assertEqual(
  calculateArticle44({

    serviceType:
      "LAND_USE_COMPLIANCE",

    itemCount:
      2

  }).expertFeeToman,

  3_000_000,

  "Article 44 land use two items"
);


/*
 * 3:
 * 2,000,000 + 300,000
 */

assertEqual(
  calculateArticle44({

    serviceType:
      "LAND_USE_COMPLIANCE",

    itemCount:
      3

  }).expertFeeToman,

  3_450_000,

  "Article 44 land use three items"
);


/*
 * 10:
 *
 * 2,000,000
 * + 8 * 300,000
 * = 4,400,000
 */

assertEqual(
  calculateArticle44({

    serviceType:
      "LAND_USE_COMPLIANCE",

    itemCount:
      10

  }).expertFeeToman,

  6_600_000,

  "Article 44 land use ten items"
);


/*
 * 11:
 * 4,400,000 + 120,000
 */

assertEqual(
  calculateArticle44({

    serviceType:
      "LAND_USE_COMPLIANCE",

    itemCount:
      11

  }).expertFeeToman,

  6_780_000,

  "Article 44 land use eleven items"
);


/*
 * 20:
 *
 * 4,400,000
 * + 10 * 120,000
 * = 5,600,000
 */

assertEqual(
  calculateArticle44({

    serviceType:
      "LAND_USE_COMPLIANCE",

    itemCount:
      20

  }).expertFeeToman,

  8_400_000,

  "Article 44 land use twenty items"
);


/*
 * ========================================
 * بند 3
 * انطباق شهری ساختمان‌ها
 * ========================================
 *
 * Rule عددی بند 3 با بند 2 یکسان است.
 */

assertEqual(
  calculateArticle44({

    serviceType:
      "BUILDING_URBAN_COMPLIANCE",

    itemCount:
      1

  }).expertFeeToman,

  3_000_000,

  "Article 44 building one item"
);


assertEqual(
  calculateArticle44({

    serviceType:
      "BUILDING_URBAN_COMPLIANCE",

    itemCount:
      3

  }).expertFeeToman,

  3_450_000,

  "Article 44 building three items"
);


assertEqual(
  calculateArticle44({

    serviceType:
      "BUILDING_URBAN_COMPLIANCE",

    itemCount:
      10

  }).expertFeeToman,

  6_600_000,

  "Article 44 building ten items"
);


assertEqual(
  calculateArticle44({

    serviceType:
      "BUILDING_URBAN_COMPLIANCE",

    itemCount:
      11

  }).expertFeeToman,

  6_780_000,

  "Article 44 building eleven items"
);


assertEqual(
  calculateArticle44({

    serviceType:
      "BUILDING_URBAN_COMPLIANCE",

    itemCount:
      20

  }).expertFeeToman,

  8_400_000,

  "Article 44 building twenty items"
);


/*
 * ========================================
 * جزئیات خروجی
 * ========================================
 */

const detail =
  calculateArticle44({

    serviceType:
      "SUBDIVISION_PLAN",

    itemCount:
      12
  });


assertEqual(
  detail.baseFeeToman,
  4_000_000,
  "Article 44 detail base"
);


assertEqual(
  detail.middleBandItemCount,
  8,
  "Article 44 detail middle count"
);


assertEqual(
  detail.middleBandFeeToman,
  4_800_000,
  "Article 44 detail middle fee"
);


assertEqual(
  detail.upperBandItemCount,
  2,
  "Article 44 detail upper count"
);


assertEqual(
  detail.upperBandFeeToman,
  360_000,
  "Article 44 detail upper fee"
);


assertEqual(
  detail.expertFeeToman,
  9_160_000,
  "Article 44 detail final expert fee"
);


/*
 * ========================================
 * مأموریت
 * ========================================
 */

const missionRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const withMission =
  calculateArticle44({

    serviceType:
      "LAND_USE_COMPLIANCE",

    itemCount:
      3,

    missionType:
      "IN_PROVINCE",

    missionDays:
      2
  });


assertEqual(
  withMission.expertFeeToman,
  3_450_000,
  "Mission must not alter Article 44 expert fee"
);


assertEqual(
  withMission.missionFeeToman,
  missionRate * 2,
  "Article 44 mission fee"
);


assertEqual(
  withMission.totalPayableToman,
  3_450_000 +
    missionRate * 2,
  "Article 44 total payable"
);


/*
 * ========================================
 * ورودی‌های نامعتبر
 * ========================================
 */

mustThrow(
  () =>
    calculateArticle44({

      serviceType:
        "SUBDIVISION_PLAN",

      itemCount:
        0
    }),

  "Article 44 zero count must throw"
);


mustThrow(
  () =>
    calculateArticle44({

      serviceType:
        "LAND_USE_COMPLIANCE",

      itemCount:
        -1
    }),

  "Article 44 negative count must throw"
);


mustThrow(
  () =>
    calculateArticle44({

      serviceType:
        "BUILDING_URBAN_COMPLIANCE",

      itemCount:
        1.5
    }),

  "Article 44 fractional count must throw"
);


/*
 * ========================================
 * پایان
 * ========================================
 */

console.log(
  "\n========================================"
);

console.log(
  "Urban Planning Calculator - Article 44: ALL TESTS PASSED"
);

console.log(
  "========================================"
);
