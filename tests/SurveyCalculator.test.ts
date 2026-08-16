import {
  calculateArticle39,
  calculateArticle40,
  calculateArticle41,
  getArticle42Status,
  calculateArticle43
} from "../src/engine/SurveyCalculator";

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
    number | boolean,
  expected:
    number | boolean,
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
 * ماده 39 - گذربند مشخص
 * ========================================
 */

assertEqual(
  calculateArticle39({
    areaSquareMeters:
      500,
    boundaryMode:
      "KNOWN_BOUNDARY"
  }).expertFeeToman,
  800_000,
  "Article 39 known <=1000"
);


assertEqual(
  calculateArticle39({
    areaSquareMeters:
      1_000,
    boundaryMode:
      "KNOWN_BOUNDARY"
  }).expertFeeToman,
  800_000,
  "Article 39 known at 1000"
);


assertEqual(
  calculateArticle39({
    areaSquareMeters:
      2_000,
    boundaryMode:
      "KNOWN_BOUNDARY"
  }).expertFeeToman,
  880_000,
  "Article 39 known middle band"
);


/*
 * 100,000 m2:
 * 800,000 + 99,000 * 80
 * = 8,720,000
 */

assertEqual(
  calculateArticle39({
    areaSquareMeters:
      100_000,
    boundaryMode:
      "KNOWN_BOUNDARY"
  }).expertFeeToman,
  8_720_000,
  "Article 39 known at 10 hectares"
);


/*
 * سقف 16 میلیون
 */

assertEqual(
  calculateArticle39({
    areaSquareMeters:
      1_000_000,
    boundaryMode:
      "KNOWN_BOUNDARY"
  }).expertFeeToman,
  16_000_000,
  "Article 39 known maximum"
);


/*
 * ========================================
 * ماده 39 - گذربند نامشخص
 * ========================================
 */

assertEqual(
  calculateArticle39({
    areaSquareMeters:
      1_000,
    boundaryMode:
      "UNKNOWN_BOUNDARY"
  }).expertFeeToman,
  2_000_000,
  "Article 39 unknown base"
);


assertEqual(
  calculateArticle39({
    areaSquareMeters:
      2_000,
    boundaryMode:
      "UNKNOWN_BOUNDARY"
  }).expertFeeToman,
  2_080_000,
  "Article 39 unknown middle band"
);


/*
 * نقاط جغرافیایی
 */

assertEqual(
  calculateArticle39({
    areaSquareMeters:
      1_000,
    boundaryMode:
      "KNOWN_BOUNDARY",
    geographicPointCount:
      3
  }).expertFeeToman,
  1_100_000,
  "Article 39 geographic points"
);


mustThrow(
  () =>
    calculateArticle39({
      areaSquareMeters:
        1_000,
      boundaryMode:
        "KNOWN_BOUNDARY",
      geographicPointCount:
        1.5
    }),
  "Article 39 geographic points must be integer"
);


/*
 * ========================================
 * ماده 40
 * بند 2 ماده 39
 * ========================================
 */

assertEqual(
  calculateArticle40({
    areaSquareMeters:
      1_000
  }).expertFeeToman,
  2_000_000,
  "Article 40 base"
);


assertEqual(
  calculateArticle40({
    areaSquareMeters:
      2_000
  }).expertFeeToman,
  2_080_000,
  "Article 40 must use unknown-boundary Article 39"
);


assertEqual(
  calculateArticle40({
    areaSquareMeters:
      1_000_000
  }).expertFeeToman,
  20_000_000,
  "Article 40 maximum"
);


/*
 * ========================================
 * ماده 41
 * ========================================
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      500
  }).expertFeeToman,
  600_000,
  "Article 41 minimum"
);


assertEqual(
  calculateArticle41({
    areaSquareMeters:
      1_000
  }).expertFeeToman,
  600_000,
  "Article 41 at 1000"
);


/*
 * 2000:
 * 600,000 + 1000*300
 * = 900,000
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      2_000
  }).expertFeeToman,
  900_000,
  "Article 41 first band"
);


/*
 * 5000:
 * 600,000 + 4000*300
 * = 1,800,000
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      5_000
  }).expertFeeToman,
  1_800_000,
  "Article 41 first threshold"
);


/*
 * 6000:
 * 1,800,000 + 1000*160
 * = 1,960,000
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      6_000
  }).expertFeeToman,
  1_960_000,
  "Article 41 second band"
);


/*
 * 50,000:
 * 600,000
 * + 4,000*300
 * + 45,000*160
 * = 9,000,000
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      50_000
  }).expertFeeToman,
  9_000_000,
  "Article 41 second threshold"
);


/*
 * 60,000:
 * 9,000,000 + 10,000*80
 * = 9,800,000
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      60_000
  }).expertFeeToman,
  9_800_000,
  "Article 41 third band"
);


/*
 * سقف
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      1_000_000
  }).expertFeeToman,
  12_000_000,
  "Article 41 maximum"
);


/*
 * افزایش خارج محدوده 20%
 *
 * 2,000 m2 => 900,000
 * +20% => 1,080,000
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      2_000,
    outsideBoundaryIncreasePercent:
      20
  }).expertFeeToman,
  1_080_000,
  "Article 41 outside-boundary increase"
);


/*
 * بعد از ضریب هم سقف رعایت شود
 */

assertEqual(
  calculateArticle41({
    areaSquareMeters:
      1_000_000,
    outsideBoundaryIncreasePercent:
      20
  }).expertFeeToman,
  12_000_000,
  "Article 41 cap after increase"
);


mustThrow(
  () =>
    calculateArticle41({
      areaSquareMeters:
        2_000,
      outsideBoundaryIncreasePercent:
        21
    }),
  "Article 41 increase above 20 must throw"
);


/*
 * ========================================
 * ماده 42
 * ========================================
 */

const article42 =
  getArticle42Status();


assertEqual(
  article42
    .automaticCalculationSupported,
  false,
  "Article 42 auto calculation disabled"
);


assertEqual(
  article42.minimumFeeToman,
  1_000_000,
  "Article 42 minimum"
);


assertEqual(
  article42
    .maximumDeterminedByArticle9,
  true,
  "Article 42 maximum depends on Article 9"
);


/*
 * ========================================
 * ماده 43
 * بلوک هکتاری
 * ========================================
 */

const article43Cases:
  Array<[number, number]> = [

    [1, 800_000],
    [9_999, 800_000],
    [10_000, 800_000],

    [10_001, 960_000],
    [15_000, 960_000],
    [20_000, 960_000],

    [20_001, 1_120_000],
    [30_000, 1_120_000]
  ];


for (
  const [
    area,
    expected
  ]
  of article43Cases
) {

  assertEqual(
    calculateArticle43({
      areaSquareMeters:
        area
    }).expertFeeToman,

    expected,

    `Article 43 area ${area}`
  );
}


/*
 * سقف 4 میلیون
 */

assertEqual(
  calculateArticle43({
    areaSquareMeters:
      1_000_000
  }).expertFeeToman,
  4_000_000,
  "Article 43 maximum"
);


/*
 * نقشه هوایی +1 میلیون
 */

assertEqual(
  calculateArticle43({
    areaSquareMeters:
      10_000,
    aerialMapPlacement:
      true
  }).expertFeeToman,
  1_800_000,
  "Article 43 aerial map addition"
);


/*
 * هزینه نقشه هوایی بعد از سقف اصلی
 */

assertEqual(
  calculateArticle43({
    areaSquareMeters:
      1_000_000,
    aerialMapPlacement:
      true
  }).expertFeeToman,
  5_000_000,
  "Article 43 aerial map after main cap"
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
  calculateArticle39({
    areaSquareMeters:
      1_000,

    boundaryMode:
      "KNOWN_BOUNDARY",

    missionType:
      "IN_PROVINCE",

    missionDays:
      2
  });


assertEqual(
  withMission.expertFeeToman,
  800_000,
  "Mission must not alter survey expert fee"
);


assertEqual(
  withMission.missionFeeToman,
  missionRate * 2,
  "Survey mission fee"
);


assertEqual(
  withMission.totalPayableToman,
  800_000 +
    missionRate * 2,
  "Survey total payable"
);


/*
 * ========================================
 * ورودی نامعتبر
 * ========================================
 */

mustThrow(
  () =>
    calculateArticle40({
      areaSquareMeters: 0
    }),
  "Article 40 zero area must throw"
);


mustThrow(
  () =>
    calculateArticle43({
      areaSquareMeters: -1
    }),
  "Article 43 negative area must throw"
);


console.log(
  "\n========================================"
);

console.log(
  "Survey Calculator 39-43: ALL TESTS PASSED"
);

console.log(
  "========================================"
);
