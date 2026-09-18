import {
  calculateArticle11Engine
} from "./Article11Engine";

import {
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN as TARIFF_1405_ARTICLE_11_MAXIMUM_TOMAN
} from "../config/Tariff1405";

import type {
  Article11EngineResult
} from "./Article11Engine";

import {
  calculateMission
} from "./MissionCalculator";

import type {
  MissionType
} from "./MissionCalculator";


/*
 * ========================================
 * ExpertFee - Common Fee Engine
 * ========================================
 *
 * موتور مشترک محاسبات عمومی تعرفه
 *
 * ترتیب محاسبه:
 *
 * 1) تعیین دستمزد پایه
 * 2) اعمال درصد افزایش اختصاصی ماده
 * 3) اعمال حداقل اختصاصی
 * 4) اعمال حداکثر اختصاصی / سقف عمومی
 * 5) افزودن مأموریت
 *
 * مأموریت پس از دستمزد کارشناسی اضافه می‌شود
 * و وارد سقف دستمزد کارشناسی نمی‌شود.
 */


/*
 * ========================================
 * سقف عمومی دستمزد ماده 11
 * ========================================
 *
 * واحد: تومان
 *
 * این مقدار در یک نقطه مرکزی نگهداری می‌شود
 * تا گروه‌های مختلف آن را Hardcode نکنند.
 */

export const ARTICLE_11_GENERAL_MAXIMUM_TOMAN =
  TARIFF_1405_ARTICLE_11_MAXIMUM_TOMAN;


/*
 * ========================================
 * نوع مبنای محاسبه
 * ========================================
 */

export type CommonFeeBaseMode =
  | "ARTICLE_11"
  | "FIXED";


/*
 * ========================================
 * ورودی موتور مشترک
 * ========================================
 */

export interface CommonFeeInput {

  /*
   * مبنای محاسبه
   */
  baseMode: CommonFeeBaseMode;

  /*
   * مبلغ ارزیابی - فقط برای ARTICLE_11
   */
  evaluationValueToman?: number;

  /*
   * مبلغ ثابت - فقط برای FIXED
   */
  fixedFeeToman?: number;

  /*
   * درصد افزایش اختصاصی ماده
   *
   * مثال:
   * 20 یعنی 20 درصد افزایش
   * 50 یعنی 50 درصد افزایش
   */
  increasePercent?: number;

  /*
   * حداقل اختصاصی خدمت
   */
  minimumFeeToman?: number;

  /*
   * حداکثر اختصاصی خدمت
   *
   * اگر تعیین نشود و مبنا ARTICLE_11 باشد،
   * سقف عمومی ۱۳۵ میلیون تومان اعمال می‌شود.
   */
  maximumFeeToman?: number;

  /*
   * مشخصات مأموریت
   */
  missionType?: MissionType;

  missionDays?: number;
}


/*
 * ========================================
 * خروجی موتور مشترک
 * ========================================
 */

export interface CommonFeeResult {

  baseMode: CommonFeeBaseMode;

  /*
   * نتیجه کامل ماده 11 برای استفاده داخلی
   * یا UIهای تخصصی
   */
  article11Result:
    Article11EngineResult | null;

  /*
   * دستمزد پایه قبل از ضریب اختصاصی
   */
  baseFeeToman: number;

  /*
   * درصد افزایش اختصاصی
   */
  increasePercent: number;

  /*
   * مبلغ افزایش
   */
  increaseAmountToman: number;

  /*
   * مبلغ بعد از افزایش و قبل از حدود
   */
  feeAfterIncreaseToman: number;

  /*
   * حدود مؤثر
   */
  minimumFeeToman:
    number | null;

  maximumFeeToman:
    number | null;

  /*
   * آیا حداقل یا حداکثر اعمال شد؟
   */
  minimumApplied: boolean;

  maximumApplied: boolean;

  /*
   * دستمزد نهایی کارشناسی
   * قبل از مأموریت
   */
  finalExpertFeeToman: number;

  /*
   * مأموریت
   */
  missionType: MissionType;

  missionDays: number;

  dailyMissionRateToman: number;

  missionFeeToman: number;

  /*
   * مبلغ نهایی قابل پرداخت
   */
  totalPayableToman: number;
}


/*
 * ========================================
 * اعتبارسنجی عدد غیرمنفی
 * ========================================
 */

function assertNonNegativeFinite(
  value: number,
  fieldName: string
): void {

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {

    throw new Error(
      `${fieldName} must be a non-negative number.`
    );
  }
}


/*
 * ========================================
 * گرد کردن مبلغ
 * ========================================
 *
 * خروجی مالی در سطح تومان نگهداری می‌شود.
 */

function roundToman(
  value: number
): number {

  return Math.round(value);
}


/*
 * ========================================
 * تعیین دستمزد پایه
 * ========================================
 */

function calculateBaseFee(
  input: CommonFeeInput
): {
  baseFeeToman: number;
  article11Result: Article11EngineResult | null;
} {

  if (
    input.baseMode === "ARTICLE_11"
  ) {

    const evaluationValueToman =
      input.evaluationValueToman;

    if (
      evaluationValueToman === undefined
    ) {

      throw new Error(
        "evaluationValueToman is required for ARTICLE_11 mode."
      );
    }

    assertNonNegativeFinite(
      evaluationValueToman,
      "evaluationValueToman"
    );

    /*
     * مهم:
     *
     * CommonFeeEngine عمداً تنظیمات داخلی
     * تبصره‌ها و هیأت ماده 11 را بازتولید نمی‌کند.
     *
     * برای محاسبه عمومی هر خدمت، یک کارشناس
     * و مسیر استاندارد ماده 11 مبنا قرار می‌گیرد.
     */

    const article11Result =
      calculateArticle11Engine({
        evaluationValueToman,
        expertCount: 1
      });

    return {
      baseFeeToman:
        article11Result
          .feePerExpertToman,

      article11Result
    };
  }


  const fixedFeeToman =
    input.fixedFeeToman;

  if (
    fixedFeeToman === undefined
  ) {

    throw new Error(
      "fixedFeeToman is required for FIXED mode."
    );
  }

  assertNonNegativeFinite(
    fixedFeeToman,
    "fixedFeeToman"
  );

  return {
    baseFeeToman:
      roundToman(
        fixedFeeToman
      ),

    article11Result:
      null
  };
}


/*
 * ========================================
 * موتور اصلی
 * ========================================
 */

export function calculateCommonFee(
  input: CommonFeeInput
): CommonFeeResult {

  /*
   * ========================================
   * درصد افزایش
   * ========================================
   */

  const increasePercent =
    input.increasePercent ?? 0;

  assertNonNegativeFinite(
    increasePercent,
    "increasePercent"
  );


  /*
   * ========================================
   * حداقل
   * ========================================
   */

  if (
    input.minimumFeeToman !==
      undefined
  ) {

    assertNonNegativeFinite(
      input.minimumFeeToman,
      "minimumFeeToman"
    );
  }


  /*
   * ========================================
   * حداکثر
   * ========================================
   */

  if (
    input.maximumFeeToman !==
      undefined
  ) {

    assertNonNegativeFinite(
      input.maximumFeeToman,
      "maximumFeeToman"
    );
  }


  if (
    input.minimumFeeToman !==
      undefined &&
    input.maximumFeeToman !==
      undefined &&
    input.minimumFeeToman >
      input.maximumFeeToman
  ) {

    throw new Error(
      "minimumFeeToman cannot be greater than maximumFeeToman."
    );
  }


  /*
   * ========================================
   * دستمزد پایه
   * ========================================
   */

  const {
    baseFeeToman,
    article11Result
  } =
    calculateBaseFee(
      input
    );


  /*
   * ========================================
   * اعمال درصد افزایش اختصاصی
   * ========================================
   */

  const increaseAmountToman =
    roundToman(
      baseFeeToman *
      increasePercent /
      100
    );


  const feeAfterIncreaseToman =
    roundToman(
      baseFeeToman +
      increaseAmountToman
    );


  /*
   * ========================================
   * تعیین حداقل مؤثر
   * ========================================
   */

  const minimumFeeToman =
    input.minimumFeeToman ??
    null;


  /*
   * ========================================
   * تعیین حداکثر مؤثر
   * ========================================
   *
   * در مسیر ماده 11:
   * - اگر سقف اختصاصی داده شود همان اعمال می‌شود.
   * - در غیر این صورت سقف عمومی ماده 11 اعمال می‌شود.
   *
   * در مبلغ ثابت:
   * - فقط اگر سقف اختصاصی داده شود محدود می‌شود.
   */

  const maximumFeeToman =
    input.maximumFeeToman ??
    (
      input.baseMode ===
        "ARTICLE_11"

        ? ARTICLE_11_GENERAL_MAXIMUM_TOMAN

        : null
    );


  /*
   * ========================================
   * اعمال حداقل
   * ========================================
   */

  let feeAfterLimitsToman =
    feeAfterIncreaseToman;

  let minimumApplied =
    false;

  let maximumApplied =
    false;


  if (
    minimumFeeToman !== null &&
    feeAfterLimitsToman <
      minimumFeeToman
  ) {

    feeAfterLimitsToman =
      minimumFeeToman;

    minimumApplied =
      true;
  }


  /*
   * ========================================
   * اعمال حداکثر
   * ========================================
   */

  if (
    maximumFeeToman !== null &&
    feeAfterLimitsToman >
      maximumFeeToman
  ) {

    feeAfterLimitsToman =
      maximumFeeToman;

    maximumApplied =
      true;
  }


  const finalExpertFeeToman =
    roundToman(
      feeAfterLimitsToman
    );


  /*
   * ========================================
   * مأموریت
   * ========================================
   */

  const missionType:
    MissionType =
      input.missionType ??
      "NONE";


  const missionDays =
    missionType === "NONE"
      ? 0
      : (
          input.missionDays ??
          0
        );


  const mission =
    calculateMission({

      expertFeeToman:
        finalExpertFeeToman,

      missionType,

      missionDays
    });


  /*
   * ========================================
   * خروجی
   * ========================================
   */

  return {

    baseMode:
      input.baseMode,

    article11Result,

    baseFeeToman:
      roundToman(
        baseFeeToman
      ),

    increasePercent,

    increaseAmountToman,

    feeAfterIncreaseToman,

    minimumFeeToman,

    maximumFeeToman,

    minimumApplied,

    maximumApplied,

    finalExpertFeeToman,

    missionType:
      mission.missionType,

    missionDays:
      mission.missionDays,

    dailyMissionRateToman:
      mission.dailyMissionRateToman,

    missionFeeToman:
      mission.missionFeeToman,

    totalPayableToman:
      mission.totalPayableToman
  };
}
