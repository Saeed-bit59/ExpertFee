/*
 * ========================================
 * ExpertFee
 * Group 6 - Road, Building and Surveying
 * RoadBuildingRules
 * ========================================
 *
 * منبع:
 * تعرفه دستمزد کارشناسان رسمی - 1405
 *
 * واحد تمام مبالغ این فایل: تومان
 *
 * نکته:
 * متن تعرفه مبالغ را به ریال بیان کرده است.
 * در این فایل همه مبالغ با تقسیم بر 10
 * به تومان تبدیل شده‌اند.
 *
 * این فایل فقط Rule/Constant نگهداری می‌کند
 * و هیچ محاسبه‌ای انجام نمی‌دهد.
 */


/*
 * ========================================
 * ماده 33
 * ارزیابی
 * ========================================
 */

export const ARTICLE_33 = {
  article: 33,
  calculationMode: "ARTICLE_11" as const
};


/*
 * ========================================
 * ماده 34
 * تطبیق نقشه معماری یا سازه
 * ========================================
 *
 * 30,000 ریال / مترمربع
 * حداقل 20,000,000 ریال
 * حداکثر 100,000,000 ریال
 */

export const ARTICLE_34 = {
  article: 34,
  ratePerSquareMeterToman: 3_000,
  minimumFeeToman: 2_000_000,
  maximumFeeToman: 10_000_000
};


/*
 * ========================================
 * ماده 35
 * تطبیق مشخصات قراردادی ساختمان
 * ========================================
 */

export const ARTICLE_35 = {
  article: 35,
  ratePerSquareMeterToman: 3_000,
  minimumFeeToman: 2_000_000,
  maximumFeeToman: 10_000_000
};


/*
 * ========================================
 * ماده 36
 * نقشه معماری / سازه / استحکام بنا
 * ========================================
 */

export const ARTICLE_36 = {
  article: 36,

  architecture: {
    ratePerSquareMeterToman: 2_500,
    minimumFeeToman: 2_000_000,
    maximumFeeToman: 15_000_000
  },

  structure: {
    ratePerSquareMeterToman: 3_000,
    minimumFeeToman: 2_000_000,
    maximumFeeToman: 20_000_000
  },

  structuralSafetyReport: {
    ratePerSquareMeterToman: 2_500,
    minimumFeeToman: 2_000_000,
    maximumFeeToman: 15_000_000
  },

  otherDisciplineStructuralSafetyReportPercent: 50
};


/*
 * ========================================
 * ماده 37
 * افراز و قطعه‌بندی
 * ========================================
 *
 * بند 1:
 * ماده 11 + 20 درصد
 *
 * بند 2:
 * در صورت نیاز به تهیه نقشه،
 * تعرفه نقشه‌برداری جداگانه اضافه می‌شود.
 *
 * تبصره:
 * برای طبقات/بلوک‌های مشابه بعد از مورد اول،
 * فقط 20 درصد دستمزد مربوط پرداخت می‌شود.
 */

export const ARTICLE_37 = {
  article: 37,

  increasePercent:
    20,

  similarAdditionalUnitPercent:
    20
};


/*
 * ========================================
 * ماده 38
 * تشخیص زمین مسبوق به احیا
 * ========================================
 *
 * تا 1000 مترمربع: 20,000,000 ریال
 * هر 1000 مترمربع مازاد: 3,000,000 ریال
 *
 * متن تعرفه برای این ماده سقف مستقلی
 * تعیین نکرده است.
 */

export const ARTICLE_38 = {
  article: 38,

  baseAreaSquareMeters:
    1_000,

  baseFeeToman:
    2_000_000,

  additionalAreaBlockSquareMeters:
    1_000,

  additionalBlockFeeToman:
    300_000
};


/*
 * ========================================
 * ماده 39
 * پیاده کردن محدوده پلاک ثبتی
 * ========================================
 *
 * 10 هکتار = 100,000 مترمربع
 */

export const ARTICLE_39 = {
  article: 39,

  baseAreaSquareMeters:
    1_000,

  secondThresholdSquareMeters:
    100_000,

  knownBoundary: {
    baseFeeToman:
      2_000_000,

    rateAfterBaseToSecondThresholdTomanPerSquareMeter:
      120,

    rateAboveSecondThresholdTomanPerSquareMeter:
      80,

    maximumFeeToman:
      20_000_000
  },

  unknownBoundary: {
    baseFeeToman:
      3_000_000,

    rateAfterBaseToSecondThresholdTomanPerSquareMeter:
      120,

    rateAboveSecondThresholdTomanPerSquareMeter:
      80,

    maximumFeeToman:
      25_000_000
  },

  multiFrequencyGpsFeeToman: 350_000,
  singleFrequencyGpsFeeToman: 200_000,
  maximumPayableGeographicPointCount: 50
};


/*
 * ========================================
 * ماده 40
 * نقشه‌برداری اراضی و تهیه پروفیل
 * ========================================
 *
 * بر مبنای بند 2 ماده 39
 * یعنی حالت گذربند نامشخص
 */

export const ARTICLE_40 = {
  article: 40,

  basedOnArticle:
    39,

  basedOnBoundaryMode:
    "UNKNOWN_BOUNDARY" as const,

  maximumFeeToman:
    25_000_000
};


/*
 * ========================================
 * ماده 41
 * مطالعه پرونده ثبتی و تعیین محل پلاک
 * ========================================
 *
 * تا 1000 مترمربع: 20,000,000 ریال
 * 1000 تا 5000: هر مترمربع 4000 ریال
 * 5000 تا 50000: هر مترمربع 2000 ریال
 * بالاتر از 50000: هر مترمربع 1000 ریال
 * حداکثر 150,000,000 ریال
 */

export const ARTICLE_41 = {
  article: 41,

  baseAreaSquareMeters:
    1_000,

  firstThresholdSquareMeters:
    5_000,

  secondThresholdSquareMeters:
    50_000,

  minimumFeeToman:
    2_000_000,

  rateFromBaseToFirstThresholdTomanPerSquareMeter:
    400,

  rateFromFirstToSecondThresholdTomanPerSquareMeter:
    200,

  rateAboveSecondThresholdTomanPerSquareMeter:
    100,

  maximumFeeToman:
    15_000_000
};


/*
 * ========================================
 * ماده 42
 * نقشه‌برداری قنوات، انهار، کانال‌ها و رودخانه‌ها
 * ========================================
 *
 * حداقل: 20,000,000 ریال
 * حداکثر: ماده 9
 *
 * مطابق تصمیم پروژه، موارد وابسته به ماده 9
 * وارد محاسبه خودکار نمی‌شوند.
 *
 * Rule برای ثبت وضعیت ماده نگهداری می‌شود،
 * اما Calculator خودکار برای آن ساخته نمی‌شود.
 */

export const ARTICLE_42 = {
  article: 42,

  minimumFeeToman:
    2_000_000,

  automaticCalculationSupported:
    false,

  maximumDeterminedByArticle9:
    true
};


/*
 * ========================================
 * ماده 43
 * تشخیص حدود ثبتی و اختلاف املاک
 * ========================================
 *
 * تا یک هکتار: حداقل 20,000,000 ریال
 * هر هکتار مازاد: +20 درصد
 * حداکثر: 60,000,000 ریال
 *
 * تبصره:
 * جانمایی روی نقشه هوایی:
 * +20,000,000 ریال
 */

export const ARTICLE_43 = {
  article: 43,

  baseAreaSquareMeters:
    10_000,

  baseFeeToman:
    2_000_000,

  additionalAreaBlockSquareMeters:
    10_000,

  increasePercentPerAdditionalBlock:
    20,

  maximumFeeToman:
    6_000_000,

  aerialMapAdditionalFeeToman:
    2_000_000
};


/*
 * ========================================
 * ماده 44
 * برنامه‌ریزی شهری
 * ========================================
 */

export const ARTICLE_44 = {
  article: 44,

  /*
   * بند 1
   * انطباق طرح تفکیک اراضی شهری
   */
  subdivisionPlan: {
    baseCount:
      2,

    baseFeeToman:
      4_000_000,

    middleMaximumCount:
      10,

    additionalFeeFrom3To10TomanPerItem:
      600_000,

    additionalFeeAbove10TomanPerItem:
      180_000
  },

  /*
   * بند 2
   * انطباق کاربری اراضی شهری
   */
  landUseCompliance: {
    baseCount:
      2,

    baseFeeToman:
      3_000_000,

    middleMaximumCount:
      10,

    additionalFeeFrom3To10TomanPerItem:
      450_000,

    additionalFeeAbove10TomanPerItem:
      180_000
  },

  /*
   * بند 3
   * انطباق شهری ساختمان‌ها
   */
  buildingUrbanCompliance: {
    baseCount:
      2,

    baseFeeToman:
      3_000_000,

    middleMaximumCount:
      10,

    additionalFeeFrom3To10TomanPerItem:
      450_000,

    additionalFeeAbove10TomanPerItem:
      180_000
  }
};


/*
 * ========================================
 * انواع مشترک گروه 6
 * ========================================
 */

export type Article36ServiceType =
  | "ARCHITECTURE"
  | "STRUCTURE"
  | "STRUCTURAL_SAFETY_REPORT"
  | "OTHER_DISCIPLINE_STRUCTURAL_SAFETY_REPORT";


export type Article39BoundaryMode =
  | "KNOWN_BOUNDARY"
  | "UNKNOWN_BOUNDARY";

export type GeographicPointMethod =
  | "MULTI_FREQUENCY_GPS"
  | "SINGLE_FREQUENCY_GPS";


export type Article44ServiceType =
  | "SUBDIVISION_PLAN"
  | "LAND_USE_COMPLIANCE"
  | "BUILDING_URBAN_COMPLIANCE";


/*
 * ========================================
 * Registry
 * ========================================
 *
 * برای تست، Debug و توسعه‌های بعدی.
 */

export const ROAD_BUILDING_RULES = {
  article33: ARTICLE_33,
  article34: ARTICLE_34,
  article35: ARTICLE_35,
  article36: ARTICLE_36,
  article37: ARTICLE_37,
  article38: ARTICLE_38,
  article39: ARTICLE_39,
  article40: ARTICLE_40,
  article41: ARTICLE_41,
  article42: ARTICLE_42,
  article43: ARTICLE_43,
  article44: ARTICLE_44
} as const;
