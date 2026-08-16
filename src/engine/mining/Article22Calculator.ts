import {
  ARTICLE22_METAL_MINIMUM_FEE_TOMAN,
  ARTICLE22_METAL_MAXIMUM_FEE_TOMAN,
  ARTICLE22_UNDERGROUND_INCREASE_RATE,
  ARTICLE22_MINING_MAXIMUM_FEE_TOMAN,
  ARTICLE22_METAL_TITLE,
  ARTICLE22_MINING_TITLE
} from "./Article22Rules";

import type {
  Article22MetalInput,
  Article22MetalResult,
  Article22MiningInput,
  Article22MiningResult
} from "./Article22Types";


/*
 * ============================================================
 * Validation
 * ============================================================
 */

function validateArticle11Fee(
  value: number
): void {

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {

    throw new Error(
      "article11FeeToman must be a non-negative finite number."
    );

  }

}


/*
 * ============================================================
 * بند 1 ماده 22
 *
 * ارزیابی در رشته فلزات
 * ============================================================
 *
 * مبنای محاسبه:
 * ماده 11
 *
 * حداقل:
 * 2,000,000 تومان
 *
 * حداکثر:
 * 5,000,000 تومان
 *
 * ============================================================
 */

export function calculateArticle22Metal(
  input: Article22MetalInput
): Article22MetalResult {

  const {
    article11FeeToman
  } = input;


  validateArticle11Fee(
    article11FeeToman
  );


  /*
   * اعمال حداقل
   */

  const feeAfterMinimum =
    Math.max(
      article11FeeToman,
      ARTICLE22_METAL_MINIMUM_FEE_TOMAN
    );


  /*
   * اعمال حداکثر
   */

  const finalFeeToman =
    Math.min(
      feeAfterMinimum,
      ARTICLE22_METAL_MAXIMUM_FEE_TOMAN
    );


  return {

    serviceType:
      "METAL_EVALUATION",

    article11FeeToman,

    minimumFeeToman:
      ARTICLE22_METAL_MINIMUM_FEE_TOMAN,

    maximumFeeToman:
      ARTICLE22_METAL_MAXIMUM_FEE_TOMAN,

    minimumApplied:
      article11FeeToman <
      ARTICLE22_METAL_MINIMUM_FEE_TOMAN,

    maximumApplied:
      article11FeeToman >
      ARTICLE22_METAL_MAXIMUM_FEE_TOMAN,

    finalFeeToman,

    title:
      ARTICLE22_METAL_TITLE

  };

}


/*
 * ============================================================
 * بند 2 ماده 22
 *
 * ارزیابی ذخایر معدنی
 * ============================================================
 *
 * معدن روباز:
 * تعرفه ماده 11
 *
 * معدن زیرزمینی:
 * تعرفه ماده 11 + 35%
 *
 * سقف نهایی:
 * 118,000,000 تومان
 *
 * ============================================================
 */

export function calculateArticle22Mining(
  input: Article22MiningInput
): Article22MiningResult {

  const {
    article11FeeToman,
    operationType
  } = input;


  validateArticle11Fee(
    article11FeeToman
  );


  /*
   * ==========================================================
   * معدن روباز
   * ==========================================================
   */

  if (
    operationType ===
    "SURFACE"
  ) {

    const feeBeforeMaximumToman =
      article11FeeToman;


    const maximumApplied =
      feeBeforeMaximumToman >
      ARTICLE22_MINING_MAXIMUM_FEE_TOMAN;


    const finalFeeToman =
      Math.min(
        feeBeforeMaximumToman,
        ARTICLE22_MINING_MAXIMUM_FEE_TOMAN
      );


    return {

      serviceType:
        "MINING_RESERVE_EVALUATION",

      article11FeeToman,

      operationType,

      undergroundIncreaseRate:
        0,

      undergroundIncreaseFeeToman:
        0,

      feeBeforeMaximumToman,

      maximumFeeToman:
        ARTICLE22_MINING_MAXIMUM_FEE_TOMAN,

      maximumApplied,

      finalFeeToman,

      title:
        ARTICLE22_MINING_TITLE

    };

  }


  /*
   * ==========================================================
   * معدن زیرزمینی
   * ==========================================================
   */

  if (
    operationType ===
    "UNDERGROUND"
  ) {

    const undergroundIncreaseFeeToman =
      article11FeeToman *
      ARTICLE22_UNDERGROUND_INCREASE_RATE;


    const feeBeforeMaximumToman =
      article11FeeToman +
      undergroundIncreaseFeeToman;


    const maximumApplied =
      feeBeforeMaximumToman >
      ARTICLE22_MINING_MAXIMUM_FEE_TOMAN;


    const finalFeeToman =
      Math.min(
        feeBeforeMaximumToman,
        ARTICLE22_MINING_MAXIMUM_FEE_TOMAN
      );


    return {

      serviceType:
        "MINING_RESERVE_EVALUATION",

      article11FeeToman,

      operationType,

      undergroundIncreaseRate:
        ARTICLE22_UNDERGROUND_INCREASE_RATE,

      undergroundIncreaseFeeToman,

      feeBeforeMaximumToman,

      maximumFeeToman:
        ARTICLE22_MINING_MAXIMUM_FEE_TOMAN,

      maximumApplied,

      finalFeeToman,

      title:
        ARTICLE22_MINING_TITLE

    };

  }


  /*
   * این قسمت در TypeScript عادی
   * نباید قابل دستیابی باشد.
   */

  throw new Error(
    "Invalid mining operation type."
  );

}