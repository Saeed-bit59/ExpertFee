import {
  calculateArticle33,
  calculateArticle34,
  calculateArticle35,
  calculateArticle36,
  calculateArticle37,
  calculateArticle38
} from "../src/engine/RoadBuildingCalculator";

import {
  calculateCommonFee
} from "../src/engine/CommonFeeEngine";

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

  if (actual !== expected) {
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
 * ماده 33
 * ========================================
 */

const article33Value =
  1_000_000_000;


const article33Expected =
  calculateCommonFee({
    baseMode:
      "ARTICLE_11",
    evaluationValueToman:
      article33Value
  });


const article33 =
  calculateArticle33({
    evaluationValueToman:
      article33Value
  });


assertEqual(
  article33.expertFeeToman,
  article33Expected
    .finalExpertFeeToman,
  "Article 33 must use Article 11"
);


mustThrow(
  () =>
    calculateArticle33({
      evaluationValueToman: 0
    }),
  "Article 33 zero evaluation must throw"
);


/*
 * ========================================
 * ماده 34
 * نرخ 3000
 * Min = 2,000,000
 * Max = 10,000,000
 * ========================================
 */

assertEqual(
  calculateArticle34({
    areaSquareMeters: 100
  }).expertFeeToman,
  2_000_000,
  "Article 34 minimum"
);


assertEqual(
  calculateArticle34({
    areaSquareMeters: 1_000
  }).expertFeeToman,
  3_000_000,
  "Article 34 normal calculation"
);


assertEqual(
  calculateArticle34({
    areaSquareMeters: 10_000
  }).expertFeeToman,
  10_000_000,
  "Article 34 maximum"
);


mustThrow(
  () =>
    calculateArticle34({
      areaSquareMeters: -1
    }),
  "Article 34 negative area must throw"
);


/*
 * ========================================
 * ماده 35
 * ========================================
 */

assertEqual(
  calculateArticle35({
    areaSquareMeters: 100
  }).expertFeeToman,
  2_000_000,
  "Article 35 minimum"
);


assertEqual(
  calculateArticle35({
    areaSquareMeters: 1_500
  }).expertFeeToman,
  4_500_000,
  "Article 35 normal calculation"
);


assertEqual(
  calculateArticle35({
    areaSquareMeters: 10_000
  }).expertFeeToman,
  10_000_000,
  "Article 35 maximum"
);


/*
 * ========================================
 * ماده 36 - معماری
 * ========================================
 */

assertEqual(
  calculateArticle36({
    serviceType:
      "ARCHITECTURE",
    areaSquareMeters:
      100
  }).expertFeeToman,
  2_000_000,
  "Article 36 architecture minimum"
);


assertEqual(
  calculateArticle36({
    serviceType:
      "ARCHITECTURE",
    areaSquareMeters:
      1_000
  }).expertFeeToman,
  2_500_000,
  "Article 36 architecture normal"
);


assertEqual(
  calculateArticle36({
    serviceType:
      "ARCHITECTURE",
    areaSquareMeters:
      20_000
  }).expertFeeToman,
  15_000_000,
  "Article 36 architecture maximum"
);


/*
 * ========================================
 * ماده 36 - سازه
 * ========================================
 */

assertEqual(
  calculateArticle36({
    serviceType:
      "STRUCTURE",
    areaSquareMeters:
      1_000
  }).expertFeeToman,
  3_000_000,
  "Article 36 structure normal"
);


assertEqual(
  calculateArticle36({
    serviceType:
      "STRUCTURE",
    areaSquareMeters:
      20_000
  }).expertFeeToman,
  20_000_000,
  "Article 36 structure maximum"
);


/*
 * ========================================
 * ماده 36 - استحکام بنا
 * ========================================
 */

assertEqual(
  calculateArticle36({
    serviceType:
      "STRUCTURAL_SAFETY_REPORT",
    areaSquareMeters:
      1_000
  }).expertFeeToman,
  2_500_000,
  "Article 36 safety normal"
);


assertEqual(
  calculateArticle36({
    serviceType:
      "STRUCTURAL_SAFETY_REPORT",
    areaSquareMeters:
      20_000
  }).expertFeeToman,
  15_000_000,
  "Article 36 safety maximum"
);


/*
 * ========================================
 * ماده 37
 * ماده 11 + 20 درصد
 * ========================================
 */

const article37Value =
  1_000_000_000;


const article37Expected =
  calculateCommonFee({
    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      article37Value,

    increasePercent:
      20
  });


const article37 =
  calculateArticle37({
    evaluationValueToman:
      article37Value
  });


assertEqual(
  article37.expertFeeToman,
  article37Expected
    .finalExpertFeeToman,
  "Article 37 must equal Article 11 + 20%"
);


/*
 * یک واحد مشابه مازاد
 */

const article37OneSimilar =
  calculateArticle37({
    evaluationValueToman:
      article37Value,

    similarAdditionalUnits:
      1
  });


const expectedOneSimilar =
  Math.min(
    135_000_000,

    article37Expected
      .finalExpertFeeToman +

    Math.round(
      article37Expected
        .finalExpertFeeToman *
      0.20
    )
  );


assertEqual(
  article37OneSimilar
    .expertFeeToman,
  expectedOneSimilar,
  "Article 37 one similar unit"
);


/*
 * سقف 135 میلیون
 */

const article37Capped =
  calculateArticle37({
    evaluationValueToman:
      1_000_000_000_000,

    similarAdditionalUnits:
      10
  });


assertEqual(
  article37Capped
    .expertFeeToman,
  135_000_000,
  "Article 37 final cap"
);


mustThrow(
  () =>
    calculateArticle37({
      evaluationValueToman:
        article37Value,

      similarAdditionalUnits:
        1.5
    }),
  "Article 37 similar units must be integer"
);


/*
 * ========================================
 * ماده 38
 * بلوک‌های 1000 مترمربعی
 * ========================================
 */

const article38Cases:
  Array<[number, number]> = [

    [1, 2_000_000],
    [999, 2_000_000],
    [1_000, 2_000_000],

    [1_001, 2_300_000],
    [1_500, 2_300_000],
    [2_000, 2_300_000],

    [2_001, 2_600_000],
    [2_999, 2_600_000],
    [3_000, 2_600_000],

    [3_001, 2_900_000]
  ];


for (
  const [
    area,
    expected
  ]
  of article38Cases
) {

  assertEqual(
    calculateArticle38({
      areaSquareMeters:
        area
    }).expertFeeToman,

    expected,

    `Article 38 area ${area}`
  );
}


mustThrow(
  () =>
    calculateArticle38({
      areaSquareMeters: 0
    }),
  "Article 38 zero area must throw"
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


const article38Mission =
  calculateArticle38({

    areaSquareMeters:
      1_500,

    missionType:
      "IN_PROVINCE",

    missionDays:
      2
  });


assertEqual(
  article38Mission
    .expertFeeToman,
  2_300_000,
  "Mission must not alter expert fee"
);


assertEqual(
  article38Mission
    .missionFeeToman,
  missionRate * 2,
  "Article 38 mission fee"
);


assertEqual(
  article38Mission
    .totalPayableToman,
  2_300_000 +
    missionRate * 2,
  "Article 38 total payable"
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
  "Road Building Calculator 33-38: ALL TESTS PASSED"
);

console.log(
  "========================================"
);
