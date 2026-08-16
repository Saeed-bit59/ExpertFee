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
  ARTICLE_51_MAXIMUM_FEE_TOMAN
} from "../src/engine/AgricultureNaturalResourcesRules";

import {
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


/*
 * ========================================
 * Shared Value
 * ========================================
 */

const evaluationValueToman =
  1_000_000_000;


/*
 * ========================================
 * Article 48 Routing
 * ========================================
 */

const engine48 =
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


const direct48 =
  calculateArticle48({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman
  });


assertEqual(
  engine48.article,
  48,
  "Engine routes Article 48"
);


assertEqual(
  engine48.expertFeeToman,
  direct48.expertFeeToman,
  "Engine Article 48 equals Calculator"
);


assertEqual(
  engine48.totalPayableToman,
  direct48.totalPayableToman,
  "Article 48 total payable"
);


/*
 * ========================================
 * Article 49 Routing
 * ========================================
 */

const engine49 =
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


const direct49 =
  calculateArticle49({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman
  });


assertEqual(
  engine49.article,
  49,
  "Engine routes Article 49"
);


assertEqual(
  engine49.expertFeeToman,
  direct49.expertFeeToman,
  "Engine Article 49 equals Calculator"
);


/*
 * ========================================
 * Article 51 Routing
 * ========================================
 */

const engine51 =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "NATURAL_ENVIRONMENT",

      areaSquareMeters:
        10_001
    }
  });


const direct51 =
  calculateArticle51({

    discipline:
      "NATURAL_ENVIRONMENT",

    areaSquareMeters:
      10_001
  });


assertEqual(
  engine51.article,
  51,
  "Engine routes Article 51"
);


assertEqual(
  engine51.expertFeeToman,
  1_560_000,
  "Article 51 at 10001 sqm"
);


assertEqual(
  engine51.expertFeeToman,
  direct51.expertFeeToman,
  "Engine Article 51 equals Calculator"
);


assertEqual(
  engine51.blocksAboveOneHectare,
  1,
  "Article 51 block preserved"
);


/*
 * ========================================
 * Article 51 Cap
 * ========================================
 */

const engine51Cap =
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
  engine51Cap.expertFeeToman,
  ARTICLE_51_MAXIMUM_FEE_TOMAN,
  "Article 51 118M cap"
);


assertEqual(
  engine51Cap.maximumApplied,
  true,
  "Article 51 maximum applied"
);


/*
 * ========================================
 * Article 52 Routing
 * ========================================
 */

const engine52 =
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


const direct52 =
  calculateArticle52({

    discipline:
      "AGRICULTURE_NATURAL_RESOURCES",

    evaluationValueToman
  });


assertEqual(
  engine52.article,
  52,
  "Engine routes Article 52"
);


assertEqual(
  engine52.additionalPercent,
  20,
  "Article 52 adds 20 percent"
);


assertEqual(
  engine52.expertFeeToman,
  direct52.expertFeeToman,
  "Engine Article 52 equals Calculator"
);


assertEqual(
  engine52.additionalFeeToman,
  direct52.additionalFeeToman,
  "Article 52 increase preserved"
);


/*
 * ========================================
 * Article 52 Cap
 * ========================================
 */

const engine52Cap =
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
  engine52Cap.expertFeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Article 52 118M cap"
);


assertEqual(
  engine52Cap.maximumApplied,
  true,
  "Article 52 maximum applied"
);


/*
 * ========================================
 * Article 53 Routing
 * ========================================
 */

const engine53 =
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


const direct53 =
  calculateArticle53({

    discipline:
      "AQUATICS_FISHERIES",

    evaluationValueToman
  });


assertEqual(
  engine53.article,
  53,
  "Engine routes Article 53"
);


assertEqual(
  engine53.expertFeeToman,
  direct53.expertFeeToman,
  "Engine Article 53 equals Calculator"
);


/*
 * ========================================
 * Mission Through Engine - Article 51
 * ========================================
 */

const inProvinceRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const engine51Mission =
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
  engine51Mission.expertFeeToman,
  118_000_000,
  "Article 51 expert fee remains capped"
);


assertEqual(
  engine51Mission.missionFeeToman,
  inProvinceRate * 2,
  "Article 51 mission fee"
);


assertEqual(
  engine51Mission.totalPayableToman,
  118_000_000 +
    inProvinceRate * 2,
  "Article 51 mission outside cap"
);


/*
 * ========================================
 * Mission Through Engine - Article 52
 * ========================================
 */

const outProvinceRate =
  getMissionDailyRate(
    "OUT_PROVINCE"
  );


const engine52Mission =
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
  engine52Mission.expertFeeToman,
  118_000_000,
  "Article 52 expert fee remains capped"
);


assertEqual(
  engine52Mission.missionFeeToman,
  outProvinceRate * 3,
  "Article 52 mission fee"
);


assertEqual(
  engine52Mission.totalPayableToman,
  118_000_000 +
    outProvinceRate * 3,
  "Article 52 mission outside cap"
);


/*
 * ========================================
 * Discipline Propagation
 * ========================================
 */

const disciplineTest =
  calculateAgricultureNaturalResourcesFee({

    article:
      48,

    data: {

      article:
        48,

      discipline:
        "WOOD_INDUSTRIES",

      evaluationValueToman
    }
  });


assertEqual(
  disciplineTest.discipline,
  "WOOD_INDUSTRIES",
  "Engine preserves discipline"
);


/*
 * ========================================
 * Metadata
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.group,
  9,
  "Metadata group"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.title,
  "کشاورزی و منابع طبیعی",
  "Metadata title"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.firstArticle,
  48,
  "Metadata first article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.lastArticle,
  53,
  "Metadata last article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.articles.length,
  5,
  "Five calculable articles"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.disciplines.length,
  7,
  "Seven disciplines"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.serviceTypes.length,
  5,
  "Five service types"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.excludedFromCalculation.length,
  1,
  "One excluded article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.excludedFromCalculation[0],
  50,
  "Article 50 excluded"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.isFinalImplementedTariffGroup,
  true,
  "Group 9 is final implemented group"
);


/*
 * ========================================
 * Metadata Article Semantics
 * ========================================
 */

const article48Metadata =
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
    .articles[0];


const article49Metadata =
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
    .articles[1];


const article51Metadata =
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
    .articles[2];


const article52Metadata =
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
    .articles[3];


const article53Metadata =
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
    .articles[4];


assertEqual(
  article48Metadata.article,
  48,
  "Metadata Article 48"
);


assertEqual(
  article48Metadata.usesArticle11,
  true,
  "Article 48 uses Article 11"
);


assertEqual(
  article49Metadata.article,
  49,
  "Metadata Article 49"
);


assertEqual(
  article49Metadata.usesArticle11,
  true,
  "Article 49 uses Article 11"
);


assertEqual(
  article51Metadata.article,
  51,
  "Metadata Article 51"
);


assertEqual(
  article51Metadata.usesArticle11,
  false,
  "Article 51 does not use Article 11"
);


assertEqual(
  article52Metadata.article,
  52,
  "Metadata Article 52"
);


assertEqual(
  article52Metadata.usesArticle11,
  true,
  "Article 52 uses Article 11"
);


assertEqual(
  article53Metadata.article,
  53,
  "Metadata Article 53"
);


assertEqual(
  article53Metadata.usesArticle11,
  true,
  "Article 53 uses Article 11"
);


/*
 * ========================================
 * Automatic Calculation
 * ========================================
 */

for (
  const item
  of AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.articles
) {

  assertEqual(
    item.automaticCalculationSupported,
    true,
    `Article ${item.article} automatic calculation`
  );
}


/*
 * ========================================
 * FINAL
 * ========================================
 */

console.log(
  "\n========================================"
);


console.log(
  "Agriculture Natural Resources Engine: ALL TESTS PASSED"
);


console.log(
  "Routing: 48 / 49 / 51 / 52 / 53"
);


console.log(
  "Type Narrowing: PASS"
);


console.log(
  "Article 51: Area / Ceiling Blocks / 118M Cap"
);


console.log(
  "Article 52: Article 11 + 20% / 118M Cap"
);


console.log(
  "Mission: Preserved Outside Expert-Fee Cap"
);


console.log(
  "Metadata: Group 9 / Article 50 Excluded"
);


console.log(
  "========================================"
);