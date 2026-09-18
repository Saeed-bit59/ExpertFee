import { TARIFF_1405 } from "../src/config/Tariff1405";
import { calculateVehicleFee } from "../src/engine/VehicleCalculator";

function assertEqual(actual: number | boolean, expected: number | boolean, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected=${expected} actual=${actual}`);
  }
}

assertEqual(TARIFF_1405.article31.nonDamageServiceFeeToman, 2_000_000, "Article 31 fixed service");
assertEqual(TARIFF_1405.article31.combinedNonDamageMaximumToman, 3_000_000, "Article 31 combined maximum");
assertEqual(TARIFF_1405.article31.perVehicleMaximumToman, 7_000_000, "Article 31 per-vehicle maximum");
assertEqual(TARIFF_1405.article32.seaCollision500GtOrMoreFeeToman, 7_000_000, "Article 32 high-capacity collision");

const landValuation = calculateVehicleFee({ service: "LAND_VALUATION", evaluationValueToman: 10_000_000_000 });
assertEqual(landValuation.expertFeeToman, 7_000_000, "Article 31 valuation maximum");
assertEqual(landValuation.capped, true, "Article 31 valuation cap flag");
assertEqual(calculateVehicleFee({ service: "LAND_NON_DAMAGE_COMBINED", landNonDamageServices: ["AUTHENTICITY", "ACCIDENT"] }).expertFeeToman, 2_000_000, "Article 31 absorbed authenticity");
assertEqual(calculateVehicleFee({ service: "LAND_NON_DAMAGE_COMBINED", landNonDamageServices: ["ACCIDENT", "TONNAGE_MODEL"] }).expertFeeToman, 3_000_000, "Article 31 combined services cap");
assertEqual(calculateVehicleFee({ service: "SEA_COLLISION_UNDER_500_GT" }).expertFeeToman, 3_500_000, "Article 32 low-capacity collision");

console.log("VEHICLE TARIFF 1405 REGRESSION: PASS");
