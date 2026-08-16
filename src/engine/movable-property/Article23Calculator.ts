import {
  ARTICLE23_MINIMUM_FEE_TOMAN,
  ARTICLE23_MAXIMUM_FEE_TOMAN,
  ARTICLE23_HOUSEHOLD_OFFICE_INCREASE_RATE,
  ARTICLE23_MOVABLE_PROPERTY_TITLE,
  ARTICLE23_HOUSEHOLD_OFFICE_TITLE
} from "./Article23Rules";

import type {
  Article23Input,
  Article23Result
} from "./Article23Types";


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


export function calculateArticle23(
  input: Article23Input
): Article23Result {

  const {
    article11FeeToman,
    mode
  } = input;


  validateArticle11Fee(
    article11FeeToman
  );


  /*
   * ==========================================================
   * اموال منقول
   *
   * عین دستمزد ماده 11
   * ==========================================================
   */

  if (
    mode === "MOVABLE_PROPERTY"
  ) {

    const feeBeforeLimitsToman =
      article11FeeToman;


    const finalFeeToman =
      Math.min(
        Math.max(
          feeBeforeLimitsToman,
          ARTICLE23_MINIMUM_FEE_TOMAN
        ),
        ARTICLE23_MAXIMUM_FEE_TOMAN
      );


    return {

      mode,

      article11FeeToman,

      increaseRate:
        0,

      increaseFeeToman:
        0,

      feeBeforeLimitsToman,

      minimumFeeToman:
        ARTICLE23_MINIMUM_FEE_TOMAN,

      maximumFeeToman:
        ARTICLE23_MAXIMUM_FEE_TOMAN,

      minimumApplied:
        feeBeforeLimitsToman <
        ARTICLE23_MINIMUM_FEE_TOMAN,

      maximumApplied:
        feeBeforeLimitsToman >
        ARTICLE23_MAXIMUM_FEE_TOMAN,

      finalFeeToman,

      title:
        ARTICLE23_MOVABLE_PROPERTY_TITLE

    };

  }


  /*
   * ==========================================================
   * لوازم خانگی و اداری
   *
   * ماده 11 + 20%
   * سپس کنترل کف و سقف
   * ==========================================================
   */

  if (
    mode === "HOUSEHOLD_OFFICE"
  ) {

    const increaseFeeToman =
      article11FeeToman *
      ARTICLE23_HOUSEHOLD_OFFICE_INCREASE_RATE;


    const feeBeforeLimitsToman =
      article11FeeToman +
      increaseFeeToman;


    const finalFeeToman =
      Math.min(
        Math.max(
          feeBeforeLimitsToman,
          ARTICLE23_MINIMUM_FEE_TOMAN
        ),
        ARTICLE23_MAXIMUM_FEE_TOMAN
      );


    return {

      mode,

      article11FeeToman,

      increaseRate:
        ARTICLE23_HOUSEHOLD_OFFICE_INCREASE_RATE,

      increaseFeeToman,

      feeBeforeLimitsToman,

      minimumFeeToman:
        ARTICLE23_MINIMUM_FEE_TOMAN,

      maximumFeeToman:
        ARTICLE23_MAXIMUM_FEE_TOMAN,

      minimumApplied:
        feeBeforeLimitsToman <
        ARTICLE23_MINIMUM_FEE_TOMAN,

      maximumApplied:
        feeBeforeLimitsToman >
        ARTICLE23_MAXIMUM_FEE_TOMAN,

      finalFeeToman,

      title:
        ARTICLE23_HOUSEHOLD_OFFICE_TITLE

    };

  }


  throw new Error(
    "Invalid Article 23 mode."
  );

}