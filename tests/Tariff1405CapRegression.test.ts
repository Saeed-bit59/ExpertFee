import { strict as assert } from "node:assert";
import { TARIFF_1405 } from "../src/config/Tariff1405";
import { ARTICLE11_MAXIMUM_FEE_TOMAN } from "../src/engine/Article11IncreaseRules";
import {
  ARTICLE15_MAXIMUM_FEE_TOMAN,
  ARTICLE20_UP_TO_12_MAXIMUM_TOMAN,
  ARTICLE20_OVER_12_MAXIMUM_TOMAN,
} from "../src/engine/water/WaterEngineeringCalculator";
import {
  ARTICLE22_METAL_MAXIMUM_FEE_TOMAN,
  ARTICLE22_MINING_MAXIMUM_FEE_TOMAN,
} from "../src/engine/mining/Article22Rules";
import { ARTICLE23_MAXIMUM_FEE_TOMAN } from "../src/engine/movable-property/Article23Rules";
import { FINANCIAL_MAXIMUM_FEE_TOMAN } from "../src/engine/financial/FinancialRules";
import { calculateArticle22Metal } from "../src/engine/mining/Article22Calculator";
import { calculateArticle23 } from "../src/engine/movable-property/Article23Calculator";
import { calculateFinancialAffairs } from "../src/engine/financial/FinancialCalculator";
import { applyArticle11IncreaseRule } from "../src/engine/Article11IncreaseRules";
import { calculateArticle14 } from "../src/engine/Article14Calculator";
import { calculateArticle38 } from "../src/engine/RoadBuildingCalculator";
import { calculateArticle44 } from "../src/engine/UrbanPlanningCalculator";

const generalMaximumToman = TARIFF_1405.article11.generalMaximumRial / 10;
assert.equal(generalMaximumToman, 135_000_000);
for (const maximum of [
  ARTICLE11_MAXIMUM_FEE_TOMAN,
  ARTICLE22_METAL_MAXIMUM_FEE_TOMAN,
  ARTICLE22_MINING_MAXIMUM_FEE_TOMAN,
  ARTICLE23_MAXIMUM_FEE_TOMAN,
  FINANCIAL_MAXIMUM_FEE_TOMAN,
]) {
  assert.equal(maximum, generalMaximumToman);
}

assert.equal(ARTICLE15_MAXIMUM_FEE_TOMAN, 9_000_000);
assert.equal(ARTICLE20_UP_TO_12_MAXIMUM_TOMAN, 8_000_000);
assert.equal(ARTICLE20_OVER_12_MAXIMUM_TOMAN, 12_000_000);

assert.equal(calculateArticle22Metal({ article11FeeToman: 130_000_000 }).finalFeeToman, 130_000_000);
assert.equal(calculateArticle22Metal({ article11FeeToman: 150_000_000 }).finalFeeToman, 135_000_000);
assert.equal(calculateArticle23({ article11FeeToman: 130_000_000, mode: "MOVABLE_PROPERTY" }).finalFeeToman, 130_000_000);
assert.equal(calculateArticle23({ article11FeeToman: 150_000_000, mode: "MOVABLE_PROPERTY" }).finalFeeToman, 135_000_000);
assert.equal(calculateFinancialAffairs({ field: "COMMERCIAL_AFFAIRS", article11FeeToman: 130_000_000 }).finalFeeToman, 130_000_000);
assert.equal(calculateFinancialAffairs({ field: "COMMERCIAL_AFFAIRS", article11FeeToman: 150_000_000 }).finalFeeToman, 135_000_000);
assert.equal(applyArticle11IncreaseRule({ baseFeeToman: 100_000_000, ruleCode: "NOTE3_CONTRACT_FULL" }).finalFeeToman, 135_000_000);
assert.equal(calculateArticle14({ pastImageYearCount: 1_000, hasAdditionalConnectedParcels: false, additionalConnectedParcelCount: 0 }).finalFeeToman, 135_000_000);
assert.equal(calculateArticle38({ areaSquareMeters: 1_000_000 }).expertFeeToman, 135_000_000);
assert.equal(calculateArticle44({ serviceType: "SUBDIVISION_PLAN", itemCount: 1_000 }).expertFeeToman, 135_000_000);
console.log("Tariff 1405 cap regression: passed");
