import { calculateVehicleFee } from "../src/engine/VehicleCalculator";

function assertEqual(actual: number | boolean, expected: number | boolean, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected=${expected} actual=${actual}`);
  }
}

function landValuation(valueToman: number) {
  return calculateVehicleFee({
    service: "LAND_VALUATION",
    evaluationValueToman: valueToman
  });
}

/* ماده ۱۱ در مسیر ارزیابی و خسارت ماده ۳۱، پیش از سقف نهایی هر خودرو. */
assertEqual(landValuation(50_000_000).expertFeeToman, 2_000_000, "A31 fixed Article 11 tier");
assertEqual(landValuation(100_000_000).expertFeeToman, 2_225_000, "A31 first Article 11 bracket");
assertEqual(landValuation(500_000_000).expertFeeToman, 3_825_000, "A31 second Article 11 bracket");
assertEqual(landValuation(2_000_000_000).expertFeeToman, 6_825_000, "A31 Article 11 fee below vehicle maximum");
assertEqual(landValuation(2_000_000_000).capped, false, "A31 vehicle maximum not reached");

const landAboveSevenMillion = landValuation(2_100_000_000);
assertEqual(landAboveSevenMillion.expertFeeToman, 7_000_000, "A31 per-vehicle maximum");
assertEqual(landAboveSevenMillion.capped, true, "A31 per-vehicle cap flag");

const landWithAncillaryService = calculateVehicleFee({
  service: "LAND_VALUATION",
  evaluationValueToman: 2_000_000_000,
  landNonDamageServices: ["ACCIDENT"]
});
assertEqual(landWithAncillaryService.article11FeeToman, 6_825_000, "A31 Article 11 component");
assertEqual(landWithAncillaryService.ancillaryServicesFeeToman, 2_000_000, "A31 ancillary-service component");
assertEqual(landWithAncillaryService.expertFeeToman, 7_000_000, "A31 combined total maximum");

/* تبصره ۱ ماده ۳۱: اصالت فقط در صورت انفرادی پرداخت می‌شود. */
assertEqual(
  calculateVehicleFee({
    service: "LAND_NON_DAMAGE_COMBINED",
    landNonDamageServices: ["AUTHENTICITY", "ACCIDENT"]
  }).expertFeeToman,
  2_000_000,
  "A31 authenticity absorbed in combined work"
);
assertEqual(
  calculateVehicleFee({
    service: "LAND_NON_DAMAGE_COMBINED",
    landNonDamageServices: ["AUTHENTICITY", "ACCIDENT", "TONNAGE_MODEL"]
  }).expertFeeToman,
  3_000_000,
  "A31 combined non-damage maximum"
);

/* ماده ۳۲: مسیرهای حمل‌ونقل و ارزیابی دریایی سقف اختصاصی ماده ۳۱ ندارند. */
const article32Value = 2_100_000_000;
const marine = calculateVehicleFee({ service: "MARINE_VALUATION", evaluationValueToman: article32Value });
const claim = calculateVehicleFee({ service: "TRANSPORT_CLAIM", evaluationValueToman: article32Value });
const airRail = calculateVehicleFee({ service: "AIR_RAIL_VALUATION_OR_DAMAGE", evaluationValueToman: article32Value });

assertEqual(marine.expertFeeToman, 7_025_000, "A32 marine valuation Article 11 fee");
assertEqual(marine.capped, false, "A32 marine has no local cap");
assertEqual(marine.expertFeeToman, 7_025_000, "A32 remains above A31 maximum");
assertEqual(claim.expertFeeToman, marine.expertFeeToman, "A32 transport claim Article 11 route");
assertEqual(airRail.expertFeeToman, marine.expertFeeToman, "A32 air and rail Article 11 route");

assertEqual(calculateVehicleFee({ service: "INLAND_BOAT_COLLISION" }).expertFeeToman, 2_000_000, "A32 inland collision fixed fee");
assertEqual(calculateVehicleFee({ service: "SEA_COLLISION_UNDER_500_GT" }).expertFeeToman, 3_500_000, "A32 sea collision below 500 GT");
assertEqual(calculateVehicleFee({ service: "SEA_COLLISION_500_GT_OR_MORE" }).expertFeeToman, 7_000_000, "A32 sea collision high capacity");

console.log("VEHICLE ARTICLES 31 AND 32 FORMULA REGRESSION: PASS");
