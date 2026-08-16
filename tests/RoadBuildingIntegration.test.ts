import {
  calculateRoadBuildingFee,
  ROAD_BUILDING_ENGINE_METADATA
} from "../src/engine/RoadBuildingEngine";

import {
  calculateCommonFee
} from "../src/engine/CommonFeeEngine";

import {
  getMissionDailyRate
} from "../src/engine/MissionCalculator";


/*
 * ========================================
 * ExpertFee
 * Group 6 - Final Integration Test
 * Articles 33 to 44
 * ========================================
 *
 * هدف:
 * تست زنجیره نهایی:
 *
 * RoadBuildingEngine
 *   -> Calculators
 *   -> Rules
 *   -> CommonFeeEngine
 *   -> Article11Engine
 *   -> MissionCalculator
 */


/*
 * ========================================
 * ابزار تست
 * ========================================
 */

function assert(
  condition: boolean,
  message: string
): void {

  if (!condition) {
    throw new Error(
      `INTEGRATION TEST FAILED: ${message}`
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
        `INTEGRATION TEST FAILED: ${message}`,
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

  let thrown = false;

  try {
    fn();
  } catch {
    thrown = true;
  }

  assert(
    thrown,
    message
  );
}


function getExpertFee(
  result: ReturnType<
    typeof calculateRoadBuildingFee
  >
): number {

  assert(
    "expertFeeToman" in result,
    `Article ${result.article} must contain expertFeeToman`
  );

  if (!("expertFeeToman" in result)) {
    throw new Error(
      "Unreachable: expertFeeToman missing."
    );
  }

  return result.expertFeeToman;
}


/*
 * ========================================
 * 1) Metadata / Routing Coverage
 * ========================================
 */

assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.group,
  6,
  "Group number"
);

assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.firstArticle,
  33,
  "First article"
);

assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.lastArticle,
  44,
  "Last article"
);

assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.articles.length,
  12,
  "Articles 33-44 must all exist"
);

assertEqual(
  ROAD_BUILDING_ENGINE_METADATA
    .articles
    .map(item => item.article)
    .join(","),
  "33,34,35,36,37,38,39,40,41,42,43,44",
  "Article sequence"
);


/*
 * ========================================
 * 2) Article 33 -> Article 11 integration
 * ========================================
 */

const evaluationValue =
  1_000_000_000;

const expectedArticle33 =
  calculateCommonFee({
    baseMode: "ARTICLE_11",
    evaluationValueToman:
      evaluationValue
  });

const article33 =
  calculateRoadBuildingFee({
    article: 33,
    data: {
      evaluationValueToman:
        evaluationValue
    }
  });

assertEqual(
  getExpertFee(article33),
  expectedArticle33.finalExpertFeeToman,
  "Article 33 must match CommonFeeEngine Article 11"
);


/*
 * ========================================
 * 3) Article 34 - Min / Normal / Max
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 34,
      data: {
        areaSquareMeters: 100
      }
    })
  ),
  800_000,
  "Article 34 minimum"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 34,
      data: {
        areaSquareMeters: 1_000
      }
    })
  ),
  2_000_000,
  "Article 34 normal"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 34,
      data: {
        areaSquareMeters: 10_000
      }
    })
  ),
  8_000_000,
  "Article 34 maximum"
);


/*
 * ========================================
 * 4) Article 35 - Min / Normal / Max
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 35,
      data: {
        areaSquareMeters: 100
      }
    })
  ),
  800_000,
  "Article 35 minimum"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 35,
      data: {
        areaSquareMeters: 1_500
      }
    })
  ),
  3_000_000,
  "Article 35 normal"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 35,
      data: {
        areaSquareMeters: 10_000
      }
    })
  ),
  8_000_000,
  "Article 35 maximum"
);


/*
 * ========================================
 * 5) Article 36 - all three branches
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 36,
      data: {
        serviceType: "ARCHITECTURE",
        areaSquareMeters: 1_000
      }
    })
  ),
  1_600_000,
  "Article 36 architecture"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 36,
      data: {
        serviceType: "STRUCTURE",
        areaSquareMeters: 1_000
      }
    })
  ),
  2_000_000,
  "Article 36 structure"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 36,
      data: {
        serviceType:
          "STRUCTURAL_SAFETY_REPORT",
        areaSquareMeters: 1_000
      }
    })
  ),
  1_600_000,
  "Article 36 structural safety"
);


/*
 * ========================================
 * 6) Article 37 - Article 11 + 20%
 *    + similar units + final cap
 * ========================================
 */

const expectedArticle37 =
  calculateCommonFee({
    baseMode: "ARTICLE_11",
    evaluationValueToman:
      evaluationValue,
    increasePercent: 20
  });

const article37 =
  calculateRoadBuildingFee({
    article: 37,
    data: {
      evaluationValueToman:
        evaluationValue
    }
  });

assertEqual(
  getExpertFee(article37),
  expectedArticle37.finalExpertFeeToman,
  "Article 37 Article 11 + 20%"
);

const article37Similar =
  calculateRoadBuildingFee({
    article: 37,
    data: {
      evaluationValueToman:
        evaluationValue,
      similarAdditionalUnits: 1
    }
  });

const expectedSimilar =
  Math.min(
    118_000_000,
    expectedArticle37.finalExpertFeeToman +
      Math.round(
        expectedArticle37.finalExpertFeeToman *
        0.10
      )
  );

assertEqual(
  getExpertFee(article37Similar),
  expectedSimilar,
  "Article 37 similar unit"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 37,
      data: {
        evaluationValueToman:
          1_000_000_000_000_000,
        similarAdditionalUnits: 10
      }
    })
  ),
  118_000_000,
  "Article 37 final 118M cap"
);


/*
 * ========================================
 * 7) Article 38 - approved block rule
 * ========================================
 */

const article38Cases:
  Array<[number, number]> = [
    [1_000, 600_000],
    [1_001, 800_000],
    [1_500, 800_000],
    [2_000, 800_000],
    [2_001, 1_000_000]
  ];

for (
  const [area, expected]
  of article38Cases
) {
  assertEqual(
    getExpertFee(
      calculateRoadBuildingFee({
        article: 38,
        data: {
          areaSquareMeters: area
        }
      })
    ),
    expected,
    `Article 38 block rule at ${area}`
  );
}


/*
 * ========================================
 * 8) Article 39 - known / unknown
 *    + geographic points
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 39,
      data: {
        areaSquareMeters: 1_000,
        boundaryMode:
          "KNOWN_BOUNDARY"
      }
    })
  ),
  800_000,
  "Article 39 known boundary base"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 39,
      data: {
        areaSquareMeters: 1_000,
        boundaryMode:
          "UNKNOWN_BOUNDARY"
      }
    })
  ),
  2_000_000,
  "Article 39 unknown boundary base"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 39,
      data: {
        areaSquareMeters: 1_000,
        boundaryMode:
          "KNOWN_BOUNDARY",
        geographicPointCount: 3
      }
    })
  ),
  1_100_000,
  "Article 39 geographic points"
);


/*
 * ========================================
 * 9) Article 40 -> Article 39 clause 2
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 40,
      data: {
        areaSquareMeters: 1_000
      }
    })
  ),
  2_000_000,
  "Article 40 base"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 40,
      data: {
        areaSquareMeters: 1_000_000
      }
    })
  ),
  20_000_000,
  "Article 40 maximum"
);


/*
 * ========================================
 * 10) Article 41 - progressive bands
 *     + outside boundary + cap
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 41,
      data: {
        areaSquareMeters: 2_000
      }
    })
  ),
  900_000,
  "Article 41 first band"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 41,
      data: {
        areaSquareMeters: 50_000
      }
    })
  ),
  9_000_000,
  "Article 41 second threshold"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 41,
      data: {
        areaSquareMeters: 2_000,
        outsideBoundaryIncreasePercent: 20
      }
    })
  ),
  1_080_000,
  "Article 41 outside boundary +20%"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 41,
      data: {
        areaSquareMeters: 1_000_000,
        outsideBoundaryIncreasePercent: 20
      }
    })
  ),
  12_000_000,
  "Article 41 cap after increase"
);


/*
 * ========================================
 * 11) Article 42 - intentionally disabled
 * ========================================
 */

const article42 =
  calculateRoadBuildingFee({
    article: 42
  });

assertEqual(
  article42.article,
  42,
  "Article 42 routing"
);

assert(
  "automaticCalculationSupported"
    in article42,
  "Article 42 must return status"
);

if (
  "automaticCalculationSupported"
    in article42
) {
  assertEqual(
    article42
      .automaticCalculationSupported,
    false,
    "Article 42 automatic calculation disabled"
  );

  assertEqual(
    article42.minimumFeeToman,
    1_000_000,
    "Article 42 minimum"
  );

  assertEqual(
    article42.maximumDeterminedByArticle9,
    true,
    "Article 42 Article 9 dependency"
  );
}


/*
 * ========================================
 * 12) Article 43 - hectare blocks
 *     + cap + aerial map
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 43,
      data: {
        areaSquareMeters: 10_000
      }
    })
  ),
  800_000,
  "Article 43 one hectare"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 43,
      data: {
        areaSquareMeters: 10_001
      }
    })
  ),
  960_000,
  "Article 43 partial additional hectare"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 43,
      data: {
        areaSquareMeters: 1_000_000
      }
    })
  ),
  4_000_000,
  "Article 43 main cap"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 43,
      data: {
        areaSquareMeters: 1_000_000,
        aerialMapPlacement: true
      }
    })
  ),
  5_000_000,
  "Article 43 aerial map after main cap"
);


/*
 * ========================================
 * 13) Article 44 - all three branches
 * ========================================
 */

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 44,
      data: {
        serviceType:
          "SUBDIVISION_PLAN",
        itemCount: 11
      }
    })
  ),
  6_320_000,
  "Article 44 subdivision"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 44,
      data: {
        serviceType:
          "LAND_USE_COMPLIANCE",
        itemCount: 11
      }
    })
  ),
  4_520_000,
  "Article 44 land use"
);

assertEqual(
  getExpertFee(
    calculateRoadBuildingFee({
      article: 44,
      data: {
        serviceType:
          "BUILDING_URBAN_COMPLIANCE",
        itemCount: 11
      }
    })
  ),
  4_520_000,
  "Article 44 building compliance"
);


/*
 * ========================================
 * 14) Mission integration
 * ========================================
 *
 * مأموریت باید بعد از دستمزد اضافه شود
 * و دستمزد اصلی را تغییر ندهد.
 */

const missionRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );

const missionResult =
  calculateRoadBuildingFee({
    article: 34,
    data: {
      areaSquareMeters: 1_000,
      missionType: "IN_PROVINCE",
      missionDays: 2
    }
  });

assert(
  "expertFeeToman" in missionResult &&
  "missionFeeToman" in missionResult &&
  "totalPayableToman" in missionResult,
  "Mission result fields"
);

if (
  "expertFeeToman" in missionResult &&
  "missionFeeToman" in missionResult &&
  "totalPayableToman" in missionResult
) {
  assertEqual(
    missionResult.expertFeeToman,
    2_000_000,
    "Mission must not alter expert fee"
  );

  assertEqual(
    missionResult.missionFeeToman,
    missionRate * 2,
    "Mission fee integration"
  );

  assertEqual(
    missionResult.totalPayableToman,
    2_000_000 +
      missionRate * 2,
    "Mission final payable"
  );
}


/*
 * ========================================
 * 15) Invalid input propagation
 * ========================================
 */

mustThrow(
  () => {
    calculateRoadBuildingFee({
      article: 34,
      data: {
        areaSquareMeters: 0
      }
    });
  },
  "Article 34 zero area"
);

mustThrow(
  () => {
    calculateRoadBuildingFee({
      article: 37,
      data: {
        evaluationValueToman:
          evaluationValue,
        similarAdditionalUnits: 1.5
      }
    });
  },
  "Article 37 fractional similar units"
);

mustThrow(
  () => {
    calculateRoadBuildingFee({
      article: 39,
      data: {
        areaSquareMeters: 1_000,
        boundaryMode:
          "KNOWN_BOUNDARY",
        geographicPointCount: -1
      }
    });
  },
  "Article 39 negative point count"
);

mustThrow(
  () => {
    calculateRoadBuildingFee({
      article: 41,
      data: {
        areaSquareMeters: 2_000,
        outsideBoundaryIncreasePercent:
          21
      }
    });
  },
  "Article 41 increase above 20%"
);

mustThrow(
  () => {
    calculateRoadBuildingFee({
      article: 44,
      data: {
        serviceType:
          "SUBDIVISION_PLAN",
        itemCount: 0
      }
    });
  },
  "Article 44 zero item count"
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
  "GROUP 6 FINAL INTEGRATION: ALL TESTS PASSED"
);

console.log(
  "Articles 33-44 / Rules / Calculators / Engine / Mission"
);

console.log(
  "========================================"
);
