import { calculateArticle11Engine } from "./Article11Engine";
import { calculateMission } from "./MissionCalculator";
import type { MissionType } from "./MissionCalculator";
import { TARIFF_1405 } from "../config/Tariff1405";

export type VehicleService =
  | "LAND_AUTHENTICITY"
  | "LAND_ACCIDENT"
  | "LAND_TONNAGE_MODEL"
  | "LAND_NON_DAMAGE_COMBINED"
  | "LAND_VALUATION"
  | "LAND_DAMAGE"
  | "TRANSPORT_CLAIM"
  | "MARINE_VALUATION"
  | "AIR_RAIL_VALUATION_OR_DAMAGE"
  | "INLAND_BOAT_COLLISION"
  | "SEA_COLLISION_UNDER_500_GT"
  | "SEA_COLLISION_500_GT_OR_MORE";

export type LandNonDamageService =
  | "AUTHENTICITY"
  | "ACCIDENT"
  | "TONNAGE_MODEL";

export interface VehicleCalculationInput {
  service: VehicleService;
  landNonDamageServices?: LandNonDamageService[];
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
  article11FeeToman: number;
  ancillaryServicesFeeToman: number;
  perVehicleMaximumToman: number | null;
}

const FIXED_FEES_TOMAN: Partial<Record<VehicleService, number>> = {
  LAND_AUTHENTICITY: TARIFF_1405.article31.nonDamageServiceFeeToman,
  LAND_ACCIDENT: TARIFF_1405.article31.nonDamageServiceFeeToman,
  LAND_TONNAGE_MODEL: TARIFF_1405.article31.nonDamageServiceFeeToman,
  INLAND_BOAT_COLLISION: TARIFF_1405.article32.inlandBoatCollisionFeeToman,
  SEA_COLLISION_UNDER_500_GT: TARIFF_1405.article32.seaCollisionUnder500GtFeeToman,
  SEA_COLLISION_500_GT_OR_MORE: TARIFF_1405.article32.seaCollision500GtOrMoreFeeToman
};

function isArticle11Service(service: VehicleService): boolean {
  return service === "LAND_VALUATION" ||
    service === "LAND_DAMAGE" ||
    service === "TRANSPORT_CLAIM" ||
    service === "MARINE_VALUATION" ||
    service === "AIR_RAIL_VALUATION_OR_DAMAGE";
}

function calculateLandAncillaryServices(
  services: LandNonDamageService[]
): { feeToman: number; capped: boolean } {
  const unique = [...new Set(services)];
  const validServices: LandNonDamageService[] = [
    "AUTHENTICITY",
    "ACCIDENT",
    "TONNAGE_MODEL"
  ];

  if (unique.some((service) => !validServices.includes(service))) {
    throw new Error("Invalid land ancillary service.");
  }

  /* اصالت خودرو، مگر در حالت انفرادی، در سایر خدمات مستهلک است. */
  const separatelyPayableCount = unique.filter(
    (service) => service !== "AUTHENTICITY"
  ).length;
  const rawFeeToman =
    separatelyPayableCount * TARIFF_1405.article31.nonDamageServiceFeeToman;
  const feeToman = Math.min(
    rawFeeToman,
    TARIFF_1405.article31.combinedNonDamageMaximumToman
  );

  return {
    feeToman,
    capped: rawFeeToman > TARIFF_1405.article31.combinedNonDamageMaximumToman
  };
}

export function calculateVehicleFee(
  input: VehicleCalculationInput
): VehicleCalculationResult {
  const { service } = input;
  let expertFeeToman = 0;
  let capped = false;
  let article = "";
  let calculationBasis = "";
  let article11FeeToman = 0;
  let ancillaryServicesFeeToman = 0;
  let perVehicleMaximumToman: number | null = null;

  if (service === "LAND_NON_DAMAGE_COMBINED") {
    const selected = input.landNonDamageServices ?? [];
    const unique = [...new Set(selected)];

    if (unique.length < 2) {
      throw new Error("At least two valid non-damage services are required.");
    }

    const ancillary = calculateLandAncillaryServices(unique);
    expertFeeToman = ancillary.feeToman;
    ancillaryServicesFeeToman = ancillary.feeToman;
    capped = ancillary.capped;
    article = "ماده ۳۱ تبصره ۱";
    calculationBasis = "خدمات غیرخسارتی یک خودرو؛ اصالت در صورت همراهی مستهلک است";
  } else if (isArticle11Service(service)) {
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

    if (service === "LAND_VALUATION" || service === "LAND_DAMAGE") {
      const ancillary = calculateLandAncillaryServices(
        input.landNonDamageServices ?? []
      );
      article11FeeToman = result.feePerExpertToman;
      ancillaryServicesFeeToman = ancillary.feeToman;
      perVehicleMaximumToman = TARIFF_1405.article31.perVehicleMaximumToman;

      const feeBeforeVehicleMaximum =
        article11FeeToman + ancillaryServicesFeeToman;
      capped = capped || ancillary.capped ||
        feeBeforeVehicleMaximum > perVehicleMaximumToman;
      expertFeeToman = Math.min(
        feeBeforeVehicleMaximum,
        perVehicleMaximumToman
      );

      article = "ماده ۳۱ تبصره ۱ تا ۳";
      calculationBasis = service === "LAND_DAMAGE"
        ? "تعیین خسارت زمینی مطابق ماده ۱۱، با احتساب خدمات تکمیلی و سقف هر خودرو"
        : "ارزیابی زمینی مطابق ماده ۱۱، با احتساب خدمات تکمیلی و سقف هر خودرو";
    } else if (service === "TRANSPORT_CLAIM") {
      article = "ماده ۳۲ بند ۱";
      calculationBasis = "با توجه به مبلغ خواسته، مطابق ماده ۱۱";
    } else if (service === "MARINE_VALUATION") {
      article = "ماده ۳۲ بند ۲";
      calculationBasis = "تعیین ارزش وسائط نقلیه آبی مطابق ماده ۱۱";
    } else {
      article = "ماده ۳۲ تبصره ۱";
      calculationBasis = "ارزیابی یا تعیین خسارت وسائط نقلیه هوایی و ریلی مطابق ماده ۱۱";
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
    capped,
    article11FeeToman,
    ancillaryServicesFeeToman,
    perVehicleMaximumToman
  };
}
