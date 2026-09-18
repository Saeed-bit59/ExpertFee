import {
  ARTICLE_33,
  ARTICLE_34,
  ARTICLE_35,
  ARTICLE_36,
  ARTICLE_37,
  ARTICLE_38,
  ARTICLE_39,
  ARTICLE_40,
  ARTICLE_41,
  ARTICLE_42,
  ARTICLE_43,
  ARTICLE_44,
  ROAD_BUILDING_RULES
} from "../src/engine/RoadBuildingRules";


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
  actual: number | string | boolean,
  expected: number | string | boolean,
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


/*
 * ========================================
 * ماده 33
 * ========================================
 */

assertEqual(
  ARTICLE_33.article,
  33,
  "Article 33 number"
);

assertEqual(
  ARTICLE_33.calculationMode,
  "ARTICLE_11",
  "Article 33 must use Article 11"
);


/*
 * ========================================
 * ماده 34
 * ========================================
 */

assertEqual(
  ARTICLE_34.ratePerSquareMeterToman,
  3_000,
  "Article 34 rate"
);

assertEqual(
  ARTICLE_34.minimumFeeToman,
  2_000_000,
  "Article 34 minimum"
);

assertEqual(
  ARTICLE_34.maximumFeeToman,
  10_000_000,
  "Article 34 maximum"
);


/*
 * ========================================
 * ماده 35
 * ========================================
 */

assertEqual(
  ARTICLE_35.ratePerSquareMeterToman,
  3_000,
  "Article 35 rate"
);

assertEqual(
  ARTICLE_35.minimumFeeToman,
  2_000_000,
  "Article 35 minimum"
);

assertEqual(
  ARTICLE_35.maximumFeeToman,
  10_000_000,
  "Article 35 maximum"
);


/*
 * ========================================
 * ماده 36
 * ========================================
 */

assertEqual(
  ARTICLE_36.architecture.ratePerSquareMeterToman,
  2_500,
  "Article 36 architecture rate"
);

assertEqual(
  ARTICLE_36.architecture.maximumFeeToman,
  15_000_000,
  "Article 36 architecture maximum"
);

assertEqual(
  ARTICLE_36.structure.ratePerSquareMeterToman,
  3_000,
  "Article 36 structure rate"
);

assertEqual(
  ARTICLE_36.structure.maximumFeeToman,
  20_000_000,
  "Article 36 structure maximum"
);

assertEqual(
  ARTICLE_36.structuralSafetyReport.ratePerSquareMeterToman,
  2_500,
  "Article 36 structural safety rate"
);

assertEqual(
  ARTICLE_36.structuralSafetyReport.maximumFeeToman,
  15_000_000,
  "Article 36 structural safety maximum"
);


/*
 * ========================================
 * ماده 37
 * ========================================
 */

assertEqual(
  ARTICLE_37.increasePercent,
  20,
  "Article 37 increase"
);

assertEqual(
  ARTICLE_37.similarAdditionalUnitPercent,
  20,
  "Article 37 similar unit percentage"
);


/*
 * ========================================
 * ماده 38
 * ========================================
 */

assertEqual(
  ARTICLE_38.baseAreaSquareMeters,
  1_000,
  "Article 38 base area"
);

assertEqual(
  ARTICLE_38.baseFeeToman,
  2_000_000,
  "Article 38 base fee"
);

assertEqual(
  ARTICLE_38.additionalBlockFeeToman,
  300_000,
  "Article 38 additional block fee"
);


/*
 * ========================================
 * ماده 39
 * ========================================
 */

assertEqual(
  ARTICLE_39.secondThresholdSquareMeters,
  100_000,
  "Article 39 ten-hectare threshold"
);

assertEqual(
  ARTICLE_39.knownBoundary.baseFeeToman,
  2_000_000,
  "Article 39 known boundary base fee"
);

assertEqual(
  ARTICLE_39.knownBoundary.maximumFeeToman,
  20_000_000,
  "Article 39 known boundary maximum"
);

assertEqual(
  ARTICLE_39.unknownBoundary.baseFeeToman,
  3_000_000,
  "Article 39 unknown boundary base fee"
);

assertEqual(
  ARTICLE_39.unknownBoundary.maximumFeeToman,
  25_000_000,
  "Article 39 unknown boundary maximum"
);

assertEqual(
  ARTICLE_39.multiFrequencyGpsFeeToman,
  350_000,
  "Article 39 multi-frequency GPS fee"
);

assertEqual(
  ARTICLE_39.singleFrequencyGpsFeeToman,
  200_000,
  "Article 39 single-frequency GPS fee"
);


/*
 * ========================================
 * ماده 40
 * ========================================
 */

assertEqual(
  ARTICLE_40.basedOnArticle,
  39,
  "Article 40 reference"
);

assertEqual(
  ARTICLE_40.basedOnBoundaryMode,
  "UNKNOWN_BOUNDARY",
  "Article 40 must use Article 39 clause 2"
);

assertEqual(
  ARTICLE_40.maximumFeeToman,
  25_000_000,
  "Article 40 maximum"
);


/*
 * ========================================
 * ماده 41
 * ========================================
 */

assertEqual(
  ARTICLE_41.minimumFeeToman,
  2_000_000,
  "Article 41 minimum"
);

assertEqual(
  ARTICLE_41.firstThresholdSquareMeters,
  5_000,
  "Article 41 first threshold"
);

assertEqual(
  ARTICLE_41.secondThresholdSquareMeters,
  50_000,
  "Article 41 second threshold"
);

assertEqual(
  ARTICLE_41.rateFromBaseToFirstThresholdTomanPerSquareMeter,
  400,
  "Article 41 first rate"
);

assertEqual(
  ARTICLE_41.rateFromFirstToSecondThresholdTomanPerSquareMeter,
  200,
  "Article 41 second rate"
);

assertEqual(
  ARTICLE_41.rateAboveSecondThresholdTomanPerSquareMeter,
  100,
  "Article 41 third rate"
);

assertEqual(
  ARTICLE_41.maximumFeeToman,
  15_000_000,
  "Article 41 maximum"
);


/*
 * ========================================
 * ماده 42
 * ========================================
 */

assertEqual(
  ARTICLE_42.minimumFeeToman,
  2_000_000,
  "Article 42 minimum"
);

assertEqual(
  ARTICLE_42.automaticCalculationSupported,
  false,
  "Article 42 automatic calculation must be disabled"
);

assertEqual(
  ARTICLE_42.maximumDeterminedByArticle9,
  true,
  "Article 42 maximum depends on Article 9"
);


/*
 * ========================================
 * ماده 43
 * ========================================
 */

assertEqual(
  ARTICLE_43.baseAreaSquareMeters,
  10_000,
  "Article 43 one-hectare base"
);

assertEqual(
  ARTICLE_43.baseFeeToman,
  2_000_000,
  "Article 43 base fee"
);

assertEqual(
  ARTICLE_43.increasePercentPerAdditionalBlock,
  20,
  "Article 43 additional hectare percentage"
);

assertEqual(
  ARTICLE_43.maximumFeeToman,
  6_000_000,
  "Article 43 maximum"
);

assertEqual(
  ARTICLE_43.aerialMapAdditionalFeeToman,
  2_000_000,
  "Article 43 aerial map supplement"
);


/*
 * ========================================
 * ماده 44 - تفکیک
 * ========================================
 */

assertEqual(
  ARTICLE_44.subdivisionPlan.baseFeeToman,
  4_000_000,
  "Article 44 subdivision base"
);

assertEqual(
  ARTICLE_44.subdivisionPlan.additionalFeeFrom3To10TomanPerItem,
  600_000,
  "Article 44 subdivision 3-10 rate"
);

assertEqual(
  ARTICLE_44.subdivisionPlan.additionalFeeAbove10TomanPerItem,
  180_000,
  "Article 44 subdivision above 10 rate"
);


/*
 * ========================================
 * ماده 44 - کاربری
 * ========================================
 */

assertEqual(
  ARTICLE_44.landUseCompliance.baseFeeToman,
  3_000_000,
  "Article 44 land-use base"
);

assertEqual(
  ARTICLE_44.landUseCompliance.additionalFeeFrom3To10TomanPerItem,
  450_000,
  "Article 44 land-use 3-10 rate"
);

assertEqual(
  ARTICLE_44.landUseCompliance.additionalFeeAbove10TomanPerItem,
  180_000,
  "Article 44 land-use above 10 rate"
);


/*
 * ========================================
 * ماده 44 - انطباق ساختمان
 * ========================================
 */

assertEqual(
  ARTICLE_44.buildingUrbanCompliance.baseFeeToman,
  3_000_000,
  "Article 44 building base"
);

assertEqual(
  ARTICLE_44.buildingUrbanCompliance.additionalFeeFrom3To10TomanPerItem,
  450_000,
  "Article 44 building 3-10 rate"
);

assertEqual(
  ARTICLE_44.buildingUrbanCompliance.additionalFeeAbove10TomanPerItem,
  180_000,
  "Article 44 building above 10 rate"
);


/*
 * ========================================
 * Registry
 * ========================================
 */

assertEqual(
  Object.keys(
    ROAD_BUILDING_RULES
  ).length,
  12,
  "Rules registry must contain Articles 33 through 44"
);

assert(
  ROAD_BUILDING_RULES.article44 ===
    ARTICLE_44,
  "Registry must reference Article 44 rules"
);


console.log(
  "\n========================================"
);

console.log(
  "Road Building Rules: ALL TESTS PASSED"
);

console.log(
  "========================================"
);
