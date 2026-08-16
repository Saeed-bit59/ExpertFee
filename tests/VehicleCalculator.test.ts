import { calculateVehicleFee } from "../src/engine/VehicleCalculator";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`TEST FAILED: ${message}`);
}

assert(calculateVehicleFee({ service: "LAND_AUTHENTICITY" }).expertFeeToman === 500_000, "اصالت خودرو باید 500,000 تومان باشد.");
assert(calculateVehicleFee({ service: "LAND_ACCIDENT" }).expertFeeToman === 600_000, "تصادفات باید 600,000 تومان باشد.");
assert(calculateVehicleFee({ service: "LAND_TONNAGE_MODEL" }).expertFeeToman === 600_000, "تناژ و مدل باید 600,000 تومان باشد.");
assert(calculateVehicleFee({ service: "INLAND_BOAT_COLLISION" }).expertFeeToman === 1_000_000, "تصادم آب‌های داخلی باید 1,000,000 تومان باشد.");
assert(calculateVehicleFee({ service: "SEA_COLLISION_UNDER_500_GT" }).expertFeeToman === 2_000_000, "تصادم دریایی زیر 500 GT باید 2,000,000 تومان باشد.");
assert(calculateVehicleFee({ service: "SEA_COLLISION_500_GT_OR_MORE" }).expertFeeToman === 4_000_000, "تصادم دریایی 500 GT یا بیشتر باید 4,000,000 تومان باشد.");

const land = calculateVehicleFee({ service: "LAND_VALUATION", evaluationValueToman: 1_000_000_000 });
assert(land.expertFeeToman > 0, "ارزیابی زمینی باید از ماده 11 نتیجه معتبر بگیرد.");

const marine = calculateVehicleFee({ service: "MARINE_VALUATION", evaluationValueToman: 1_000_000_000 });
assert(marine.expertFeeToman === land.expertFeeToman, "ارزیابی زمینی و دریایی با مبلغ برابر باید خروجی ماده 11 برابر داشته باشند.");

const claim = calculateVehicleFee({ service: "TRANSPORT_CLAIM", evaluationValueToman: 1_000_000_000 });
assert(claim.expertFeeToman === land.expertFeeToman, "دعوی حمل‌ونقل باید بر مبنای مبلغ خواسته و ماده 11 باشد.");

let invalidRejected = false;
try {
  calculateVehicleFee({ service: "LAND_VALUATION", evaluationValueToman: 0 });
} catch {
  invalidRejected = true;
}
assert(invalidRejected, "مبلغ ارزیابی صفر باید رد شود.");

console.log("Vehicle Calculator: ALL TESTS PASSED");
