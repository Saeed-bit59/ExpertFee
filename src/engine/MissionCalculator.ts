import {
  TARIFF_1405,
} from "../config/Tariff1405";

export type MissionType =
  | "NONE"
  | "IN_PROVINCE"
  | "OUT_PROVINCE"
  | "OUT_OF_PROVINCE";

export interface MissionInput {
  expertFeeToman: number;
  missionType: MissionType;
  missionDays: number;
}

export interface MissionResult {
  missionType: MissionType;
  missionDays: number;
  dailyMissionRateToman: number;
  missionFeeToman: number;
  totalPayableToman: number;
}

const RIAL_PER_TOMAN =
  TARIFF_1405.rialPerToman;

const IN_PROVINCE_DAILY_TOMAN =
  TARIFF_1405.article6
    .missionInsideProvinceDailyRial /
  RIAL_PER_TOMAN;

const OUT_OF_PROVINCE_DAILY_TOMAN =
  TARIFF_1405.article6
    .missionOutsideProvinceDailyRial /
  RIAL_PER_TOMAN;

/**
 * تعیین نرخ روزانه مأموریت بر اساس تعرفه ۱۴۰۵
 *
 * داخل استان:
 * 7,500,000 ریال = 750,000 تومان
 *
 * خارج استان:
 * 15,000,000 ریال = 1,500,000 تومان
 *
 * OUT_PROVINCE و OUT_OF_PROVINCE
 * برای حفظ سازگاری با نسخه‌های قبلی هر دو معتبر هستند.
 */
export function getMissionDailyRate(
  missionType: MissionType,
): number {
  switch (missionType) {
    case "IN_PROVINCE":
      return IN_PROVINCE_DAILY_TOMAN;

    case "OUT_PROVINCE":
    case "OUT_OF_PROVINCE":
      return OUT_OF_PROVINCE_DAILY_TOMAN;

    case "NONE":
      return 0;

    default:
      throw new Error(
        "Unsupported mission type.",
      );
  }
}

/**
 * محاسبه فوق‌العاده مأموریت
 */
export function calculateMission(
  input: MissionInput,
): MissionResult {
  if (
    !Number.isFinite(
      input.expertFeeToman,
    ) ||
    input.expertFeeToman < 0
  ) {
    throw new Error(
      "Expert fee must be non-negative.",
    );
  }

  if (
    !Number.isInteger(
      input.missionDays,
    ) ||
    input.missionDays < 0
  ) {
    throw new Error(
      "Mission days must be a non-negative integer.",
    );
  }

  /*
   * وقتی مأموریت انتخاب نشده است،
   * تعداد روزها باید صفر باشد.
   */
  if (
    input.missionType === "NONE" &&
    input.missionDays !== 0
  ) {
    throw new Error(
      "Mission days must be zero when mission type is NONE.",
    );
  }

  /*
   * در صورت انتخاب مأموریت،
   * حداقل یک روز باید ثبت شود.
   */
  if (
    input.missionType !== "NONE" &&
    input.missionDays < 1
  ) {
    throw new Error(
      "Mission days must be at least one for a mission.",
    );
  }

  const dailyMissionRateToman =
    getMissionDailyRate(
      input.missionType,
    );

  const missionFeeToman =
    dailyMissionRateToman *
    input.missionDays;

  return {
    missionType:
      input.missionType,

    missionDays:
      input.missionDays,

    dailyMissionRateToman,

    missionFeeToman,

    totalPayableToman:
      input.expertFeeToman +
      missionFeeToman,
  };
}