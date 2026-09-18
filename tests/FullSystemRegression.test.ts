import {
  calculateCommonFee,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN
} from "../src/engine/CommonFeeEngine";

import {
  getMissionDailyRate
} from "../src/engine/MissionCalculator";

import {
  calculateVehicleFee
} from "../src/engine/VehicleCalculator";

import {
  calculateRoadBuildingFee,
  ROAD_BUILDING_ENGINE_METADATA
} from "../src/engine/RoadBuildingEngine";

import {
  calculateIndustryTechnologyFee,
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
} from "../src/engine/IndustryTechnologyEngine";

import {
  calculateAgricultureNaturalResourcesFee,
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
} from "../src/engine/AgricultureNaturalResourcesEngine";


/*
 * ============================================================
 * ExpertFee
 *
 * FULL SYSTEM INTEGRATION / REGRESSION TEST
 * ============================================================
 *
 * Core:
 *   CommonFeeEngine
 *   MissionCalculator
 *
 * Group 5:
 *   VehicleCalculator
 *
 * Group 6:
 *   RoadBuildingEngine
 *
 * Group 7:
 *   IndustryTechnologyEngine
 *
 * Group 9:
 *   AgricultureNaturalResourcesEngine
 *
 * هدف:
 * کنترل سازگاری سراسری موتورهای تعرفه‌ای
 * بدون تکرار کامل Unit Testهای هر گروه.
 * ============================================================
 */


/*
 * ============================================================
 * Test Helpers
 * ============================================================
 */

function assert(
  condition: boolean,
  message: string
): void {

  if (!condition) {

    throw new Error(
      `FULL SYSTEM REGRESSION FAILED: ${message}`
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
        `FULL SYSTEM REGRESSION FAILED: ${message}`,
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
 * ============================================================
 * Shared Reference Values
 * ============================================================
 */

const STANDARD_EVALUATION_VALUE =
  1_000_000_000;


const VERY_LARGE_EVALUATION_VALUE =
  1_000_000_000_000_000;


/*
 * ============================================================
 * SECTION 1
 *
 * Core Article 11 Reference
 * ============================================================
 */

const article11Reference =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      STANDARD_EVALUATION_VALUE
  });


const article11Fee =
  article11Reference
    .finalExpertFeeToman;


assert(
  article11Fee > 0,
  "Core Article 11 fee must be positive"
);


assertEqual(
  article11Reference.missionFeeToman,
  0,
  "Core Article 11 mission must be zero by default"
);


assertEqual(
  article11Reference.totalPayableToman,
  article11Fee,
  "Core Article 11 total without mission"
);


/*
 * ============================================================
 * SECTION 2
 *
 * Core General Maximum
 * ============================================================
 */

assertEqual(
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  135_000_000,
  "General Article 11 maximum must remain 135M Toman"
);


const article11Maximum =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      VERY_LARGE_EVALUATION_VALUE,

    increasePercent:
      50
  });


assertEqual(
  article11Maximum.finalExpertFeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Core Article 11 maximum regression"
);


/*
 * ============================================================
 * SECTION 3
 *
 * Group 5
 * Vehicle Fixed Fees
 * ============================================================
 */

const vehicleAuthenticity =
  calculateVehicleFee({

    service:
      "LAND_AUTHENTICITY"
  });


assertEqual(
  vehicleAuthenticity.expertFeeToman,
  2_000_000,
  "Group 5 land authenticity"
);


const vehicleAccident =
  calculateVehicleFee({

    service:
      "LAND_ACCIDENT"
  });


assertEqual(
  vehicleAccident.expertFeeToman,
  2_000_000,
  "Group 5 land accident"
);


const vehicleTonnage =
  calculateVehicleFee({

    service:
      "LAND_TONNAGE_MODEL"
  });


assertEqual(
  vehicleTonnage.expertFeeToman,
  2_000_000,
  "Group 5 tonnage/model"
);


const inlandCollision =
  calculateVehicleFee({

    service:
      "INLAND_BOAT_COLLISION"
  });


assertEqual(
  inlandCollision.expertFeeToman,
  2_000_000,
  "Group 5 inland collision"
);


const seaCollisionUnder500 =
  calculateVehicleFee({

    service:
      "SEA_COLLISION_UNDER_500_GT"
  });


assertEqual(
  seaCollisionUnder500.expertFeeToman,
  3_500_000,
  "Group 5 sea collision under 500 GT"
);


const seaCollision500Plus =
  calculateVehicleFee({

    service:
      "SEA_COLLISION_500_GT_OR_MORE"
  });


assertEqual(
  seaCollision500Plus.expertFeeToman,
  7_000_000,
  "Group 5 sea collision 500 GT or more"
);


/*
 * ============================================================
 * SECTION 4
 *
 * Group 5 -> Article 11
 * ============================================================
 */

const vehicleLandValuation =
  calculateVehicleFee({

    service:
      "LAND_VALUATION",

    evaluationValueToman:
      STANDARD_EVALUATION_VALUE
  });


const vehicleMarineValuation =
  calculateVehicleFee({

    service:
      "MARINE_VALUATION",

    evaluationValueToman:
      STANDARD_EVALUATION_VALUE
  });


const transportClaim =
  calculateVehicleFee({

    service:
      "TRANSPORT_CLAIM",

    evaluationValueToman:
      STANDARD_EVALUATION_VALUE
  });


assertEqual(
  vehicleLandValuation.expertFeeToman,
  Math.min(article11Fee, 7_000_000),
  "Group 5 land valuation must respect the Article 31 per-vehicle maximum"
);


assertEqual(
  vehicleMarineValuation.expertFeeToman,
  article11Fee,
  "Group 5 marine valuation must equal Article 11"
);


assertEqual(
  transportClaim.expertFeeToman,
  article11Fee,
  "Group 5 transport claim must equal Article 11"
);


/*
 * ============================================================
 * SECTION 5
 *
 * Group 6
 * Article 33 -> Article 11
 * ============================================================
 */

const roadArticle33 =
  calculateRoadBuildingFee({

    article:
      33,

    data: {

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


assert(
  "expertFeeToman" in roadArticle33,
  "Group 6 Article 33 must contain expertFeeToman"
);


if (
  !("expertFeeToman" in roadArticle33)
) {

  throw new Error(
    "Unreachable: Article 33 result missing expertFeeToman."
  );
}


assertEqual(
  roadArticle33.expertFeeToman,
  article11Fee,
  "Group 6 Article 33 must equal Article 11"
);


/*
 * ============================================================
 * SECTION 6
 *
 * Group 6
 * Article 34 Regression
 * ============================================================
 */

const roadArticle34Minimum =
  calculateRoadBuildingFee({

    article:
      34,

    data: {

      areaSquareMeters:
        100
    }
  });


assert(
  "expertFeeToman" in roadArticle34Minimum,
  "Article 34 result must contain expertFeeToman"
);


if (
  !("expertFeeToman" in roadArticle34Minimum)
) {

  throw new Error(
    "Unreachable: Article 34 result missing expertFeeToman."
  );
}


assertEqual(
  roadArticle34Minimum.expertFeeToman,
  2_000_000,
  "Group 6 Article 34 minimum regression"
);


const roadArticle34Normal =
  calculateRoadBuildingFee({

    article:
      34,

    data: {

      areaSquareMeters:
        1_000
    }
  });


assert(
  "expertFeeToman" in roadArticle34Normal,
  "Article 34 normal result must contain expertFeeToman"
);


if (
  !("expertFeeToman" in roadArticle34Normal)
) {

  throw new Error(
    "Unreachable: Article 34 normal result missing expertFeeToman."
  );
}


assertEqual(
  roadArticle34Normal.expertFeeToman,
  3_000_000,
  "Group 6 Article 34 normal regression"
);


/*
 * ============================================================
 * SECTION 7
 *
 * Group 6 Metadata
 * ============================================================
 */

assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.group,
  6,
  "Group 6 metadata group"
);


assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.firstArticle,
  33,
  "Group 6 first article"
);


assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.lastArticle,
  44,
  "Group 6 last article"
);


assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.articles.length,
  12,
  "Group 6 must contain Articles 33-44"
);


assertEqual(
  ROAD_BUILDING_ENGINE_METADATA
    .articles
    .map(
      item =>
        item.article
    )
    .join(","),
  "33,34,35,36,37,38,39,40,41,42,43,44",
  "Group 6 article sequence"
);


/*
 * ============================================================
 * SECTION 8
 *
 * Group 7
 * Normal Evaluation -> Article 11
 * ============================================================
 */

const industryEvaluation =
  calculateIndustryTechnologyFee({

    article:
      45,

    data: {

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "EVALUATION",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


assertEqual(
  industryEvaluation.article11FeeToman,
  article11Fee,
  "Group 7 evaluation Article 11 base"
);


assertEqual(
  industryEvaluation.additionalPercent,
  0,
  "Group 7 normal evaluation has no increase"
);


assertEqual(
  industryEvaluation.expertFeeToman,
  article11Fee,
  "Group 7 normal evaluation equals Article 11"
);


/*
 * ============================================================
 * SECTION 9
 *
 * Group 7
 * Article 11 + 40%
 * ============================================================
 */

const industryMachinery =
  calculateIndustryTechnologyFee({

    article:
      45,

    data: {

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


const expected40Percent =
  Math.round(
    article11Fee *
      0.40
  );


assertEqual(
  industryMachinery.additionalPercent,
  40,
  "Group 7 machinery technical assessment = +40%"
);


assertEqual(
  industryMachinery.additionalFeeToman,
  expected40Percent,
  "Group 7 +40% amount"
);


assertEqual(
  industryMachinery.expertFeeToman,
  article11Fee +
    expected40Percent,
  "Group 7 machinery = Article 11 + 40%"
);


/*
 * ============================================================
 * SECTION 10
 *
 * Group 7
 * Software -> Article 11 + 50%
 * ============================================================
 */

const industrySoftware =
  calculateIndustryTechnologyFee({

    article:
      45,

    data: {

      discipline:
        "COMPUTER_INFORMATION_TECHNOLOGY",

      serviceType:
        "SOFTWARE_EXPERTISE",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


const expected50Percent =
  Math.round(
    article11Fee *
      0.50
  );


assertEqual(
  industrySoftware.additionalPercent,
  50,
  "Group 7 software = +50%"
);


assertEqual(
  industrySoftware.additionalFeeToman,
  expected50Percent,
  "Group 7 software +50% amount"
);


assertEqual(
  industrySoftware.expertFeeToman,
  article11Fee +
    expected50Percent,
  "Group 7 software = Article 11 +50%"
);


/*
 * ============================================================
 * SECTION 11
 *
 * Group 7 Metadata
 *
 * اصلاح مهم:
 *
 * Metadata گروه 7 دارای articles[] است
 * و property مستقیمی به نام article ندارد.
 * ============================================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.group,
  7,
  "Group 7 metadata group"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.title,
  "صنعت و فن",
  "Group 7 metadata title"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.firstArticle,
  45,
  "Group 7 first article"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.lastArticle,
  45,
  "Group 7 last article"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.articles.length,
  1,
  "Group 7 must contain one article"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.articles[0].article,
  45,
  "Group 7 Article 45 metadata"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .articles[0]
    .automaticCalculationSupported,
  true,
  "Group 7 Article 45 automatic calculation supported"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .articles[0]
    .usesArticle11,
  true,
  "Group 7 Article 45 uses Article 11"
);


/*
 * ============================================================
 * SECTION 12
 *
 * Group 9
 * Articles 48 / 49 / 53 -> Article 11
 * ============================================================
 */

const agriculture48 =
  calculateAgricultureNaturalResourcesFee({

    article:
      48,

    data: {

      article:
        48,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


const agriculture49 =
  calculateAgricultureNaturalResourcesFee({

    article:
      49,

    data: {

      article:
        49,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


const agriculture53 =
  calculateAgricultureNaturalResourcesFee({

    article:
      53,

    data: {

      article:
        53,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


assertEqual(
  agriculture48.expertFeeToman,
  article11Fee,
  "Group 9 Article 48 = Article 11"
);


assertEqual(
  agriculture49.expertFeeToman,
  article11Fee,
  "Group 9 Article 49 = Article 11"
);


assertEqual(
  agriculture53.expertFeeToman,
  article11Fee,
  "Group 9 Article 53 = Article 11"
);


/*
 * ============================================================
 * SECTION 13
 *
 * CRITICAL CROSS-GROUP ARTICLE 11 CONSISTENCY
 * ============================================================
 */

const article11CrossGroupFees = [

  article11Fee,

  vehicleMarineValuation
    .expertFeeToman,

  transportClaim
    .expertFeeToman,

  roadArticle33
    .expertFeeToman,

  industryEvaluation
    .expertFeeToman,

  agriculture48
    .expertFeeToman,

  agriculture49
    .expertFeeToman,

  agriculture53
    .expertFeeToman

];


for (
  const fee
  of article11CrossGroupFees
) {

  assertEqual(
    fee,
    article11Fee,
    "All Article 11 routes across groups must remain identical"
  );
}


/*
 * ============================================================
 * SECTION 14
 *
 * Group 9
 * Article 51 Boundary Regression
 * ============================================================
 */

const agriculture51At1000 =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        1_000
    }
  });


assertEqual(
  agriculture51At1000.expertFeeToman,
  2_000_000,
  "Group 9 Article 51 at 1000 sqm"
);


const agriculture51At1001 =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        1_001
    }
  });


assertEqual(
  agriculture51At1001.expertFeeToman,
  2_200_000,
  "Group 9 Article 51 at 1001 sqm"
);


const agriculture51At10000 =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        10_000
    }
  });


assertEqual(
  agriculture51At10000.expertFeeToman,
  3_800_000,
  "Group 9 Article 51 at one hectare"
);


const agriculture51At10001 =
  calculateAgricultureNaturalResourcesFee({

    article:
      51,

    data: {

      article:
        51,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      areaSquareMeters:
        10_001
    }
  });


assertEqual(
  agriculture51At10001.expertFeeToman,
  3_900_000,
  "Group 9 Article 51 first block above one hectare"
);


/*
 * ============================================================
 * SECTION 15
 *
 * Group 9
 * Article 51 Maximum
 * ============================================================
 */

const agriculture51Maximum =
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
  agriculture51Maximum.expertFeeToman,
  135_000_000,
  "Group 9 Article 51 maximum regression"
);


assertEqual(
  agriculture51Maximum.maximumApplied,
  true,
  "Group 9 Article 51 maximum flag"
);


/*
 * ============================================================
 * SECTION 16
 *
 * Group 9
 * Article 52 -> Article 11 + 20%
 * ============================================================
 */

const agriculture52 =
  calculateAgricultureNaturalResourcesFee({

    article:
      52,

    data: {

      article:
        52,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE
    }
  });


const expected20Percent =
  Math.round(
    article11Fee *
      0.20
  );


assertEqual(
  agriculture52.article11FeeToman,
  article11Fee,
  "Group 9 Article 52 Article 11 base"
);


assertEqual(
  agriculture52.additionalPercent,
  20,
  "Group 9 Article 52 = +20%"
);


assertEqual(
  agriculture52.additionalFeeToman,
  expected20Percent,
  "Group 9 Article 52 +20% amount"
);


assertEqual(
  agriculture52.expertFeeToman,
  article11Fee +
    expected20Percent,
  "Group 9 Article 52 = Article 11 +20%"
);


/*
 * ============================================================
 * SECTION 17
 *
 * Group 9 Article 52 Maximum
 * ============================================================
 */

const agriculture52Maximum =
  calculateAgricultureNaturalResourcesFee({

    article:
      52,

    data: {

      article:
        52,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        VERY_LARGE_EVALUATION_VALUE
    }
  });


assertEqual(
  agriculture52Maximum.expertFeeToman,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  "Group 9 Article 52 maximum regression"
);


assertEqual(
  agriculture52Maximum.maximumApplied,
  true,
  "Group 9 Article 52 maximum flag"
);


/*
 * ============================================================
 * SECTION 18
 *
 * Group 9 Metadata
 * ============================================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.group,
  9,
  "Group 9 metadata group"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.title,
  "کشاورزی و منابع طبیعی",
  "Group 9 metadata title"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.firstArticle,
  48,
  "Group 9 first article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.lastArticle,
  53,
  "Group 9 last article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA.articles.length,
  5,
  "Group 9 calculable article count"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
    .excludedFromCalculation[0],
  50,
  "Group 9 Article 50 excluded"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA
    .isFinalImplementedTariffGroup,
  true,
  "Group 9 final implemented tariff group"
);


/*
 * ============================================================
 * SECTION 19
 *
 * Mission Core Regression
 * ============================================================
 */

const inProvinceDailyRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const outProvinceDailyRate =
  getMissionDailyRate(
    "OUT_PROVINCE"
  );


assert(
  inProvinceDailyRate > 0,
  "In-province mission rate must be positive"
);


assert(
  outProvinceDailyRate > 0,
  "Out-province mission rate must be positive"
);


/*
 * ============================================================
 * SECTION 20
 *
 * Mission Outside Maximum
 * CommonFeeEngine
 * ============================================================
 */

const coreMaximumWithMission =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      VERY_LARGE_EVALUATION_VALUE,

    increasePercent:
      50,

    missionType:
      "IN_PROVINCE",

    missionDays:
      2
  });


assertEqual(
  coreMaximumWithMission.finalExpertFeeToman,
  135_000_000,
  "Core expert fee remains capped"
);


assertEqual(
  coreMaximumWithMission.missionFeeToman,
  inProvinceDailyRate * 2,
  "Core mission calculation"
);


assertEqual(
  coreMaximumWithMission.totalPayableToman,
  135_000_000 +
    inProvinceDailyRate * 2,
  "Core mission remains outside expert-fee cap"
);


/*
 * ============================================================
 * SECTION 21
 *
 * Group 7 Mission Regression
 * ============================================================
 */

const industryMission =
  calculateIndustryTechnologyFee({

    article:
      45,

    data: {

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

      evaluationValueToman:
        STANDARD_EVALUATION_VALUE,

      missionType:
        "IN_PROVINCE",

      missionDays:
        2
    }
  });


assertEqual(
  industryMission.expertFeeToman,
  industryMachinery.expertFeeToman,
  "Group 7 mission must not alter expert fee"
);


assertEqual(
  industryMission.missionFeeToman,
  inProvinceDailyRate * 2,
  "Group 7 mission calculation"
);


assertEqual(
  industryMission.totalPayableToman,
  industryMission.expertFeeToman +
    industryMission.missionFeeToman,
  "Group 7 total = expert fee + mission"
);


/*
 * ============================================================
 * SECTION 22
 *
 * Group 9 Mission Outside Cap
 * ============================================================
 */

const agricultureMission =
  calculateAgricultureNaturalResourcesFee({

    article:
      52,

    data: {

      article:
        52,

      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",

      evaluationValueToman:
        VERY_LARGE_EVALUATION_VALUE,

      missionType:
        "OUT_PROVINCE",

      missionDays:
        3
    }
  });


assertEqual(
  agricultureMission.expertFeeToman,
  135_000_000,
  "Group 9 expert fee remains capped"
);


assertEqual(
  agricultureMission.missionFeeToman,
  outProvinceDailyRate * 3,
  "Group 9 mission calculation"
);


assertEqual(
  agricultureMission.totalPayableToman,
  135_000_000 +
    outProvinceDailyRate * 3,
  "Group 9 mission remains outside cap"
);


/*
 * ============================================================
 * SECTION 23
 *
 * Cross-System Percentage Relationship
 *
 * Base
 * <
 * +20%
 * <
 * +40%
 * <
 * +50%
 * ============================================================
 */

assert(
  article11Fee <
    agriculture52.expertFeeToman,
  "Article 11 must be lower than Article 11 +20%"
);


assert(
  agriculture52.expertFeeToman <
    industryMachinery.expertFeeToman,
  "+20% must be lower than +40%"
);


assert(
  industryMachinery.expertFeeToman <
    industrySoftware.expertFeeToman,
  "+40% must be lower than +50%"
);


/*
 * ============================================================
 * SECTION 24
 *
 * Invalid Inputs Must Still Be Rejected
 * ============================================================
 */

mustThrow(
  () => {

    calculateVehicleFee({

      service:
        "LAND_VALUATION",

      evaluationValueToman:
        0
    });
  },

  "Group 5 must reject zero evaluation value"
);


mustThrow(
  () => {

    calculateRoadBuildingFee({

      article:
        33,

      data: {

        evaluationValueToman:
          0
      }
    });
  },

  "Group 6 must reject zero evaluation value"
);


mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article:
        45,

      data: {

        discipline:
          "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          0
      }
    });
  },

  "Group 7 must reject zero evaluation value"
);


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

  "Group 9 must reject zero evaluation value"
);


/*
 * ============================================================
 * SECTION 25
 *
 * Article 51 Invalid Area
 * ============================================================
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

  "Article 51 must reject zero area"
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

  "Article 51 must reject negative area"
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

  "Article 51 must reject NaN area"
);


/*
 * ============================================================
 * SECTION 26
 *
 * Mission Validation
 * ============================================================
 */

mustThrow(
  () => {

    calculateCommonFee({

      baseMode:
        "FIXED",

      fixedFeeToman:
        1_000_000,

      missionType:
        "IN_PROVINCE",

      missionDays:
        0
    });
  },

  "Mission selected with zero days must be rejected"
);


/*
 * ============================================================
 * SECTION 27
 *
 * Cross-Group Maximum Integrity
 * ============================================================
 */

assertEqual(
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  agriculture51Maximum.expertFeeToman,
  "Article 51 maximum equals general project maximum"
);


assertEqual(
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  agriculture52Maximum.expertFeeToman,
  "Article 52 maximum equals general project maximum"
);


assertEqual(
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  article11Maximum.finalExpertFeeToman,
  "CommonFee maximum equals project maximum"
);


/*
 * ============================================================
 * SECTION 28
 *
 * Final Cross-Layer Sanity
 * ============================================================
 */

assertEqual(
  agriculture48.expertFeeToman,
  agriculture49.expertFeeToman,
  "Group 9 Articles 48 and 49 same Article 11 base"
);


assertEqual(
  agriculture49.expertFeeToman,
  agriculture53.expertFeeToman,
  "Group 9 Articles 49 and 53 same Article 11 base"
);


assertEqual(
  agriculture48.expertFeeToman,
  industryEvaluation.expertFeeToman,
  "Group 7 normal evaluation and Group 9 Article 48 same Article 11 base"
);


assertEqual(
  vehicleLandValuation.expertFeeToman,
  Math.min(article11Fee, 7_000_000),
  "Group 5 land valuation must apply the Article 31 per-vehicle maximum"
);


assertEqual(
  vehicleMarineValuation.expertFeeToman,
  roadArticle33.expertFeeToman,
  "Article 32 and Group 6 Article 11 consistency"
);


/*
 * ============================================================
 * FINAL SYSTEM STATUS
 * ============================================================
 */

console.log(
  "\n============================================================"
);


console.log(
  "EXPERTFEE FULL SYSTEM REGRESSION: ALL TESTS PASSED"
);


console.log(
  "------------------------------------------------------------"
);


console.log(
  "CORE     : CommonFeeEngine / MissionCalculator       PASS"
);


console.log(
  "GROUP 5  : Vehicle                                   PASS"
);


console.log(
  "GROUP 6  : Road & Building Articles 33-44            PASS"
);


console.log(
  "GROUP 7  : Industry & Technology Article 45          PASS"
);


console.log(
  "GROUP 9  : Agriculture Articles 48/49/51/52/53       PASS"
);


console.log(
  "------------------------------------------------------------"
);


console.log(
  "Article 11 Cross-Group Consistency                   PASS"
);


console.log(
  "Percentage Rules +20 / +40 / +50                     PASS"
);


console.log(
  "General Maximum 135,000,000 Toman                   PASS"
);


console.log(
  "Article 51 Area / Block / Maximum                    PASS"
);


console.log(
  "Mission Outside Expert-Fee Maximum                   PASS"
);


console.log(
  "Invalid Input Protection                             PASS"
);


console.log(
  "Metadata Integrity                                  PASS"
);


console.log(
  "------------------------------------------------------------"
);


console.log(
  "FULL SYSTEM STATUS                                   PASS"
);


console.log(
  "============================================================"
);
