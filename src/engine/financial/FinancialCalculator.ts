import {
  ARTICLE25_INCREASE_RATE,
  FINANCIAL_MAXIMUM_FEE_TOMAN,
  FINANCIAL_MINIMUM_FEE_TOMAN,
  FIELD_TITLES,
  ACCOUNTING_SUBJECT_TITLES
} from "./FinancialRules";

import type {
  FinancialCalculationInput,
  FinancialCalculationResult
} from "./FinancialTypes";


function validateFee(
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


function applyLimits(
  value: number
): {
  finalFeeToman: number;
  minimumApplied: boolean;
  maximumApplied: boolean;
} {

  return {

    finalFeeToman:
      Math.min(
        Math.max(
          value,
          FINANCIAL_MINIMUM_FEE_TOMAN
        ),
        FINANCIAL_MAXIMUM_FEE_TOMAN
      ),

    minimumApplied:
      value <
      FINANCIAL_MINIMUM_FEE_TOMAN,

    maximumApplied:
      value >
      FINANCIAL_MAXIMUM_FEE_TOMAN

  };

}


export function calculateFinancialAffairs(
  input: FinancialCalculationInput
): FinancialCalculationResult {

  validateFee(
    input.article11FeeToman
  );


  let articleNumber:
    number;

  let subjectTitle:
    string;

  let increaseRate =
    0;


  switch (input.field) {

    /*
     * ========================================================
     * Accounting and Auditing
     * Articles 25 and 26
     * ========================================================
     */

    case "ACCOUNTING_AUDITING": {

      if (!input.accountingMode) {

        throw new Error(
          "accountingMode is required."
        );

      }


      subjectTitle =
        ACCOUNTING_SUBJECT_TITLES[
          input.accountingMode
        ];


      if (
        input.accountingMode ===
        "ARTICLE_25_AUDITING"
      ) {

        articleNumber =
          25;

        increaseRate =
          ARTICLE25_INCREASE_RATE;

      } else {

        articleNumber =
          26;

      }


      break;

    }


    /*
     * ========================================================
     * Commercial Affairs
     * Article 27
     * Only valuation is implemented.
     * ========================================================
     */

    case "COMMERCIAL_AFFAIRS": {

      articleNumber =
        27;

      subjectTitle =
        "ارزیابی";

      break;

    }


    /*
     * ========================================================
     * Alimony
     * Article 28
     *
     * This is intentionally treated as one item.
     * ========================================================
     */

    case "ALIMONY": {

      articleNumber =
        28;

      subjectTitle =
        "تعیین نفقه";

      break;

    }


    /*
     * ========================================================
     * Monetary and Credit Investment
     * Article 29
     * Only valuation is implemented.
     * ========================================================
     */

    case "MONETARY_CREDIT_INVESTMENT": {

      articleNumber =
        29;

      subjectTitle =
        "ارزیابی";

      break;

    }


    /*
     * ========================================================
     * Insurance
     * Article 29
     * Only valuation is implemented.
     * ========================================================
     */

    case "INSURANCE": {

      articleNumber =
        29;

      subjectTitle =
        "ارزیابی";

      break;

    }


    default: {

      const exhaustiveCheck:
        never =
        input.field;

      throw new Error(
        `Invalid financial field: ${exhaustiveCheck}`
      );

    }

  }


  const increaseFeeToman =
    input.article11FeeToman *
    increaseRate;


  const feeBeforeLimitsToman =
    input.article11FeeToman +
    increaseFeeToman;


  const limits =
    applyLimits(
      feeBeforeLimitsToman
    );


  return {

    field:
      input.field,

    article11FeeToman:
      input.article11FeeToman,

    increaseRate,

    increaseFeeToman,

    feeBeforeLimitsToman,

    minimumFeeToman:
      FINANCIAL_MINIMUM_FEE_TOMAN,

    maximumFeeToman:
      FINANCIAL_MAXIMUM_FEE_TOMAN,

    minimumApplied:
      limits.minimumApplied,

    maximumApplied:
      limits.maximumApplied,

    finalFeeToman:
      limits.finalFeeToman,

    articleNumber,

    fieldTitle:
      FIELD_TITLES[
        input.field
      ],

    subjectTitle

  };

}