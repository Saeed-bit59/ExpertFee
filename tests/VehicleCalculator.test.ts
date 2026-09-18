import { calculateVehicleFee } from "../src/engine/VehicleCalculator";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`TEST FAILED: ${message}`);
}

assert(calculateVehicleFee({ service: "LAND_AUTHENTICITY" }).expertFeeToman === 2_000_000, "اصالت خودرو باید 2,000,000 تومان باشد.");
assert(calculateVehicleFee({ service: "LAND_ACCIDENT" }).expertFeeToman === 2_000_000, "تصادفات باید 2,000,000 تومان باشد.");
assert(calculateVehicleFee({ service: "LAND_TONNAGE_MODEL" }).expertFeeToman === 2_000_000, "تناژ و مدل باید 2,000,000 تومان باشد.");
assert(calculateVehicleFee({ service: "LAND_NON_DAMAGE_COMBINED", landNonDamageServices: ["AUTHENTICITY", "ACCIDENT"] }).expertFeeToman === 2_000_000, "اصالت همراه تصادف نباید جداگانه محاسبه شود.");
assert(calculateVehicleFee({ service: "LAND_NON_DAMAGE_COMBINED", landNonDamageServices: ["ACCIDENT", "TONNAGE_MODEL"] }).expertFeeToman === 3_000_000, "خدمات ترکیبی غیرخسارتی باید سقف 3,000,000 تومان داشته باشد.");
assert(calculateVehicleFee({ service: "INLAND_BOAT_COLLISION" }).expertFeeToman === 2_000_000, "تصادم آب‌های داخلی باید 2,000,000 تومان باشد.");
assert(calculateVehicleFee({ service: "SEA_COLLISION_UNDER_500_GT" }).expertFeeToman === 3_500_000, "تصادم دریایی زیر 500 GT باید 3,500,000 تومان باشد.");
assert(calculateVehicleFee({ service: "SEA_COLLISION_500_GT_OR_MORE" }).expertFeeToman === 7_000_000, "تصادم دریایی 500 GT یا بیشتر باید 7,000,000 تومان باشد.");

const land = calculateVehicleFee({ service: "LAND_VALUATION", evaluationValueToman: 10_000_000_000 });
assert(land.expertFeeToman === 7_000_000 && land.capped, "ارزیابی زمینی باید پس از محاسبه ماده 11 سقف 7,000,000 تومان را رعایت کند.");

const marine = calculateVehicleFee({ service: "MARINE_VALUATION", evaluationValueToman: 10_000_000_000 });
assert(marine.expertFeeToman > land.expertFeeToman, "ارزیابی دریایی باید مطابق ماده 11 و بدون سقف اختصاصی ماده 31 محاسبه شود.");

const claim = calculateVehicleFee({ service: "TRANSPORT_CLAIM", evaluationValueToman: 10_000_000_000 });
assert(claim.expertFeeToman === marine.expertFeeToman, "دعوی حمل‌ونقل باید بر مبنای مبلغ خواسته و ماده 11 باشد.");

let invalidRejected = false;
try {
  calculateVehicleFee({ service: "LAND_VALUATION", evaluationValueToman: 0 });
} catch {
  invalidRejected = true;
}
assert(invalidRejected, "مبلغ ارزیابی صفر باید رد شود.");

console.log("Vehicle Calculator: ALL TESTS PASSED");
