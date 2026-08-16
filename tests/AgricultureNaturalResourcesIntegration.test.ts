import {
  calculateAgricultureNaturalResourcesFee,
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
} from "../src/engine/AgricultureNaturalResourcesEngine";

import {
  calculateArticle48,
  calculateArticle49,
  calculateArticle51,
  calculateArticle52,
  calculateArticle53
} from "../src/engine/AgricultureNaturalResourcesCalculator";

import {
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES,
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES,

  ARTICLE_51_BASE_FEE_TOMAN,
  ARTICLE_51_FIRST_BLOCK_FEE_TOMAN,
  ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN,
  ARTICLE_51_MAXIMUM_FEE_TOMAN,

  ARTICLE_52_ADDITIONAL_PERCENT,

  getAgricultureRuleByArticle
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
 * ExpertFee
 * Group 9
 * Agriculture & Natural Resources
 *
 * FINAL INTEGRATION TEST
 * ========================================
 *
 * Integration chain:
 *
 * Rules
 *   ↓
 * Calculator
 *   ↓
 * Engine
 *   ↓
 * CommonFeeEngine
 *   ↓
 * MissionCalculator
 *   ↓
 * Final Result
 *
 * Covered Articles:
 *
 * 48
 * 49
 * 51
 * 52
 * 53
 *
 * Article 50 is intentionally excluded.
 */


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
 * Shared Evaluation Value
 * ========================================
 */

const evaluationValueToman =
  1_000_000_000;


/*
 * ========================================
 * SECTION 1
 * Rules → Calculator → Engine
 *
 * Article 48
 * ========================================
 */

const article48Rule =
  getAgricultureRuleByArticle(
    48
  );


assertEqual(
  article48Rule.article,
  48,
  "Article 48 Rule"
);


assertEqual(
  article48Rule.usesArticle11,
  true,
  "Article 48 Rule uses Article 11"
);


const article48Direct =
  calculateArticle48({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman
  });


const article48Engine =
  calculateAgricultureNaturalResourcesFee({

    article:
      48,

    data: {

      article:
        48,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman
    }
  });


assertEqual(
  article48Engine.article,
  48,
  "Article 48 Engine route"
);


assertEqual(
  article48Engine.expertFeeToman,
  article48Direct.expertFeeToman,
  "Article 48 Engine equals Calculator"
);


/*
 * Independent CommonFeeEngine reference
 */

const article11Reference =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman
  });


assertEqual(
  article48Engine.expertFeeToman,
  article11Reference.finalExpertFeeToman,
  "Article 48 equals CommonFeeEngine Article 11"
);


/*
 * ========================================
 * SECTION 2
 * Article 49 Integration
 * ========================================
 */

const article49Rule =
  getAgricultureRuleByArticle(
    49
  );


assertEqual(
  article49Rule.usesArticle11,
  true,
  "Article 49 uses Article 11"
);


const article49Direct =
  calculateArticle49({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman
  });


const article49Engine =
  calculateAgricultureNaturalResourcesFee({

    article:
      49,

    data: {

      article:
        49,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman
    }
  });


assertEqual(
  article49Engine.expertFeeToman,
  article49Direct.expertFeeToman,
  "Article 49 Engine equals Calculator"
);


assertEqual(
  article49Engine.expertFeeToman,
  article11Reference.finalExpertFeeToman,
  "Article 49 equals Article 11"
);


/*
 * ========================================
 * SECTION 3
 * Article 53 Integration
 * ========================================
 */

const article53Rule =
  getAgricultureRuleByArticle(
    53
  );


assertEqual(
  article53Rule.usesArticle11,
  true,
  "Article 53 uses Article 11"
);


const article53Direct =
  calculateArticle53({

    discipline:
      "AQUATICS_FISHERIES",

    evaluationValueToman
  });


const article53Engine =
  calculateAgricultureNaturalResourcesFee({

    article:
      53,

    data: {

      article:
        53,

      discipline:
        "AQUATICS_FISHERIES",

      evaluationValueToman
    }
  });


assertEqual(
  article53Engine.expertFeeToman,
  article53Direct.expertFeeToman,
  "Article 53 Engine equals Calculator"
);


assertEqual(
  article53Engine.expertFeeToman,
  article11Reference.finalExpertFeeToman,
  "Article 53 equals Article 11"
);


/*
 * ========================================
 * SECTION 4
 * Article 51 Boundary Matrix
 * ========================================
 */

const article51BoundaryCases = [

  {
    area:
      1,

    expectedFee:
      800_000
  },

  {
    area:
      999,

    expectedFee:
      800_000
  },

  {
    area:
      1_000,

    expectedFee:
      800_000
  },

  {
    area:
      1_001,

    expectedFee:
      880_000
  },

  {
    area:
      2_000,

    expectedFee:
      880_000
  },

  {
    area:
      2_001,

    expectedFee:
      960_000
  },

  {
    area:
      5_000,

    expectedFee:
      1_120_000
  },

  {
    area:
      9_999,

    expectedFee:
      1_520_000
  },

  {
    area:
      10_000,

    expectedFee:
      1_520_000
  },

  {
    area:
      10_001,

    expectedFee:
      1_560_000
  },

  {
    area:
      11_000,

    expectedFee:
      1_560_000
  },

  {
    area:
      11_001,

    expectedFee:
      1_600_000
  },

  {
    area:
      20_000,

    expectedFee:
      1_920_000
  },

  {
    area:
      30_000,

    expectedFee:
      2_320_000
  }

] as const;


for (
  const testCase
  of article51BoundaryCases
) {

  const result =
    calculateAgricultureNaturalResourcesFee({

      article:
        51,

      data: {

        article:
          51,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        areaSquareMeters:
          testCase.area
      }
    });


  assertEqual(
    result.expertFeeToman,
    testCase.expectedFee,
    `Article 51 boundary area=${testCase.area}`
  );
}


/*
 * ========================================
 * SECTION 5
 * Article 51 Formula Integrity
 * ========================================
 */

assertEqual(
  ARTICLE_51_BASE_FEE_TOMAN,
  800_000,
  "Article 51 base fee"
);


assertEqual(
  ARTICLE_51_FIRST_BLOCK_FEE_TOMAN,
  80_000,
  "Article 51 first-tier block fee"
);


assertEqual(
  ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN,
  40_000,
  "Article 51 above-hectare block fee"
);


/*
 * ========================================
 * SECTION 6
 * Article 51 Fractional Blocks
 * ========================================
 */

const fractionalFirstTier =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        1_000.01
    }
  });


assertEqual(
  fractionalFirstTier.expertFeeToman,
  880_000,
  "Article 51 fractional first-tier block rounds upward"
);


const fractionalSecondTier =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        10_000.01
    }
  });


assertEqual(
  fractionalSecondTier.expertFeeToman,
  1_560_000,
  "Article 51 fractional above-hectare block rounds upward"
);


/*
 * ========================================
 * SECTION 7
 * Article 51 Cap
 * ========================================
 */

const article51Large =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        3_500_000
    }
  });


assertEqual(
  ARTICLE_51_MAXIMUM_FEE_TOMAN,
  118_000_000,
  "Article 51 maximum constant"
);


assertEqual(
  article51Large.expertFeeToman,
  ARTICLE_51_MAXIMUM_FEE_TOMAN,
  "Article 51 maximum applied"
);


assertEqual(
  article51Large.maximumApplied,
  true,
  "Article 51 maximumApplied flag"
);


assert(
  article51Large.calculatedFeeBeforeCapToman >
    ARTICLE_51_MAXIMUM_FEE_TOMAN,
  "Article 51 raw fee exceeds maximum"
);


/*
 * ========================================
 * SECTION 8
 * Article 51 Mission Outside Cap
 * ========================================
 */

const inProvinceRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const article51Mission =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        3_500_000,

      missionType:
        "IN_PROVINCE",

      missionDays:
        2
    }
  });


assertEqual(
  article51Mission.expertFeeToman,
  118_000_000,
  "Article 51 capped before mission"
);


assertEqual(
  article51Mission.missionFeeToman,
  inProvinceRate * 2,
  "Article 51 mission calculation"
);


assertEqual(
  article51Mission.totalPayableToman,
  118_000_000 +
    inProvinceRate * 2,
  "Article 51 mission outside maximum"
);


/*
 * ========================================
 * SECTION 9
 * Article 52
 * Article 11 + 20%
 * ========================================
 */

const article52Rule =
  getAgricultureRuleByArticle(
    52
  );


assertEqual(
  article52Rule.usesArticle11,
  true,
  "Article 52 uses Article 11"
);


assertEqual(
  ARTICLE_52_ADDITIONAL_PERCENT,
  20,
  "Article 52 additional percentage"
);


const article52Direct =
  calculateArticle52({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman
  });


const article52Engine =
  calculateAgricultureNaturalResourcesFee({

    article:
      52,

    data: {

      article:
        52,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman
    }
  });


assertEqual(
  article52Engine.expertFeeToman,
  article52Direct.expertFeeToman,
  "Article 52 Engine equals Calculator"
);


const expectedArticle52Increase =
  Math.round(
    article11Reference.finalExpertFeeToman *
      0.20
  );


assertEqual(
  article52Engine.additionalFeeToman,
  expectedArticle52Increase,
  "Article 52 20 percent increase"
);


assertEqual(
  article52Engine.feeBeforeCapToman,
  article11Reference.finalExpertFeeToman +
    expectedArticle52Increase,
  "Article 52 fee before cap"
);


/*
 * ========================================
 * SECTION 10
 * Article 52 Cap
 * ========================================
 */

const article52Maximum =
  calculateAgricultureNaturalResourcesFee({

    article:
      52,

    data: {

      article:
        52,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        1_000_000_000_000_000
    }
  });


assertEqual(
  article52Maximum.article11FeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Article 52 Article 11 reaches maximum"
);


assert(
  article52Maximum.feeBeforeCapToman >
    ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Article 52 +20 percent exceeds maximum before cap"
);


assertEqual(
  article52Maximum.expertFeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Article 52 capped at 118M"
);


assertEqual(
  article52Maximum.maximumApplied,
  true,
  "Article 52 maximumApplied flag"
);


/*
 * ========================================
 * SECTION 11
 * Article 52 Mission Outside Cap
 * ========================================
 */

const outProvinceRate =
  getMissionDailyRate(
    "OUT_PROVINCE"
  );


const article52Mission =
  calculateAgricultureNaturalResourcesFee({

    article:
      52,

    data: {

      article:
        52,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        1_000_000_000_000_000,

      missionType:
        "OUT_PROVINCE",

      missionDays:
        3
    }
  });


assertEqual(
  article52Mission.expertFeeToman,
  118_000_000,
  "Article 52 expert fee capped before mission"
);


assertEqual(
  article52Mission.missionFeeToman,
  outProvinceRate * 3,
  "Article 52 mission calculation"
);


assertEqual(
  article52Mission.totalPayableToman,
  118_000_000 +
    outProvinceRate * 3,
  "Article 52 mission outside cap"
);


/*
 * ========================================
 * SECTION 12
 * All Seven Disciplines
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.length,
  7,
  "Group 9 contains seven disciplines"
);


for (
  const discipline
  of AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES
) {

  const result =
    calculateAgricultureNaturalResourcesFee({

      article:
        48,

      data: {

        article:
          48,

        discipline,

        evaluationValueToman
      }
    });


  assertEqual(
    result.expertFeeToman,
    article11Reference.finalExpertFeeToman,
    `Article 48 discipline ${discipline}`
  );
}


/*
 * ========================================
 * SECTION 13
 * Supported Articles
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES.length,
  5,
  "Five automatically calculated articles"
);


const supportedArticles:
  readonly number[] =
    AGRICULTURE_NATURAL_RESOURCES_ARTICLES;


assert(
  supportedArticles.includes(
    48
  ),
  "Article 48 supported"
);


assert(
  supportedArticles.includes(
    49
  ),
  "Article 49 supported"
);


assert(
  supportedArticles.includes(
    51
  ),
  "Article 51 supported"
);


assert(
  supportedArticles.includes(
    52
  ),
  "Article 52 supported"
);


assert(
  supportedArticles.includes(
    53
  ),
  "Article 53 supported"
);


assert(
  !supportedArticles.includes(
    50
  ),
  "Article 50 excluded"
);


/*
 * ========================================
 * SECTION 14
 * Engine Metadata
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.group,
  9,
  "Engine metadata group"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.title,
  "کشاورزی و منابع طبیعی",
  "Engine metadata title"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.articles.length,
  5,
  "Engine metadata article count"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.disciplines.length,
  7,
  "Engine metadata discipline count"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.excludedFromCalculation[0],
  50,
  "Engine metadata excludes Article 50"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.isFinalImplementedTariffGroup,
  true,
  "Group 9 marked as final implemented tariff group"
);


/*
 * ========================================
 * SECTION 15
 * Invalid Article 51 Inputs
 * ========================================
 */

mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        51,

      data: {

        article:
          51,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        areaSquareMeters:
          0
      }
    });
  },

  "Article 51 rejects zero area"
);


mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        51,

      data: {

        article:
          51,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        areaSquareMeters:
          -1
      }
    });
  },

  "Article 51 rejects negative area"
);


mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        51,

      data: {

        article:
          51,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        areaSquareMeters:
          Number.NaN
      }
    });
  },

  "Article 51 rejects NaN area"
);


/*
 * ========================================
 * SECTION 16
 * Invalid Article 11 Inputs
 * ========================================
 */

mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        48,

      data: {

        article:
          48,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        evaluationValueToman:
          0
      }
    });
  },

  "Article 48 rejects zero evaluation"
);


mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        49,

      data: {

        article:
          49,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        evaluationValueToman:
          -1
      }
    });
  },

  "Article 49 rejects negative evaluation"
);


mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        52,

      data: {

        article:
          52,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        evaluationValueToman:
          Number.NaN
      }
    });
  },

  "Article 52 rejects NaN evaluation"
);


mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        53,

      data: {

        article:
          53,

        discipline:
          "AQUATICS_FISHERIES",

        evaluationValueToman:
          0
      }
    });
  },

  "Article 53 rejects zero evaluation"
);


/*
 * ========================================
 * SECTION 17
 * Mission Validation
 * ========================================
 */

mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        51,

      data: {

        article:
          51,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        areaSquareMeters:
          10_000,

        missionType:
          "IN_PROVINCE",

        missionDays:
          0
      }
    });
  },

  "Selected mission requires at least one day"
);


mustThrow(
  () => {

    calculateAgricultureNaturalResourcesFee({

      article:
        52,

      data: {

        article:
          52,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        evaluationValueToman,

        missionType:
          "OUT_PROVINCE",

        missionDays:
          1.5
      }
    });
  },

  "Mission days must be integer"
);


/*
 * ========================================
 * SECTION 18
 * Final Cross-Layer Consistency
 * ========================================
 *
 * Articles 48, 49 and 53 all reference
 * Article 11 and therefore must produce
 * the same fee for the same evaluation
 * value when no other factor is present.
 */

assertEqual(
  article48Engine.expertFeeToman,
  article49Engine.expertFeeToman,
  "Articles 48 and 49 same Article 11 base"
);


assertEqual(
  article49Engine.expertFeeToman,
  article53Engine.expertFeeToman,
  "Articles 49 and 53 same Article 11 base"
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
  "GROUP 9 FINAL INTEGRATION: ALL TESTS PASSED"
);


console.log(
  "Rules -> Calculator -> Engine -> CommonFee -> Mission"
);


console.log(
  "Articles: 48 / 49 / 51 / 52 / 53"
);


console.log(
  "Article 50: Excluded"
);


console.log(
  "Article 51: Boundaries / Ceiling Blocks / 118M Cap"
);


console.log(
  "Article 52: Article 11 + 20% / 118M Cap"
);


console.log(
  "Mission: Outside Expert-Fee Cap"
);


console.log(
  "Disciplines: 7 / 7"
);


console.log(
  "GROUP 9: FINAL PASS"
);


console.log(
  "========================================"
);