import {
  calculateArticle48,
  calculateArticle49,
  calculateArticle51,
  calculateArticle51FeeBeforeCap,
  calculateArticle52,
  calculateArticle53,
  calculateAgricultureNaturalResources
} from "../src/engine/AgricultureNaturalResourcesCalculator";

import {
  ARTICLE_51_MAXIMUM_FEE_TOMAN
} from "../src/engine/AgricultureNaturalResourcesRules";

import {
  calculateCommonFee,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN
} from "../src/engine/CommonFeeEngine";

import {
  getMissionDailyRate
} from "../src/engine/MissionCalculator";


/*
 * ========================================
 * Test Helpers
 * ========================================
 */

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
    number | string | boolean,
  expected:
    number | string | boolean,
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
 * Shared Article 11 Reference
 * ========================================
 */

const evaluationValue =
  1_000_000_000;


const article11Reference =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      evaluationValue
  });


const article11Fee =
  article11Reference
    .finalExpertFeeToman;


/*
 * ========================================
 * Article 48
 * ========================================
 */

const article48 =
  calculateArticle48({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  article48.article,
  48,
  "Article 48 number"
);


assertEqual(
  article48.serviceType,
  "GENERAL_EVALUATION",
  "Article 48 service"
);


assertEqual(
  article48.article11FeeToman,
  article11Fee,
  "Article 48 Article 11 fee"
);


assertEqual(
  article48.expertFeeToman,
  article11Fee,
  "Article 48 final expert fee"
);


assertEqual(
  article48.missionFeeToman,
  0,
  "Article 48 no mission by default"
);


/*
 * ========================================
 * Article 49
 * ========================================
 */

const article49 =
  calculateArticle49({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  article49.article,
  49,
  "Article 49 number"
);


assertEqual(
  article49.serviceType,
  "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT",
  "Article 49 service"
);


assertEqual(
  article49.article11FeeToman,
  article11Fee,
  "Article 49 Article 11 fee"
);


assertEqual(
  article49.expertFeeToman,
  article11Fee,
  "Article 49 final expert fee"
);


/*
 * ========================================
 * Article 53
 * ========================================
 */

const article53 =
  calculateArticle53({

    discipline:
      "AQUATICS_FISHERIES",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  article53.article,
  53,
  "Article 53 number"
);


assertEqual(
  article53.serviceType,
  "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION",
  "Article 53 service"
);


assertEqual(
  article53.article11FeeToman,
  article11Fee,
  "Article 53 Article 11 fee"
);


assertEqual(
  article53.expertFeeToman,
  article11Fee,
  "Article 53 final expert fee"
);


/*
 * ========================================
 * Article 51 Boundary Tests
 * ========================================
 *
 * Critical boundaries:
 *
 * 1000
 * 1001
 * 2000
 * 2001
 * 10000
 * 10001
 */


/*
 * 1000 m²
 */

const area1000 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      1_000
  });


assertEqual(
  area1000.expertFeeToman,
  2_000_000,
  "Article 51 at 1000 sqm"
);


assertEqual(
  area1000.blocksAboveFirst1000,
  0,
  "1000 sqm has zero extra blocks"
);


/*
 * 1001 m²
 * Fraction starts a complete block.
 */

const area1001 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      1_001
  });


assertEqual(
  area1001.blocksAboveFirst1000,
  1,
  "1001 sqm = one extra block"
);


assertEqual(
  area1001.expertFeeToman,
  2_200_000,
  "Article 51 at 1001 sqm"
);


/*
 * 2000 m²
 */

const area2000 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      2_000
  });


assertEqual(
  area2000.blocksAboveFirst1000,
  1,
  "2000 sqm = one extra block"
);


assertEqual(
  area2000.expertFeeToman,
  2_200_000,
  "Article 51 at 2000 sqm"
);


/*
 * 2001 m²
 */

const area2001 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      2_001
  });


assertEqual(
  area2001.blocksAboveFirst1000,
  2,
  "2001 sqm = two extra blocks"
);


assertEqual(
  area2001.expertFeeToman,
  2_400_000,
  "Article 51 at 2001 sqm"
);


/*
 * 5000 m²
 * Matches the approved reference table:
 * 800,000 + 4 × 80,000 = 1,120,000
 */

const area5000 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      5_000
  });


assertEqual(
  area5000.expertFeeToman,
  2_800_000,
  "Article 51 at 5000 sqm"
);


/*
 * 10000 m² = one hectare
 */

const area10000 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      10_000
  });


assertEqual(
  area10000.blocksAboveFirst1000,
  9,
  "One hectare has nine first-tier extra blocks"
);


assertEqual(
  area10000.blocksAboveOneHectare,
  0,
  "One hectare has no above-hectare block"
);


assertEqual(
  area10000.expertFeeToman,
  3_800_000,
  "Article 51 at one hectare"
);


/*
 * 10001 m²
 */

const area10001 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      10_001
  });


assertEqual(
  area10001.blocksAboveOneHectare,
  1,
  "10001 sqm = one above-hectare block"
);


assertEqual(
  area10001.expertFeeToman,
  3_900_000,
  "Article 51 at 10001 sqm"
);


/*
 * ========================================
 * Article 51 Approved Table Checks
 * ========================================
 */

const area2Hectares =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      20_000
  });


assertEqual(
  area2Hectares.expertFeeToman,
  4_800_000,
  "Article 51 at 2 hectares"
);


const area3Hectares =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      30_000
  });


assertEqual(
  area3Hectares.expertFeeToman,
  5_800_000,
  "Article 51 at 3 hectares"
);


/*
 * ========================================
 * Article 51 Fraction Above One Hectare
 * ========================================
 */

const area11001 =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      11_001
  });


assertEqual(
  area11001.blocksAboveOneHectare,
  2,
  "11001 sqm rounds to two above-hectare blocks"
);


assertEqual(
  area11001.expertFeeToman,
  4_000_000,
  "Article 51 at 11001 sqm"
);


/*
 * ========================================
 * Article 51 Raw Calculation Helper
 * ========================================
 */

const raw1001 =
  calculateArticle51FeeBeforeCap(
    1_001
  );


assertEqual(
  raw1001.calculatedFeeBeforeCapToman,
  2_200_000,
  "Raw Article 51 fee at 1001 sqm"
);


/*
 * ========================================
 * Article 51 Cap
 * ========================================
 */

assertEqual(
  ARTICLE_51_MAXIMUM_FEE_TOMAN,
  135_000_000,
  "Article 51 cap constant"
);


/*
 * 300 hectares = 3,000,000 m².
 * Raw fee exceeds 118M, therefore cap applies.
 */

const area300Hectares =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      3_000_000
  });


assert(
  area300Hectares
    .calculatedFeeBeforeCapToman >
    ARTICLE_51_MAXIMUM_FEE_TOMAN,
  "300 hectares raw fee exceeds cap"
);


assertEqual(
  area300Hectares.expertFeeToman,
  135_000_000,
  "300 hectares capped at 135M"
);


assertEqual(
  area300Hectares.maximumApplied,
  true,
  "Article 51 cap applied at 300 hectares"
);


/*
 * More than 300 hectares remains at cap.
 */

const area350Hectares =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      3_500_000
  });


assertEqual(
  area350Hectares.expertFeeToman,
  135_000_000,
  "Above 300 hectares remains at 135M"
);


/*
 * ========================================
 * Article 51 Mission
 * ========================================
 */

const inProvinceRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const article51Mission =
  calculateArticle51({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    areaSquareMeters:
      3_500_000,

    missionType:
      "IN_PROVINCE",

    missionDays:
      2
  });


assertEqual(
  article51Mission.expertFeeToman,
  135_000_000,
  "Article 51 expert fee remains capped"
);


assertEqual(
  article51Mission.missionFeeToman,
  inProvinceRate * 2,
  "Article 51 mission fee"
);


assertEqual(
  article51Mission.totalPayableToman,
  135_000_000 +
    inProvinceRate * 2,
  "Article 51 mission is outside cap"
);


/*
 * ========================================
 * Article 52
 * Article 11 + 20%
 * ========================================
 */

const article52 =
  calculateArticle52({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman:
      evaluationValue
  });


const expected20 =
  Math.round(
    article11Fee *
    0.20
  );


assertEqual(
  article52.article,
  52,
  "Article 52 number"
);


assertEqual(
  article52.additionalPercent,
  20,
  "Article 52 adds 20%"
);


assertEqual(
  article52.article11FeeToman,
  article11Fee,
  "Article 52 Article 11 base"
);


assertEqual(
  article52.additionalFeeToman,
  expected20,
  "Article 52 additional fee"
);


assertEqual(
  article52.feeBeforeCapToman,
  article11Fee +
    expected20,
  "Article 52 fee before cap"
);


assertEqual(
  article52.expertFeeToman,
  Math.min(
    article11Fee +
      expected20,
    ARTICLE_11_GENERAL_MAXIMUM_TOMAN
  ),
  "Article 52 final fee after cap"
);


/*
 * ========================================
 * Article 52 Explicit Cap Test
 * ========================================
 *
 * Find a sufficiently large evaluation value.
 * Article 11 base reaches its general maximum,
 * +20% would exceed the cap, so final expert
 * fee must still be 118M.
 */

const article52Cap =
  calculateArticle52({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman:
      1_000_000_000_000_000
  });


assertEqual(
  article52Cap.article11FeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Large Article 52 base reaches Article 11 cap"
);


assert(
  article52Cap.feeBeforeCapToman >
    ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Article 52 +20% exceeds cap before limiting"
);


assertEqual(
  article52Cap.expertFeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Article 52 final expert fee capped at 118M"
);


assertEqual(
  article52Cap.maximumApplied,
  true,
  "Article 52 maximumApplied"
);


/*
 * ========================================
 * Article 52 Mission Outside Cap
 * ========================================
 */

const outProvinceRate =
  getMissionDailyRate(
    "OUT_PROVINCE"
  );


const article52Mission =
  calculateArticle52({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman:
      1_000_000_000_000_000,

    missionType:
      "OUT_PROVINCE",

    missionDays:
      3
  });


assertEqual(
  article52Mission.expertFeeToman,
  135_000_000,
  "Article 52 capped expert fee"
);


assertEqual(
  article52Mission.missionFeeToman,
  outProvinceRate * 3,
  "Article 52 mission fee"
);


assertEqual(
  article52Mission.totalPayableToman,
  135_000_000 +
    outProvinceRate * 3,
  "Article 52 mission outside cap"
);


/*
 * ========================================
 * Unified Calculator Routing
 * ========================================
 */

const routed48 =
  calculateAgricultureNaturalResources({

    article:
      48,

    discipline:
      "WOOD_INDUSTRIES",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  routed48.article,
  48,
  "Unified routing Article 48"
);


const routed49 =
  calculateAgricultureNaturalResources({

    article:
      49,

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  routed49.article,
  49,
  "Unified routing Article 49"
);


const routed51 =
  calculateAgricultureNaturalResources({

    article:
      51,

    discipline:
      "NATURAL_ENVIRONMENT",

    areaSquareMeters:
      1_001
  });


assertEqual(
  routed51.article,
  51,
  "Unified routing Article 51"
);


assertEqual(
  routed51.expertFeeToman,
  2_200_000,
  "Unified Article 51 calculation"
);


const routed52 =
  calculateAgricultureNaturalResources({

    article:
      52,

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  routed52.article,
  52,
  "Unified routing Article 52"
);


const routed53 =
  calculateAgricultureNaturalResources({

    article:
      53,

    discipline:
      "ANIMAL_PRODUCTS",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  routed53.article,
  53,
  "Unified routing Article 53"
);


/*
 * ========================================
 * All Seven Disciplines
 * ========================================
 */

const disciplines = [

  "AQUATICS_FISHERIES",

  "ANIMAL_HUSBANDRY_VETERINARY",

  "WOOD_INDUSTRIES",

  "AGRICULTURE_NATURAL_RESOURCES",

  "ANIMAL_PRODUCTS",

  "NATURAL_ENVIRONMENT"

] as const;


for (
  const discipline
  of disciplines
) {

  const result =
    calculateArticle48({

      discipline,

      evaluationValueToman:
        evaluationValue
    });


  assertEqual(
    result.expertFeeToman,
    article11Fee,
    `Article 48 discipline ${discipline}`
  );
}


/*
 * ========================================
 * Invalid Evaluation Values
 * ========================================
 */

mustThrow(
  () => {

    calculateArticle48({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        0
    });
  },

  "Article 48 rejects zero value"
);


mustThrow(
  () => {

    calculateArticle49({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        -1
    });
  },

  "Article 49 rejects negative value"
);


mustThrow(
  () => {

    calculateArticle52({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        Number.NaN
    });
  },

  "Article 52 rejects NaN"
);


mustThrow(
  () => {

    calculateArticle53({

      discipline:
        "AQUATICS_FISHERIES",

      evaluationValueToman:
        0
    });
  },

  "Article 53 rejects zero value"
);


/*
 * ========================================
 * Invalid Article 51 Areas
 * ========================================
 */

mustThrow(
  () => {

    calculateArticle51({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        0
    });
  },

  "Article 51 rejects zero area"
);


mustThrow(
  () => {

    calculateArticle51({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        -1
    });
  },

  "Article 51 rejects negative area"
);


mustThrow(
  () => {

    calculateArticle51({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        Number.NaN
    });
  },

  "Article 51 rejects NaN area"
);


/*
 * ========================================
 * Mission Validation Propagation
 * ========================================
 */

mustThrow(
  () => {

    calculateArticle51({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        10_000,

      missionType:
        "IN_PROVINCE",

      missionDays:
        0
    });
  },

  "Article 51 selected mission requires at least one day"
);


mustThrow(
  () => {

    calculateArticle52({

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        evaluationValue,

      missionType:
        "OUT_PROVINCE",

      missionDays:
        1.5
    });
  },

  "Article 52 mission days must be integer"
);


/*
 * ========================================
 * FINAL
 * ========================================
 */

console.log(
  "\n========================================"
);


console.log(
  "Agriculture Natural Resources Calculator: ALL TESTS PASSED"
);


console.log(
  "Articles 48 / 49 / 51 / 52 / 53"
);


console.log(
  "Article 51: Ceiling Blocks / Boundaries / 118M Cap"
);


console.log(
  "Article 52: Article 11 + 20% / 118M Cap"
);


console.log(
  "Mission: Added After Expert Fee"
);


console.log(
  "========================================"
);
