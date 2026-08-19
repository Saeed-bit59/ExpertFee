import {
  calculateExpertFee,
  EXPERT_FEE_ENGINE_METADATA
} from "../src/engine/ExpertFeeEngine";

import { calculateVehicleFee } from "../src/engine/VehicleCalculator";
import { calculateRoadBuildingFee } from "../src/engine/RoadBuildingEngine";
import { calculateIndustryTechnologyFee } from "../src/engine/IndustryTechnologyEngine";
import { calculateAgricultureNaturalResourcesFee } from "../src/engine/AgricultureNaturalResourcesEngine";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `EXPERT FEE ENGINE TEST FAILED: ${message}`
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
        `EXPERT FEE ENGINE TEST FAILED: ${message}`,
        `expected=${expected}`,
        `actual=${actual}`
      ].join(" | ")
    );
  }
}

const evaluationValueToman = 1_000_000_000;

/*
 * Group 5 - fixed fee
 */

const group5Fixed = calculateExpertFee({
  group: 5,
  data: {
    service: "LAND_AUTHENTICITY"
  }
});

const group5FixedDirect = calculateVehicleFee({
  service: "LAND_AUTHENTICITY"
});

assertEqual(
  group5Fixed.expertFeeToman,
  2_000_000,
  "Group 5 fixed fee routing"
);

assertEqual(
  group5Fixed.expertFeeToman,
  group5FixedDirect.expertFeeToman,
  "Group 5 Gateway equals VehicleCalculator"
);

assertEqual(
  group5Fixed.service,
  group5FixedDirect.service,
  "Group 5 service preserved"
);

/*
 * Group 5 - Article 11 route
 */

const group5Article11 = calculateExpertFee({
  group: 5,
  data: {
    service: "LAND_VALUATION",
    evaluationValueToman
  }
});

const group5Article11Direct = calculateVehicleFee({
  service: "LAND_VALUATION",
  evaluationValueToman
});

assertEqual(
  group5Article11.expertFeeToman,
  group5Article11Direct.expertFeeToman,
  "Group 5 Article 11 Gateway equals direct calculator"
);

assertEqual(
  group5Article11.totalPayableToman,
  group5Article11Direct.totalPayableToman,
  "Group 5 total payable preserved"
);

/*
 * Group 6 - Article 33
 */

const group6 = calculateExpertFee({
  group: 6,
  data: {
    article: 33,
    data: {
      evaluationValueToman
    }
  }
});

const group6Direct = calculateRoadBuildingFee({
  article: 33,
  data: {
    evaluationValueToman
  }
});

assert(
  "expertFeeToman" in group6,
  "Group 6 Gateway result contains expertFeeToman"
);

assert(
  "expertFeeToman" in group6Direct,
  "Group 6 direct result contains expertFeeToman"
);

if (
  !("expertFeeToman" in group6) ||
  !("expertFeeToman" in group6Direct)
) {
  throw new Error(
    "Unreachable: Group 6 Article 33 result missing expertFeeToman."
  );
}

assertEqual(
  group6.expertFeeToman,
  group6Direct.expertFeeToman,
  "Group 6 Gateway equals RoadBuildingEngine"
);

/*
 * Group 7 - normal evaluation
 */

const group7 = calculateExpertFee({
  group: 7,
  data: {
    article: 45,
    data: {
      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
      serviceType:
        "EVALUATION",
      evaluationValueToman
    }
  }
});

const group7Direct = calculateIndustryTechnologyFee({
  article: 45,
  data: {
    discipline:
      "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
    serviceType:
      "EVALUATION",
    evaluationValueToman
  }
});

assertEqual(
  group7.expertFeeToman,
  group7Direct.expertFeeToman,
  "Group 7 Gateway equals IndustryTechnologyEngine"
);

assertEqual(
  group7.additionalPercent,
  0,
  "Group 7 normal evaluation unchanged"
);

assertEqual(
  group7.totalPayableToman,
  group7Direct.totalPayableToman,
  "Group 7 total payable preserved"
);

/*
 * Group 7 - +40%
 */

const group7Machinery = calculateExpertFee({
  group: 7,
  data: {
    article: 45,
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
  group7Machinery.additionalPercent,
  40,
  "Group 7 +40 percent path preserved"
);

/*
 * Group 9 - Article 51
 */

const group9Article51 = calculateExpertFee({
  group: 9,
  data: {
    article: 51,
    data: {
      article: 51,
      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",
      areaSquareMeters: 10_001
    }
  }
});

const group9Article51Direct =
  calculateAgricultureNaturalResourcesFee({
    article: 51,
    data: {
      article: 51,
      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",
      areaSquareMeters: 10_001
    }
  });

assertEqual(
  group9Article51.expertFeeToman,
  group9Article51Direct.expertFeeToman,
  "Group 9 Article 51 Gateway equals Agriculture Engine"
);

assertEqual(
  group9Article51.expertFeeToman,
  3_900_000,
  "Group 9 Article 51 boundary preserved"
);

if ("blocksAboveOneHectare" in group9Article51) {
  assertEqual(
    group9Article51.blocksAboveOneHectare,
    1,
    "Group 9 Article 51 specialized field preserved"
  );
} else {
  throw new Error(
    "EXPERT FEE ENGINE TEST FAILED: Article 51 specialized result was lost."
  );
}

/*
 * Group 9 - Article 52
 */

const group9Article52 = calculateExpertFee({
  group: 9,
  data: {
    article: 52,
    data: {
      article: 52,
      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",
      evaluationValueToman
    }
  }
});

const group9Article52Direct =
  calculateAgricultureNaturalResourcesFee({
    article: 52,
    data: {
      article: 52,
      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",
      evaluationValueToman
    }
  });

if ("additionalPercent" in group9Article52) {
  assertEqual(
    group9Article52.additionalPercent,
    20,
    "Group 9 Article 52 +20 percent preserved"
  );
} else {
  throw new Error(
    "EXPERT FEE ENGINE TEST FAILED: Article 52 specialized result was lost."
  );
}

assertEqual(
  group9Article52.expertFeeToman,
  group9Article52Direct.expertFeeToman,
  "Group 9 Article 52 Gateway equals Agriculture Engine"
);

/*
 * Mission pass-through
 */

const group9Mission = calculateExpertFee({
  group: 9,
  data: {
    article: 52,
    data: {
      article: 52,
      discipline:
        "AGRICULTURE_NATURAL_RESOURCES",
      evaluationValueToman,
      missionType:
        "IN_PROVINCE",
      missionDays:
        2
    }
  }
});

assert(
  group9Mission.missionFeeToman > 0,
  "Mission fee remains positive through Gateway"
);

assertEqual(
  group9Mission.totalPayableToman,
  group9Mission.expertFeeToman +
    group9Mission.missionFeeToman,
  "Gateway does not alter mission total"
);

/*
 * Metadata
 */

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.name,
  "ExpertFeeEngine",
  "Central Engine metadata name"
);

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.groupCount,
  4,
  "Central Engine group count"
);

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.supportedGroups.length,
  4,
  "Central Engine supported groups length"
);

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.supportedGroups.join(","),
  "5,6,7,9",
  "Central Engine supported groups"
);

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.routingMode,
  "GROUP_BASED",
  "Central Engine routing mode"
);

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.preservesSpecializedResults,
  true,
  "Central Engine preserves specialized results"
);

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.containsTariffFormulas,
  false,
  "Central Engine contains no tariff formulas"
);

assertEqual(
  EXPERT_FEE_ENGINE_METADATA.searchRegistryEmbedded,
  false,
  "Search Registry remains separate"
);

/*
 * Validation propagation
 */

let invalidGroup5Rejected = false;

try {
  calculateExpertFee({
    group: 5,
    data: {
      service:
        "LAND_VALUATION",
      evaluationValueToman:
        0
    }
  });
} catch {
  invalidGroup5Rejected = true;
}

assertEqual(
  invalidGroup5Rejected,
  true,
  "Group 5 validation propagates through Gateway"
);

let invalidGroup9Rejected = false;

try {
  calculateExpertFee({
    group: 9,
    data: {
      article: 51,
      data: {
        article: 51,
        discipline:
          "AGRICULTURE_NATURAL_RESOURCES",
        areaSquareMeters:
          0
      }
    }
  });
} catch {
  invalidGroup9Rejected = true;
}

assertEqual(
  invalidGroup9Rejected,
  true,
  "Group 9 validation propagates through Gateway"
);

console.log(
  "\n============================================================"
);

console.log(
  "EXPERT FEE CENTRAL ENGINE: ALL TESTS PASSED"
);

console.log(
  "GROUP 5 -> VehicleCalculator                       PASS"
);

console.log(
  "GROUP 6 -> RoadBuildingEngine                      PASS"
);

console.log(
  "GROUP 7 -> IndustryTechnologyEngine                PASS"
);

console.log(
  "GROUP 9 -> AgricultureNaturalResourcesEngine       PASS"
);

console.log(
  "Specialized Results / Mission / Validation          PASS"
);

console.log(
  "============================================================"
);
