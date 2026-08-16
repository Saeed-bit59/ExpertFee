import {
  calculateRoadBuildingFee,
  ROAD_BUILDING_ENGINE_METADATA
} from "../src/engine/RoadBuildingEngine";


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
 * ماده 33
 * ========================================
 */

const a33 =
  calculateRoadBuildingFee({

    article: 33,

    data: {
      evaluationValueToman:
        1_000_000_000
    }
  });


assertEqual(
  a33.article,
  33,
  "Engine routes Article 33"
);


assert(
  "expertFeeToman" in a33,
  "Article 33 must return calculated fee"
);


/*
 * ========================================
 * ماده 34
 * ========================================
 */

const a34 =
  calculateRoadBuildingFee({

    article: 34,

    data: {
      areaSquareMeters:
        1_000
    }
  });


assertEqual(
  a34.article,
  34,
  "Engine routes Article 34"
);


assert(
  "expertFeeToman" in a34,
  "Article 34 must have expert fee"
);


if (
  "expertFeeToman" in a34
) {

  assertEqual(
    a34.expertFeeToman,
    2_000_000,
    "Article 34 calculation through Engine"
  );
}


/*
 * ========================================
 * ماده 35
 * ========================================
 */

const a35 =
  calculateRoadBuildingFee({

    article: 35,

    data: {
      areaSquareMeters:
        1_500
    }
  });


assertEqual(
  a35.article,
  35,
  "Engine routes Article 35"
);


/*
 * ========================================
 * ماده 36
 * ========================================
 */

const a36 =
  calculateRoadBuildingFee({

    article: 36,

    data: {
      serviceType:
        "STRUCTURE",

      areaSquareMeters:
        1_000
    }
  });


assertEqual(
  a36.article,
  36,
  "Engine routes Article 36"
);


if (
  "expertFeeToman" in a36
) {

  assertEqual(
    a36.expertFeeToman,
    2_000_000,
    "Article 36 structure through Engine"
  );
}


/*
 * ========================================
 * ماده 37
 * ========================================
 */

const a37 =
  calculateRoadBuildingFee({

    article: 37,

    data: {
      evaluationValueToman:
        1_000_000_000,

      similarAdditionalUnits:
        1
    }
  });


assertEqual(
  a37.article,
  37,
  "Engine routes Article 37"
);


/*
 * ========================================
 * ماده 38
 * ========================================
 */

const a38 =
  calculateRoadBuildingFee({

    article: 38,

    data: {
      areaSquareMeters:
        1_500
    }
  });


if (
  "expertFeeToman" in a38
) {

  assertEqual(
    a38.expertFeeToman,
    800_000,
    "Article 38 through Engine"
  );
}


/*
 * ========================================
 * ماده 39
 * ========================================
 */

const a39 =
  calculateRoadBuildingFee({

    article: 39,

    data: {
      areaSquareMeters:
        1_000,

      boundaryMode:
        "KNOWN_BOUNDARY"
    }
  });


assertEqual(
  a39.article,
  39,
  "Engine routes Article 39"
);


if (
  "expertFeeToman" in a39
) {

  assertEqual(
    a39.expertFeeToman,
    800_000,
    "Article 39 through Engine"
  );
}


/*
 * ========================================
 * ماده 40
 * ========================================
 */

const a40 =
  calculateRoadBuildingFee({

    article: 40,

    data: {
      areaSquareMeters:
        1_000
    }
  });


if (
  "expertFeeToman" in a40
) {

  assertEqual(
    a40.expertFeeToman,
    2_000_000,
    "Article 40 through Engine"
  );
}


/*
 * ========================================
 * ماده 41
 * ========================================
 */

const a41 =
  calculateRoadBuildingFee({

    article: 41,

    data: {
      areaSquareMeters:
        2_000,

      outsideBoundaryIncreasePercent:
        20
    }
  });


if (
  "expertFeeToman" in a41
) {

  assertEqual(
    a41.expertFeeToman,
    1_080_000,
    "Article 41 through Engine"
  );
}


/*
 * ========================================
 * ماده 42
 * ========================================
 */

const a42 =
  calculateRoadBuildingFee({
    article: 42
  });


assertEqual(
  a42.article,
  42,
  "Engine routes Article 42"
);


assert(
  "automaticCalculationSupported" in a42,
  "Article 42 must return status"
);


if (
  "automaticCalculationSupported" in a42
) {

  assertEqual(
    a42.automaticCalculationSupported,
    false,
    "Article 42 auto calculation disabled"
  );
}


/*
 * ========================================
 * ماده 43
 * ========================================
 */

const a43 =
  calculateRoadBuildingFee({

    article: 43,

    data: {
      areaSquareMeters:
        10_001
    }
  });


if (
  "expertFeeToman" in a43
) {

  assertEqual(
    a43.expertFeeToman,
    960_000,
    "Article 43 through Engine"
  );
}


/*
 * ========================================
 * ماده 44
 * ========================================
 */

const a44 =
  calculateRoadBuildingFee({

    article: 44,

    data: {
      serviceType:
        "SUBDIVISION_PLAN",

      itemCount:
        11
    }
  });


assertEqual(
  a44.article,
  44,
  "Engine routes Article 44"
);


if (
  "expertFeeToman" in a44
) {

  assertEqual(
    a44.expertFeeToman,
    6_320_000,
    "Article 44 through Engine"
  );
}


/*
 * ========================================
 * مأموریت از مسیر Engine
 * ========================================
 */

const mission =
  calculateRoadBuildingFee({

    article: 34,

    data: {
      areaSquareMeters:
        1_000,

      missionType:
        "IN_PROVINCE",

      missionDays:
        2
    }
  });


assert(
  "missionFeeToman" in mission,
  "Engine result must contain mission fee"
);


if (
  "expertFeeToman" in mission &&
  "missionFeeToman" in mission &&
  "totalPayableToman" in mission
) {

  assertEqual(
    mission.totalPayableToman,
    mission.expertFeeToman +
      mission.missionFeeToman,
    "Mission must be added after expert fee"
  );
}


/*
 * ========================================
 * Metadata
 * ========================================
 */

assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.group,
  6,
  "Metadata group"
);


assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.firstArticle,
  33,
  "Metadata first article"
);


assertEqual(
  ROAD_BUILDING_ENGINE_METADATA.lastArticle,
  44,
  "Metadata last article"
);


assertEqual(
  ROAD_BUILDING_ENGINE_METADATA
    .articles.length,
  12,
  "Metadata must contain Articles 33-44"
);


const article42Metadata =
  ROAD_BUILDING_ENGINE_METADATA
    .articles
    .find(
      item =>
        item.article === 42
    );


assert(
  article42Metadata !==
    undefined,
  "Metadata must contain Article 42"
);


if (
  article42Metadata
) {

  assertEqual(
    article42Metadata
      .automaticCalculationSupported,
    false,
    "Metadata Article 42 disabled"
  );
}


/*
 * تمام مواد به ترتیب 33 تا 44
 */

const articleNumbers =
  ROAD_BUILDING_ENGINE_METADATA
    .articles
    .map(
      item =>
        item.article
    );


assertEqual(
  articleNumbers.join(","),
  "33,34,35,36,37,38,39,40,41,42,43,44",
  "Metadata article sequence"
);


console.log(
  "\n========================================"
);

console.log(
  "Road Building Engine: ALL TESTS PASSED"
);

console.log(
  "========================================"
);
