import {
  calculateCommonFee
} from "./CommonFeeEngine";

import type {
  CommonFeeResult
} from "./CommonFeeEngine";

import {
  ARTICLE_39,
  ARTICLE_40,
  ARTICLE_41,
  ARTICLE_42,
  ARTICLE_43
} from "./RoadBuildingRules";

import type {
  Article39BoundaryMode
} from "./RoadBuildingRules";

import type {
  MissionType
} from "./MissionCalculator";


/*
 * ========================================
 * ExpertFee
 * Group 6 - Survey Calculator
 * Articles 39 to 43
 * ========================================
 *
 * واحد مبالغ: تومان
 * واحد مساحت: مترمربع
 */


/*
 * ========================================
 * خروجی استاندارد
 * ========================================
 */

export interface SurveyCalculationResult {
  article: 39 | 40 | 41 | 43;
  title: string;

  expertFeeToman: number;

  missionType: MissionType;
  missionDays: number;
  missionFeeToman: number;

  totalPayableToman: number;

  commonFeeResult:
    CommonFeeResult;
}


export interface MissionOptions {
  missionType?: MissionType;
  missionDays?: number;
}


/*
 * ========================================
 * اعتبارسنجی
 * ========================================
 */

function assertPositiveFinite(
  value: number,
  fieldName: string
): void {

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {

    throw new Error(
      `${fieldName} must be a positive number.`
    );
  }
}


function assertNonNegativeInteger(
  value: number,
  fieldName: string
): void {

  if (
    !Number.isFinite(value) ||
    value < 0 ||
    !Number.isInteger(value)
  ) {

    throw new Error(
      `${fieldName} must be a non-negative integer.`
    );
  }
}


/*
 * ========================================
 * نهایی‌سازی دستمزد + مأموریت
 * ========================================
 */

function finalizeFee(
  article: 39 | 40 | 41 | 43,
  title: string,
  expertFeeToman: number,
  mission?: MissionOptions
): SurveyCalculationResult {

  const common =
    calculateCommonFee({
      baseMode:
        "FIXED",

      fixedFeeToman:
        expertFeeToman,

      missionType:
        mission?.missionType,

      missionDays:
        mission?.missionDays
    });


  return {
    article,
    title,

    expertFeeToman:
      common.finalExpertFeeToman,

    missionType:
      common.missionType,

    missionDays:
      common.missionDays,

    missionFeeToman:
      common.missionFeeToman,

    totalPayableToman:
      common.totalPayableToman,

    commonFeeResult:
      common
  };
}


/*
 * ========================================
 * محاسبه داخلی ماده 39
 * ========================================
 */

function calculateArticle39BaseFee(
  areaSquareMeters: number,
  boundaryMode: Article39BoundaryMode
): number {

  assertPositiveFinite(
    areaSquareMeters,
    "areaSquareMeters"
  );


  const rule =
    boundaryMode ===
      "KNOWN_BOUNDARY"

      ? ARTICLE_39
          .knownBoundary

      : ARTICLE_39
          .unknownBoundary;


  let fee =
    rule.baseFeeToman;


  /*
   * تا 1000 مترمربع:
   * مبلغ پایه
   */

  if (
    areaSquareMeters <=
    ARTICLE_39.baseAreaSquareMeters
  ) {

    return fee;
  }


  /*
   * از 1000 مترمربع تا 10 هکتار
   */

  const areaUntilSecondThreshold =
    Math.min(
      areaSquareMeters,
      ARTICLE_39
        .secondThresholdSquareMeters
    );


  const middleArea =
    Math.max(
      0,

      areaUntilSecondThreshold -
      ARTICLE_39
        .baseAreaSquareMeters
    );


  fee +=
    middleArea *
    rule
      .rateAfterBaseToSecondThresholdTomanPerSquareMeter;


  /*
   * مازاد بر 10 هکتار
   */

  if (
    areaSquareMeters >
    ARTICLE_39
      .secondThresholdSquareMeters
  ) {

    const upperArea =
      areaSquareMeters -
      ARTICLE_39
        .secondThresholdSquareMeters;


    fee +=
      upperArea *
      rule
        .rateAboveSecondThresholdTomanPerSquareMeter;
  }


  return Math.min(
    rule.maximumFeeToman,
    Math.round(fee)
  );
}


/*
 * ========================================
 * ماده 39
 * پیاده کردن محدوده پلاک ثبتی
 * ========================================
 */

export interface Article39Input
  extends MissionOptions {

  areaSquareMeters: number;

  boundaryMode:
    Article39BoundaryMode;

  /*
   * تعداد نقاط جغرافیایی اضافه
   *
   * تعرفه برای هر نقطه:
   * 100,000 تومان
   */
  geographicPointCount?: number;
}


export function calculateArticle39(
  input: Article39Input
): SurveyCalculationResult {

  const geographicPointCount =
    input.geographicPointCount ??
    0;


  assertNonNegativeInteger(
    geographicPointCount,
    "geographicPointCount"
  );


  const baseFee =
    calculateArticle39BaseFee(
      input.areaSquareMeters,
      input.boundaryMode
    );


  /*
   * هزینه نقاط جغرافیایی جداگانه
   * به مبلغ محاسبه‌شده اضافه می‌شود.
   *
   * سقف ماده 39 بر محاسبه اصلی اعمال شده است.
   * متن Rule، مبلغ نقطه جغرافیایی را به عنوان
   * هزینه اضافی ثبت کرده است.
   */

  const geographicPointsFee =
    geographicPointCount *
    ARTICLE_39
      .geographicPointAdditionalFeeToman;


  const expertFee =
    baseFee +
    geographicPointsFee;


  return finalizeFee(
    39,
    input.boundaryMode ===
      "KNOWN_BOUNDARY"

      ? "پیاده کردن محدوده پلاک ثبتی با گذربند مشخص"

      : "پیاده کردن محدوده پلاک ثبتی با گذربند نامشخص",

    expertFee,
    input
  );
}


/*
 * ========================================
 * ماده 40
 * نقشه‌برداری اراضی و تهیه پروفیل
 * ========================================
 *
 * بر مبنای بند 2 ماده 39:
 * UNKNOWN_BOUNDARY
 */

export interface Article40Input
  extends MissionOptions {

  areaSquareMeters: number;

  geographicPointCount?: number;
}


export function calculateArticle40(
  input: Article40Input
): SurveyCalculationResult {

  const geographicPointCount =
    input.geographicPointCount ??
    0;


  assertNonNegativeInteger(
    geographicPointCount,
    "geographicPointCount"
  );


  const baseFee =
    calculateArticle39BaseFee(
      input.areaSquareMeters,
      "UNKNOWN_BOUNDARY"
    );


  const geographicPointsFee =
    geographicPointCount *
    ARTICLE_39
      .geographicPointAdditionalFeeToman;


  const expertFee =
    baseFee +
    geographicPointsFee;


  return finalizeFee(
    40,
    "نقشه‌برداری اراضی و تهیه پروفیل",
    expertFee,
    input
  );
}


/*
 * ========================================
 * ماده 41
 * مطالعه پرونده ثبتی و تعیین محل پلاک
 * ========================================
 *
 * برداشت محاسباتی:
 *
 * تا 1000 مترمربع:
 * حداقل
 *
 * از 1000 تا 5000:
 * نرخ اول برای مساحت مازاد بر 1000
 *
 * از 5000 تا 50000:
 * نرخ دوم برای مساحت مازاد بر 5000
 *
 * بالاتر از 50000:
 * نرخ سوم برای مساحت مازاد بر 50000
 *
 * سپس سقف ماده اعمال می‌شود.
 *
 * خارج از محدوده:
 * تا 20 درصد افزایش.
 */

export interface Article41Input
  extends MissionOptions {

  areaSquareMeters: number;

  /*
   * درصد افزایش برای پلاک خارج از محدوده.
   * بازه مجاز: 0 تا 20
   */
  outsideBoundaryIncreasePercent?: number;
}


export function calculateArticle41(
  input: Article41Input
): SurveyCalculationResult {

  assertPositiveFinite(
    input.areaSquareMeters,
    "areaSquareMeters"
  );


  const outsideIncrease =
    input
      .outsideBoundaryIncreasePercent ??
    0;


  if (
    !Number.isFinite(
      outsideIncrease
    ) ||
    outsideIncrease < 0 ||
    outsideIncrease >
      ARTICLE_41
        .outsideBoundaryMaximumIncreasePercent
  ) {

    throw new Error(
      "outsideBoundaryIncreasePercent must be between 0 and 20."
    );
  }


  let fee =
    ARTICLE_41
      .minimumFeeToman;


  /*
   * 1000 تا 5000
   */

  if (
    input.areaSquareMeters >
    ARTICLE_41
      .baseAreaSquareMeters
  ) {

    const firstBandEnd =
      Math.min(
        input.areaSquareMeters,
        ARTICLE_41
          .firstThresholdSquareMeters
      );


    const firstBandArea =
      Math.max(
        0,

        firstBandEnd -
        ARTICLE_41
          .baseAreaSquareMeters
      );


    fee +=
      firstBandArea *
      ARTICLE_41
        .rateFromBaseToFirstThresholdTomanPerSquareMeter;
  }


  /*
   * 5000 تا 50000
   */

  if (
    input.areaSquareMeters >
    ARTICLE_41
      .firstThresholdSquareMeters
  ) {

    const secondBandEnd =
      Math.min(
        input.areaSquareMeters,
        ARTICLE_41
          .secondThresholdSquareMeters
      );


    const secondBandArea =
      Math.max(
        0,

        secondBandEnd -
        ARTICLE_41
          .firstThresholdSquareMeters
      );


    fee +=
      secondBandArea *
      ARTICLE_41
        .rateFromFirstToSecondThresholdTomanPerSquareMeter;
  }


  /*
   * بالاتر از 50000
   */

  if (
    input.areaSquareMeters >
    ARTICLE_41
      .secondThresholdSquareMeters
  ) {

    const thirdBandArea =
      input.areaSquareMeters -
      ARTICLE_41
        .secondThresholdSquareMeters;


    fee +=
      thirdBandArea *
      ARTICLE_41
        .rateAboveSecondThresholdTomanPerSquareMeter;
  }


  /*
   * ابتدا سقف خود ماده
   */

  fee =
    Math.min(
      ARTICLE_41.maximumFeeToman,
      Math.round(fee)
    );


  /*
   * سپس افزایش خارج از محدوده.
   *
   * مطابق معماری تثبیت‌شده پروژه،
   * پس از اعمال ضریب نیز سقف ماده
   * رعایت می‌شود.
   */

  fee =
    Math.min(
      ARTICLE_41.maximumFeeToman,

      Math.round(
        fee *
        (
          1 +
          outsideIncrease /
          100
        )
      )
    );


  return finalizeFee(
    41,
    "مطالعه پرونده ثبتی و تعیین محل پلاک",
    fee,
    input
  );
}


/*
 * ========================================
 * ماده 42
 * ========================================
 *
 * این ماده Calculator عددی خودکار ندارد.
 * حداکثر دستمزد به ماده 9 ارجاع شده است
 * و طبق تصمیم پروژه، موارد وابسته به ماده 9
 * به صورت خودکار محاسبه نمی‌شوند.
 */

export interface Article42Status {
  article: 42;
  automaticCalculationSupported: false;
  minimumFeeToman: number;
  maximumDeterminedByArticle9: true;
}


export function getArticle42Status():
  Article42Status {

  return {
    article: 42,

    automaticCalculationSupported:
      false,

    minimumFeeToman:
      ARTICLE_42
        .minimumFeeToman,

    maximumDeterminedByArticle9:
      true
  };
}


/*
 * ========================================
 * ماده 43
 * تشخیص حدود ثبتی و اختلاف املاک
 * ========================================
 *
 * قاعده بلوکی مورد استفاده:
 *
 * تا یک هکتار:
 * مبلغ پایه
 *
 * هر هکتار مازاد یا کسری از آن:
 * 20 درصد مبلغ پایه اضافه
 *
 * سپس سقف ماده اعمال می‌شود.
 *
 * جانمایی روی نقشه هوایی:
 * مبلغ ثابت اضافی پس از سقف اصلی اضافه می‌شود.
 */

export interface Article43Input
  extends MissionOptions {

  areaSquareMeters: number;

  aerialMapPlacement?: boolean;
}


export function calculateArticle43(
  input: Article43Input
): SurveyCalculationResult {

  assertPositiveFinite(
    input.areaSquareMeters,
    "areaSquareMeters"
  );


  let fee =
    ARTICLE_43
      .baseFeeToman;


  if (
    input.areaSquareMeters >
    ARTICLE_43
      .baseAreaSquareMeters
  ) {

    const excessArea =
      input.areaSquareMeters -
      ARTICLE_43
        .baseAreaSquareMeters;


    const additionalBlocks =
      Math.ceil(
        excessArea /
        ARTICLE_43
          .additionalAreaBlockSquareMeters
      );


    const increasePerBlock =
      ARTICLE_43
        .baseFeeToman *
      ARTICLE_43
        .increasePercentPerAdditionalBlock /
      100;


    fee +=
      additionalBlocks *
      increasePerBlock;
  }


  /*
   * سقف دستمزد اصلی ماده 43
   */

  fee =
    Math.min(
      ARTICLE_43.maximumFeeToman,
      Math.round(fee)
    );


  /*
   * جانمایی روی نقشه هوایی
   * هزینه اضافی مستقل
   */

  if (
    input.aerialMapPlacement
  ) {

    fee +=
      ARTICLE_43
        .aerialMapAdditionalFeeToman;
  }


  return finalizeFee(
    43,
    "تشخیص حدود ثبتی و اختلاف املاک",
    fee,
    input
  );
}
