import fs from "node:fs";
import path from "node:path";

import {
  calculateExpertFee,
  EXPERT_FEE_ENGINE_METADATA
} from "../src/engine/ExpertFeeEngine";

import {
  calculateCommonFee
} from "../src/engine/CommonFeeEngine";

import {
  calculateArticle13
} from "../src/engine/Article13Calculator";

import {
  calculateArticle14
} from "../src/engine/Article14Calculator";


/*
 * ============================================================
 * ExpertFee
 * Final End-to-End Acceptance Test
 * ============================================================
 *
 * Scope:
 *
 * UI wiring
 *   -> ExpertFeeEngine
 *   -> Specialized Engines
 *   -> Calculators / Rules
 *   -> CommonFeeEngine / Article 11
 *   -> Mission
 *   -> Final Result
 *
 * Standalone public calculators:
 *   Article 13
 *   Article 14
 *
 * This test intentionally checks both:
 *
 * 1) Runtime calculation paths
 * 2) UI architectural wiring contracts
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
      `FINAL ACCEPTANCE TEST FAILED: ${message}`
    );
  }
}


function assertEqual(
  actual: number | string | boolean,
  expected: number | string | boolean,
  message: string
): void {

  if (actual !== expected) {

    throw new Error(
      [
        `FINAL ACCEPTANCE TEST FAILED: ${message}`,
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


function readProjectFile(
  relativePath: string
): string {

  const absolutePath =
    path.resolve(
      process.cwd(),
      relativePath
    );

  assert(
    fs.existsSync(
      absolutePath
    ),
    `Required project file does not exist: ${relativePath}`
  );

  return fs.readFileSync(
    absolutePath,
    "utf8"
  );
}


function assertContains(
  source: string,
  expectedText: string,
  message: string
): void {

  assert(
    source.includes(
      expectedText
    ),
    message
  );
}


function assertNotContains(
  source: string,
  forbiddenText: string,
  message: string
): void {

  assert(
    !source.includes(
      forbiddenText
    ),
    message
  );
}


/*
 * ============================================================
 * Shared Reference Value
 * ============================================================
 */

const evaluationValueToman =
  1_000_000_000;


/*
 * ============================================================
 * 1) Common Core / Article 11
 * ============================================================
 */

const article11Reference =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman
  });


assert(
  article11Reference.finalExpertFeeToman > 0,
  "Article 11 reference fee must be positive"
);


assert(
  article11Reference.finalExpertFeeToman <=
    118_000_000,
  "Article 11 fee must respect general maximum"
);


/*
 * ============================================================
 * 2) Article 13
 * Standalone UI Calculation
 * ============================================================
 */

const article13Minimum =
  calculateArticle13({

    monthlyRentToman:
      10_000_000
  });


assertEqual(
  article13Minimum.finalFeeToman,
  2_000_000,
  "Article 13 first threshold"
);


const article13SecondTier =
  calculateArticle13({

    monthlyRentToman:
      50_000_000
  });


assertEqual(
  article13SecondTier.finalFeeToman,
  12_000_000,
  "Article 13 second threshold"
);


const article13Maximum =
  calculateArticle13({

    monthlyRentToman:
      2_000_000_000
  });


assertEqual(
  article13Maximum.finalFeeToman,
  90_000_000,
  "Article 13 maximum"
);


assertEqual(
  article13Maximum.capped,
  true,
  "Article 13 maximum flag"
);


/*
 * ============================================================
 * 3) Article 14
 * Standalone UI Calculation
 * ============================================================
 */

const article14Base =
  calculateArticle14({

    pastImageYearCount:
      0,

    hasAdditionalConnectedParcels:
      false,

    additionalConnectedParcelCount:
      0
  });


assertEqual(
  article14Base.finalFeeToman,
  2_000_000,
  "Article 14 base fee"
);


const article14Combined =
  calculateArticle14({

    pastImageYearCount:
      2,

    hasAdditionalConnectedParcels:
      true,

    additionalConnectedParcelCount:
      2
  });


/*
 * 2,000,000 base
 * + 2 * 200,000 past-image years
 * + 2 * (40% * 2,000,000) connected parcels
 * = 4,000,000
 */

assertEqual(
  article14Combined.finalFeeToman,
  4_000_000,
  "Article 14 combined user scenario"
);


/*
 * ============================================================
 * 4) Group 5
 * UI -> ExpertFeeEngine -> VehicleCalculator
 * ============================================================
 */

const vehicleFixed =
  calculateExpertFee({

    group:
      5,

    data: {

      service:
        "LAND_AUTHENTICITY"
    }
  });


assertEqual(
  vehicleFixed.expertFeeToman,
  2_000_000,
  "Group 5 fixed-fee user path"
);


const vehicleEvaluation =
  calculateExpertFee({

    group:
      5,

    data: {

      service:
        "LAND_VALUATION",

      evaluationValueToman
    }
  });


assertEqual(
  vehicleEvaluation.expertFeeToman,
  Math.min(article11Reference.finalExpertFeeToman, 7_000_000),
  "Group 5 Article 31 per-vehicle maximum"
);


/*
 * ============================================================
 * 5) Group 6
 * UI -> ExpertFeeEngine -> RoadBuildingEngine
 * ============================================================
 */

const roadArticle33 =
  calculateExpertFee({

    group:
      6,

    data: {

      article:
        33,

      data: {

        evaluationValueToman
      }
    }
  });


assert(
  "expertFeeToman" in roadArticle33,
  "Group 6 Article 33 must return expert fee"
);


if (
  "expertFeeToman" in roadArticle33
) {

  assertEqual(
    roadArticle33.expertFeeToman,
    article11Reference.finalExpertFeeToman,
    "Group 6 Article 33 -> Article 11"
  );
}


const roadArticle34Minimum =
  calculateExpertFee({

    group:
      6,

    data: {

      article:
        34,

      data: {

        areaSquareMeters:
          100
      }
    }
  });


assert(
  "expertFeeToman" in roadArticle34Minimum,
  "Group 6 Article 34 must return expert fee"
);


if (
  "expertFeeToman" in roadArticle34Minimum
) {

  assertEqual(
    roadArticle34Minimum.expertFeeToman,
    2_000_000,
    "Group 6 Article 34 minimum"
  );
}


const roadArticle34Normal =
  calculateExpertFee({

    group:
      6,

    data: {

      article:
        34,

      data: {

        areaSquareMeters:
          1_000
      }
    }
  });


if (
  "expertFeeToman" in roadArticle34Normal
) {

  assertEqual(
    roadArticle34Normal.expertFeeToman,
    3_000_000,
    "Group 6 Article 34 normal"
  );

} else {

  throw new Error(
    "FINAL ACCEPTANCE TEST FAILED: Article 34 normal result missing expertFeeToman"
  );
}


const roadArticle34Maximum =
  calculateExpertFee({

    group:
      6,

    data: {

      article:
        34,

      data: {

        areaSquareMeters:
          10_000
      }
    }
  });


if (
  "expertFeeToman" in roadArticle34Maximum
) {

  assertEqual(
    roadArticle34Maximum.expertFeeToman,
    10_000_000,
    "Group 6 Article 34 maximum"
  );

} else {

  throw new Error(
    "FINAL ACCEPTANCE TEST FAILED: Article 34 maximum result missing expertFeeToman"
  );
}


/*
 * Article 42 is intentionally not an automatic fee calculation.
 */

const roadArticle42 =
  calculateExpertFee({

    group:
      6,

    data: {

      article:
        42
    }
  });


assert(
  "automaticCalculationSupported" in roadArticle42,
  "Group 6 Article 42 status must expose automaticCalculationSupported"
);

if ("automaticCalculationSupported" in roadArticle42) {

  assertEqual(
    roadArticle42.automaticCalculationSupported,
    false,
    "Group 6 Article 42 must remain intentionally non-automatic"
  );

} else {

  throw new Error(
    "FINAL ACCEPTANCE TEST FAILED: Article 42 status result was not preserved"
  );
}


/*
 * ============================================================
 * 6) Group 7
 * Three Article 45 User Paths
 * ============================================================
 */

const industryEvaluation =
  calculateExpertFee({

    group:
      7,

    data: {

      article:
        45,

      data: {

        discipline:
          "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

        serviceType:
          "EVALUATION",

        evaluationValueToman
      }
    }
  });


assertEqual(
  industryEvaluation.article11FeeToman,
  article11Reference.finalExpertFeeToman,
  "Group 7 normal evaluation Article 11 base"
);


assertEqual(
  industryEvaluation.additionalPercent,
  0,
  "Group 7 normal evaluation no increase"
);


const industryMachinery =
  calculateExpertFee({

    group:
      7,

    data: {

      article:
        45,

      data: {

        discipline:
          "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

        serviceType:
          "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

        evaluationValueToman
      }
    }
  });


assertEqual(
  industryMachinery.additionalPercent,
  40,
  "Group 7 machinery technical assessment +40%"
);


assert(
  industryMachinery.expertFeeToman >
    industryMachinery.article11FeeToman,
  "Group 7 +40% must be added to Article 11, not replace it"
);


const industrySoftware =
  calculateExpertFee({

    group:
      7,

    data: {

      article:
        45,

      data: {

        discipline:
          "COMPUTER_INFORMATION_TECHNOLOGY",

        serviceType:
          "SOFTWARE_EXPERTISE",

        evaluationValueToman
      }
    }
  });


assertEqual(
  industrySoftware.additionalPercent,
  50,
  "Group 7 software expertise +50%"
);


mustThrow(
  () => {

    calculateExpertFee({

      group:
        7,

      data: {

        article:
          45,

        data: {

          discipline:
            "OIL_INDUSTRIES",

          serviceType:
            "SOFTWARE_EXPERTISE",

          evaluationValueToman
        }
      }
    });
  },
  "Software expertise must remain restricted to Computer/IT"
);


/*
 * ============================================================
 * 7) Group 9
 * Articles 48, 49, 51, 52, 53
 * ============================================================
 */

const agriculture48 =
  calculateExpertFee({

    group:
      9,

    data: {

      article:
        48,

      data: {

        article:
          48,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        evaluationValueToman
      }
    }
  });


assertEqual(
  agriculture48.expertFeeToman,
  article11Reference.finalExpertFeeToman,
  "Group 9 Article 48 -> Article 11"
);


const agriculture49 =
  calculateExpertFee({

    group:
      9,

    data: {

      article:
        49,

      data: {

        article:
          49,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        evaluationValueToman
      }
    }
  });


assertEqual(
  agriculture49.expertFeeToman,
  article11Reference.finalExpertFeeToman,
  "Group 9 Article 49 -> Article 11"
);


/*
 * Critical Article 51 boundaries
 */

const agriculture51At1000 =
  calculateExpertFee({

    group:
      9,

    data: {

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
    }
  });


assertEqual(
  agriculture51At1000.expertFeeToman,
  800_000,
  "Article 51 at 1000 sqm"
);


const agriculture51At1001 =
  calculateExpertFee({

    group:
      9,

    data: {

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
    }
  });


assert(
  "blocksAboveFirst1000" in agriculture51At1001,
  "Article 51 result must expose blocksAboveFirst1000"
);

if ("blocksAboveFirst1000" in agriculture51At1001) {

  assertEqual(
    agriculture51At1001.blocksAboveFirst1000,
    1,
    "Article 51 at 1001 sqm starts one complete additional block"
  );

} else {

  throw new Error(
    "FINAL ACCEPTANCE TEST FAILED: Article 51 specialized result was not preserved"
  );
}


const agriculture51At10001 =
  calculateExpertFee({

    group:
      9,

    data: {

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
    }
  });


assertEqual(
  agriculture51At10001.expertFeeToman,
  1_560_000,
  "Article 51 at 10001 sqm"
);


assert(
  "blocksAboveOneHectare" in agriculture51At10001,
  "Article 51 result must expose blocksAboveOneHectare"
);

if ("blocksAboveOneHectare" in agriculture51At10001) {

  assertEqual(
    agriculture51At10001.blocksAboveOneHectare,
    1,
    "Article 51 above one hectare block"
  );

} else {

  throw new Error(
    "FINAL ACCEPTANCE TEST FAILED: Article 51 one-hectare result was not preserved"
  );
}


const agriculture52 =
  calculateExpertFee({

    group:
      9,

    data: {

      article:
        52,

      data: {

        article:
          52,

        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",

        evaluationValueToman
      }
    }
  });


assert(
  "additionalPercent" in agriculture52,
  "Article 52 result must expose additionalPercent"
);

assert(
  "article11FeeToman" in agriculture52,
  "Article 52 result must expose article11FeeToman"
);

if (
  "additionalPercent" in agriculture52 &&
  "article11FeeToman" in agriculture52
) {

  assertEqual(
    agriculture52.additionalPercent,
    20,
    "Group 9 Article 52 +20%"
  );

  assert(
    agriculture52.expertFeeToman >=
      agriculture52.article11FeeToman,
    "Article 52 must not be lower than Article 11 base"
  );

} else {

  throw new Error(
    "FINAL ACCEPTANCE TEST FAILED: Article 52 specialized result was not preserved"
  );
}


const agriculture53 =
  calculateExpertFee({

    group:
      9,

    data: {

      article:
        53,

      data: {

        article:
          53,

        discipline:
          "AQUATICS_FISHERIES",

        evaluationValueToman
      }
    }
  });


assertEqual(
  agriculture53.expertFeeToman,
  article11Reference.finalExpertFeeToman,
  "Group 9 Article 53 -> Article 11"
);


/*
 * ============================================================
 * 8) Mission
 * Mission must be added after expert fee
 * ============================================================
 */

const missionScenario =
  calculateExpertFee({

    group:
      7,

    data: {

      article:
        45,

      data: {

        discipline:
          "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

        serviceType:
          "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

        evaluationValueToman,

        missionType:
          "IN_PROVINCE",

        missionDays:
          2
      }
    }
  });


assert(
  missionScenario.missionFeeToman > 0,
  "Mission fee must be positive"
);


assertEqual(
  missionScenario.totalPayableToman,
  missionScenario.expertFeeToman +
    missionScenario.missionFeeToman,
  "Mission must be added after expert fee"
);


/*
 * ============================================================
 * 9) Validation Propagation
 * ============================================================
 */

mustThrow(
  () => {

    calculateExpertFee({

      group:
        5,

      data: {

        service:
          "LAND_VALUATION",

        evaluationValueToman:
          0
      }
    });
  },
  "Group 5 invalid input must be rejected"
);


mustThrow(
  () => {

    calculateExpertFee({

      group:
        9,

      data: {

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
      }
    });
  },
  "Group 9 invalid area must be rejected"
);


/*
 * ============================================================
 * 10) Central Gateway Metadata
 * ============================================================
 */

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.supportedGroups.join(","),
  "5,6,7,9",
  "Central Gateway supported groups"
);


assertEqual(
  EXPERT_FEE_ENGINE_METADATA.containsTariffFormulas,
  false,
  "Central Gateway must contain no tariff formulas"
);


/*
 * ============================================================
 * 11) UI Architectural Wiring Contract
 * ============================================================
 *
 * This section prevents future regression where a UI page
 * bypasses ExpertFeeEngine and calls a specialized engine
 * directly.
 * ============================================================
 */

const appSource =
  readProjectFile(
    "src/App.tsx"
  );


const vehiclePageSource =
  readProjectFile(
    "src/pages/VehiclePage.tsx"
  );


const roadPageSource =
  readProjectFile(
    "src/pages/RoadBuildingPage.tsx"
  );


const industryPageSource =
  readProjectFile(
    "src/pages/IndustryTechnologyPage.tsx"
  );


const agriculturePageSource =
  readProjectFile(
    "src/pages/AgricultureNaturalResourcesPage.tsx"
  );


/*
 * App routing
 */

for (
  const route of [
    "VEHICLES",
    "ROAD_BUILDING",
    "INDUSTRY_TECHNOLOGY",
    "AGRICULTURE_NATURAL_RESOURCES"
  ]
) {

  assertContains(
    appSource,
    route,
    `App.tsx must expose route ${route}`
  );
}


/*
 * Every specialized UI page must use Central Gateway.
 */

for (
  const [
    pageName,
    source
  ] of [
    [
      "VehiclePage",
      vehiclePageSource
    ],
    [
      "RoadBuildingPage",
      roadPageSource
    ],
    [
      "IndustryTechnologyPage",
      industryPageSource
    ],
    [
      "AgricultureNaturalResourcesPage",
      agriculturePageSource
    ]
  ] as const
) {

  assertContains(
    source,
    "calculateExpertFee",
    `${pageName} must call ExpertFeeEngine`
  );

  assertContains(
    source,
    "ExpertFeeEngine",
    `${pageName} must import Central Gateway`
  );
}


/*
 * Specialized UI pages must not bypass the Gateway.
 */

/*
 * Type-only imports from specialized modules are allowed.
 *
 * The architectural rule is about runtime calculation:
 * UI pages must not CALL specialized calculators/engines directly.
 *
 * This keeps type reuse legal while guaranteeing that all runtime
 * calculations pass through ExpertFeeEngine.
 */

assertNotContains(
  vehiclePageSource,
  "calculateVehicleFee(",
  "VehiclePage must not directly call calculateVehicleFee"
);


assertNotContains(
  roadPageSource,
  "calculateRoadBuildingFee(",
  "RoadBuildingPage must not directly call calculateRoadBuildingFee"
);


assertNotContains(
  industryPageSource,
  "calculateIndustryTechnologyFee(",
  "IndustryTechnologyPage must not directly call calculateIndustryTechnologyFee"
);


assertNotContains(
  agriculturePageSource,
  "calculateAgricultureNaturalResourcesFee(",
  "AgricultureNaturalResourcesPage must not directly call calculateAgricultureNaturalResourcesFee"
);


/*
 * ============================================================
 * FINAL
 * ============================================================
 */

console.log(
  "\n============================================================"
);


console.log(
  "EXPERTFEE FINAL END-TO-END ACCEPTANCE: ALL TESTS PASSED"
);


console.log(
  "------------------------------------------------------------"
);


console.log(
  "Common Core / Article 11                              PASS"
);


console.log(
  "Article 13                                            PASS"
);


console.log(
  "Article 14                                            PASS"
);


console.log(
  "Group 5 -> Central Gateway                            PASS"
);


console.log(
  "Group 6 -> Central Gateway                            PASS"
);


console.log(
  "Group 7 -> Central Gateway                            PASS"
);


console.log(
  "Group 9 -> Central Gateway                            PASS"
);


console.log(
  "Mission / Validation                                  PASS"
);


console.log(
  "UI -> ExpertFeeEngine wiring                          PASS"
);


console.log(
  "No specialized UI bypass                              PASS"
);


console.log(
  "============================================================"
);
