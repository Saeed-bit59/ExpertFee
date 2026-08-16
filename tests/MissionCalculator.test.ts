import {
  TARIFF_1405,
} from "../src/config/Tariff1405";

import {
  calculateMission,
  getMissionDailyRate,
  type MissionType,
} from "../src/engine/MissionCalculator";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `MISSION CALCULATOR TEST FAILED: ${message}`,
    );
  }
}

function assertEqual<T>(
  actual: T,
  expected: T,
  message: string,
): void {
  if (actual !== expected) {
    throw new Error(
      [
        `MISSION CALCULATOR TEST FAILED: ${message}`,
        `expected=${String(expected)}`,
        `actual=${String(actual)}`,
      ].join(" | "),
    );
  }
}

/*
 * ============================================================
 * 1. تعرفه مرکزی ۱۴۰۵
 * ============================================================
 */

const RIAL_PER_TOMAN =
  TARIFF_1405.rialPerToman;

const EXPECTED_IN_PROVINCE_RATE =
  TARIFF_1405.article6
    .missionInsideProvinceDailyRial /
  RIAL_PER_TOMAN;

const EXPECTED_OUT_PROVINCE_RATE =
  TARIFF_1405.article6
    .missionOutsideProvinceDailyRial /
  RIAL_PER_TOMAN;

assertEqual(
  RIAL_PER_TOMAN,
  10,
  "Rial/Toman conversion",
);

assertEqual(
  TARIFF_1405.metadata.year,
  1405,
  "active tariff year",
);

assertEqual(
  TARIFF_1405.article6
    .missionInsideProvinceDailyRial,
  7_500_000,
  "1405 in-province tariff source",
);

assertEqual(
  TARIFF_1405.article6
    .missionOutsideProvinceDailyRial,
  15_000_000,
  "1405 out-of-province tariff source",
);

/*
 * ============================================================
 * 2. نرخ مأموریت داخل استان
 * ============================================================
 */

const inProvinceRate =
  getMissionDailyRate(
    "IN_PROVINCE",
  );

assertEqual(
  inProvinceRate,
  EXPECTED_IN_PROVINCE_RATE,
  "RATE | In province matches tariff",
);

assertEqual(
  inProvinceRate,
  750_000,
  "RATE | In province equals 750,000 Toman",
);

/*
 * ============================================================
 * 3. نرخ مأموریت خارج استان - نام استاندارد
 * ============================================================
 */

const outProvinceRate =
  getMissionDailyRate(
    "OUT_OF_PROVINCE",
  );

assertEqual(
  outProvinceRate,
  EXPECTED_OUT_PROVINCE_RATE,
  "RATE | Out of province matches tariff",
);

assertEqual(
  outProvinceRate,
  1_500_000,
  "RATE | Out of province equals 1,500,000 Toman",
);

/*
 * ============================================================
 * 4. سازگاری با نام قبلی OUT_PROVINCE
 *
 * نسخه‌های قبلی نرم‌افزار از OUT_PROVINCE استفاده می‌کنند.
 * این مقدار باید همچنان از نظر محاسباتی معتبر باشد.
 * ============================================================
 */

const legacyOutProvinceRate =
  getMissionDailyRate(
    "OUT_PROVINCE",
  );

assertEqual(
  legacyOutProvinceRate,
  EXPECTED_OUT_PROVINCE_RATE,
  "RATE | Legacy OUT_PROVINCE matches tariff",
);

assertEqual(
  legacyOutProvinceRate,
  outProvinceRate,
  "RATE | Legacy and standard out-province names are equivalent",
);

/*
 * ============================================================
 * 5. حالت بدون مأموریت
 * ============================================================
 */

const noMissionRate =
  getMissionDailyRate(
    "NONE",
  );

assertEqual(
  noMissionRate,
  0,
  "RATE | NONE equals zero",
);

/*
 * ============================================================
 * 6. محاسبه مأموریت داخل استان
 * ============================================================
 */

const inProvinceMission =
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "IN_PROVINCE",
    missionDays: 1,
  });

assertEqual(
  inProvinceMission.missionType,
  "IN_PROVINCE",
  "MISSION | In province type",
);

assertEqual(
  inProvinceMission.missionDays,
  1,
  "MISSION | In province days",
);

assertEqual(
  inProvinceMission.dailyMissionRateToman,
  750_000,
  "MISSION | In province daily rate",
);

assertEqual(
  inProvinceMission.missionFeeToman,
  750_000,
  "MISSION | In province mission fee",
);

assertEqual(
  inProvinceMission.totalPayableToman,
  50_750_000,
  "MISSION | In province total payable",
);

/*
 * ============================================================
 * 7. مأموریت داخل استان - چند روز
 * ============================================================
 */

const inProvinceMultiDay =
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "IN_PROVINCE",
    missionDays: 4,
  });

assertEqual(
  inProvinceMultiDay.missionFeeToman,
  3_000_000,
  "MISSION | Four in-province days",
);

assertEqual(
  inProvinceMultiDay.totalPayableToman,
  53_000_000,
  "MISSION | Four in-province days total",
);

/*
 * ============================================================
 * 8. مأموریت خارج استان - نام استاندارد
 * ============================================================
 */

const outProvinceMission =
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "OUT_OF_PROVINCE",
    missionDays: 1,
  });

assertEqual(
  outProvinceMission.missionType,
  "OUT_OF_PROVINCE",
  "MISSION | Standard out-of-province type",
);

assertEqual(
  outProvinceMission.dailyMissionRateToman,
  1_500_000,
  "MISSION | Out-of-province daily rate",
);

assertEqual(
  outProvinceMission.missionFeeToman,
  1_500_000,
  "MISSION | Out-of-province mission fee",
);

assertEqual(
  outProvinceMission.totalPayableToman,
  51_500_000,
  "MISSION | Out-of-province total payable",
);

/*
 * ============================================================
 * 9. سازگاری مأموریت خارج استان با نام قدیمی
 * ============================================================
 */

const legacyOutProvinceMission =
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "OUT_PROVINCE",
    missionDays: 1,
  });

assertEqual(
  legacyOutProvinceMission.dailyMissionRateToman,
  1_500_000,
  "MISSION | Legacy OUT_PROVINCE daily rate",
);

assertEqual(
  legacyOutProvinceMission.missionFeeToman,
  outProvinceMission.missionFeeToman,
  "MISSION | Legacy and standard out-province fee",
);

assertEqual(
  legacyOutProvinceMission.totalPayableToman,
  outProvinceMission.totalPayableToman,
  "MISSION | Legacy and standard total",
);

/*
 * ============================================================
 * 10. مأموریت خارج استان - چند روز
 * ============================================================
 */

const outProvinceMultiDay =
  calculateMission({
    expertFeeToman: 100_000_000,
    missionType: "OUT_OF_PROVINCE",
    missionDays: 3,
  });

assertEqual(
  outProvinceMultiDay.missionFeeToman,
  4_500_000,
  "MISSION | Three out-of-province days",
);

assertEqual(
  outProvinceMultiDay.totalPayableToman,
  104_500_000,
  "MISSION | Three out-of-province days total",
);

/*
 * ============================================================
 * 11. بدون مأموریت
 * ============================================================
 */

const noneMission =
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "NONE",
    missionDays: 0,
  });

assertEqual(
  noneMission.missionType,
  "NONE",
  "MISSION | None type",
);

assertEqual(
  noneMission.missionDays,
  0,
  "MISSION | None days",
);

assertEqual(
  noneMission.dailyMissionRateToman,
  0,
  "MISSION | None daily rate",
);

assertEqual(
  noneMission.missionFeeToman,
  0,
  "MISSION | None mission fee",
);

assertEqual(
  noneMission.totalPayableToman,
  50_000_000,
  "MISSION | None total payable",
);

/*
 * ============================================================
 * 12. اعتبارسنجی مبلغ دستمزد
 * ============================================================
 */

let negativeFeeRejected = false;

try {
  calculateMission({
    expertFeeToman: -1,
    missionType: "IN_PROVINCE",
    missionDays: 1,
  });
} catch {
  negativeFeeRejected = true;
}

assert(
  negativeFeeRejected,
  "VALIDATION | Negative expert fee must be rejected",
);

/*
 * ============================================================
 * 13. اعتبارسنجی روز مأموریت
 * ============================================================
 */

let negativeDaysRejected = false;

try {
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "IN_PROVINCE",
    missionDays: -1,
  });
} catch {
  negativeDaysRejected = true;
}

assert(
  negativeDaysRejected,
  "VALIDATION | Negative mission days must be rejected",
);

/*
 * ============================================================
 * 14. روز مأموریت باید عدد صحیح باشد
 * ============================================================
 */

let decimalDaysRejected = false;

try {
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "IN_PROVINCE",
    missionDays: 1.5,
  });
} catch {
  decimalDaysRejected = true;
}

assert(
  decimalDaysRejected,
  "VALIDATION | Decimal mission days must be rejected",
);

/*
 * ============================================================
 * 15. NONE با روز غیرصفر مجاز نیست
 * ============================================================
 */

let noneWithDaysRejected = false;

try {
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "NONE",
    missionDays: 1,
  });
} catch {
  noneWithDaysRejected = true;
}

assert(
  noneWithDaysRejected,
  "VALIDATION | NONE with mission days must be rejected",
);

/*
 * ============================================================
 * 16. مأموریت فعال بدون روز مجاز نیست
 * ============================================================
 */

let activeMissionWithoutDaysRejected = false;

try {
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "IN_PROVINCE",
    missionDays: 0,
  });
} catch {
  activeMissionWithoutDaysRejected = true;
}

assert(
  activeMissionWithoutDaysRejected,
  "VALIDATION | Active mission with zero days must be rejected",
);

/*
 * ============================================================
 * 17. تست همه MissionTypeها
 * ============================================================
 */

const supportedMissionTypes: MissionType[] = [
  "NONE",
  "IN_PROVINCE",
  "OUT_PROVINCE",
  "OUT_OF_PROVINCE",
];

for (
  const missionType
  of supportedMissionTypes
) {
  if (missionType === "NONE") {
    assertEqual(
      getMissionDailyRate(missionType),
      0,
      `TYPE | ${missionType}`,
    );
  } else if (
    missionType === "IN_PROVINCE"
  ) {
    assertEqual(
      getMissionDailyRate(missionType),
      750_000,
      `TYPE | ${missionType}`,
    );
  } else {
    assertEqual(
      getMissionDailyRate(missionType),
      1_500_000,
      `TYPE | ${missionType}`,
    );
  }
}

/*
 * ============================================================
 * 18. کنترل مستقیم اتصال به تعرفه ۱۴۰۵
 * ============================================================
 */

assertEqual(
  getMissionDailyRate("IN_PROVINCE"),
  TARIFF_1405.article6
    .missionInsideProvinceDailyRial /
    TARIFF_1405.rialPerToman,
  "REGRESSION | In-province engine reads tariff 1405",
);

assertEqual(
  getMissionDailyRate("OUT_PROVINCE"),
  TARIFF_1405.article6
    .missionOutsideProvinceDailyRial /
    TARIFF_1405.rialPerToman,
  "REGRESSION | Legacy out-province reads tariff 1405",
);

assertEqual(
  getMissionDailyRate("OUT_OF_PROVINCE"),
  TARIFF_1405.article6
    .missionOutsideProvinceDailyRial /
    TARIFF_1405.rialPerToman,
  "REGRESSION | Standard out-province reads tariff 1405",
);

/*
 * ============================================================
 * نتیجه
 * ============================================================
 */

console.log(
  "============================================================",
);

console.log(
  "MISSION CALCULATOR: ALL TESTS PASSED",
);

console.log(
  "Tariff Year: 1405",
);

console.log(
  `In Province: ${EXPECTED_IN_PROVINCE_RATE.toLocaleString("fa-IR")} تومان/day`,
);

console.log(
  `Out Province: ${EXPECTED_OUT_PROVINCE_RATE.toLocaleString("fa-IR")} تومان/day`,
);

console.log(
  "============================================================",
);