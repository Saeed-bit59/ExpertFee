import { calculateArticle11Engine } from "./Article11Engine";
import { calculateMission } from "./MissionCalculator";
import type { MissionType } from "./MissionCalculator";

export type VehicleService =
  | "LAND_AUTHENTICITY"
  | "LAND_ACCIDENT"
  | "LAND_TONNAGE_MODEL"
  | "LAND_VALUATION"
  | "TRANSPORT_CLAIM"
  | "MARINE_VALUATION"
  | "INLAND_BOAT_COLLISION"
  | "SEA_COLLISION_UNDER_500_GT"
  | "SEA_COLLISION_500_GT_OR_MORE";

export interface VehicleCalculationInput {
  service: VehicleService;
  evaluationValueToman?: number;
  missionType?: MissionType;
  missionDays?: number;
}

export interface VehicleCalculationResult {
  service: VehicleService;
  expertFeeToman: number;
  missionFeeToman: number;
  totalPayableToman: number;
  article: string;
  calculationBasis: string;
  capped: boolean;
}

const FIXED_FEES_TOMAN: Partial<Record<VehicleService, number>> = {
  LAND_AUTHENTICITY: 500_000,
  LAND_ACCIDENT: 600_000,
  LAND_TONNAGE_MODEL: 600_000,
  INLAND_BOAT_COLLISION: 1_000_000,
  SEA_COLLISION_UNDER_500_GT: 2_000_000,
  SEA_COLLISION_500_GT_OR_MORE: 4_000_000
};

function isArticle11Service(service: VehicleService): boolean {
  return service === "LAND_VALUATION" ||
    service === "TRANSPORT_CLAIM" ||
    service === "MARINE_VALUATION";
}

export function calculateVehicleFee(
  input: VehicleCalculationInput
): VehicleCalculationResult {
  const { service } = input;
  let expertFeeToman = 0;
  let capped = false;
  let article = "";
  let calculationBasis = "";

  if (isArticle11Service(service)) {
    const value = input.evaluationValueToman ?? 0;
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("Evaluation value must be a positive number.");
    }

    const result = calculateArticle11Engine({
      evaluationValueToman: value,
      expertCount: 1
    });

    expertFeeToman = result.feePerExpertToman;
    capped = result.capped;

    if (service === "LAND_VALUATION") {
      article = "ماده ۳۱ بند ۴";
      calculationBasis = "مطابق ماده ۱۱";
    } else if (service === "TRANSPORT_CLAIM") {
      article = "ماده ۳۲ بند ۱";
      calculationBasis = "با توجه به مبلغ خواسته، مطابق ماده ۱۱";
    } else {
      article = "ماده ۳۲ بند ۲";
      calculationBasis = "تعیین ارزش وسائط نقلیه آبی مطابق ماده ۱۱";
    }
  } else {
    expertFeeToman = FIXED_FEES_TOMAN[service] ?? 0;

    switch (service) {
      case "LAND_AUTHENTICITY":
        article = "ماده ۳۱ بند ۱";
        calculationBasis = "رسیدگی به اصالت خودرو";
        break;
      case "LAND_ACCIDENT":
        article = "ماده ۳۱ بند ۲";
        calculationBasis = "رسیدگی به تصادفات";
        break;
      case "LAND_TONNAGE_MODEL":
        article = "ماده ۳۱ بند ۳";
        calculationBasis = "اظهارنظر فنی تعیین تناژ و مدل";
        break;
      case "INLAND_BOAT_COLLISION":
        article = "ماده ۳۲ بند ۳-الف";
        calculationBasis = "تصادم قایق‌های تفریحی و مسافربری در آب‌های داخلی";
        break;
      case "SEA_COLLISION_UNDER_500_GT":
        article = "ماده ۳۲ بند ۳-ب";
        calculationBasis = "تصادم دریایی؛ ظرفیت مبنا کمتر از ۵۰۰ GT";
        break;
      case "SEA_COLLISION_500_GT_OR_MORE":
        article = "ماده ۳۲ بند ۳-ب";
        calculationBasis = "تصادم دریایی؛ ظرفیت مبنا ۵۰۰ GT یا بیشتر";
        break;
    }
  }

  const missionType = input.missionType ?? "NONE";
  const missionDays = missionType === "NONE" ? 0 : (input.missionDays ?? 1);
  const mission = calculateMission({
    expertFeeToman,
    missionType,
    missionDays
  });

  return {
    service,
    expertFeeToman,
    missionFeeToman: mission.missionFeeToman,
    totalPayableToman: mission.totalPayableToman,
    article,
    calculationBasis,
    capped
  };
}
