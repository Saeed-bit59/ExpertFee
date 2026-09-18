import { calculateVehicleFee } from "../src/engine/VehicleCalculator";

function assertEqual<T extends number | boolean | string>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected=${expected} actual=${actual}`);
  }
}

const landDamage = calculateVehicleFee({
  service: "LAND_DAMAGE",
  evaluationValueToman: 10_000_000_000
});
assertEqual(landDamage.expertFeeToman, 7_000_000, "Article 31 land-damage maximum");
assertEqual(landDamage.capped, true, "Article 31 land-damage cap flag");
assertEqual(landDamage.article, "ماده ۳۱ تبصره ۱ تا ۳", "Article 31 land-damage route");

const airRail = calculateVehicleFee({
  service: "AIR_RAIL_VALUATION_OR_DAMAGE",
  evaluationValueToman: 1_000_000_000
});
assertEqual(airRail.expertFeeToman, 4_825_000, "Article 32 air-and-rail Article 11 fee");
assertEqual(airRail.capped, false, "Article 32 air-and-rail has no Article 31 cap");
assertEqual(airRail.article, "ماده ۳۲ تبصره ۱", "Article 32 air-and-rail route");

console.log("VEHICLE ARTICLES 31 AND 32 COVERAGE: PASS");
