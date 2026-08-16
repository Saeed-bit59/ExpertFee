export interface Article11Note1Input {
  evaluationValueToman: number;
  applyFiftyPercentIncrease: boolean;
  expertCount?: number;
}

export interface Article11Note1Result {
  evaluationValueToman: number;

  applicable: boolean;

  rawFormulaFee: number;

  feeBeforeFiftyPercent: number;

  fiftyPercentIncreaseAmount: number;

  rawFeeAfterFiftyPercent: number;

  feePerExpert: number;

  expertCount: number;

  totalPanelFee: number;

  fiftyPercentApplied: boolean;

  cappedBeforeIncrease: boolean;

  cappedAfterIncrease: boolean;

  sameFieldThirtyPercentReductionApplied: false;

  warning: string;

  calculationLabel: string;
}

/*
 * Article 11 - Note 1
 *
 * All monetary values in this module are TOMAN.
 */

export const NOTE1_THRESHOLD_TOMAN =
  5_000_000_000_000;

export const NOTE1_ALPHA_TOMAN =
  5_000_000_000_000;

export const NOTE1_BETA_TOMAN =
  238_000_000_000_000;

export const ARTICLE11_STANDARD_CAP_TOMAN =
  118_000_000;

export const NOTE1_MAX_FEE_PER_EXPERT_TOMAN =
  800_000_000;

const NOTE1_WARNING =
  "مبلغ ارزیابی بیش از ۵ همت تومان است. " +
  "محاسبه دستمزد مشمول تبصره یک ماده ۱۱ بوده " +
  "و پرداخت آن با احتساب مصوبه شورای عالی کارشناسان مرکز انجام می‌شود.";

const NOTE1_LABEL =
  "محاسبه دستمزد براساس تبصره یک ماده ۱۱";

export function isArticle11Note1Applicable(
  evaluationValueToman: number
): boolean {

  return (
    evaluationValueToman >
    NOTE1_THRESHOLD_TOMAN
  );
}

export function calculateArticle11Note1(
  input: Article11Note1Input
): Article11Note1Result {

  const {
    evaluationValueToman,
    applyFiftyPercentIncrease
  } = input;

  const expertCount =
    input.expertCount ?? 1;

  if (
    !Number.isFinite(evaluationValueToman) ||
    evaluationValueToman <=
      NOTE1_THRESHOLD_TOMAN
  ) {
    throw new Error(
      "Article 11 Note 1 applies only to evaluation values above 5 HEMMAT."
    );
  }

  if (
    !Number.isInteger(expertCount) ||
    expertCount < 1
  ) {
    throw new Error(
      "Expert count must be a positive integer."
    );
  }

  const x = evaluationValueToman;
  const alpha = NOTE1_ALPHA_TOMAN;
  const beta = NOTE1_BETA_TOMAN;
  const A = ARTICLE11_STANDARD_CAP_TOMAN;
  const Wmax =
    NOTE1_MAX_FEE_PER_EXPERT_TOMAN;

  /*
   * Formula:
   *
   * W =
   * sqrt((x - alpha) / beta) * (Wmax - A)
   * +
   * ((x - alpha) / x)^2 * A
   * +
   * A
   */

  const rawFormulaFee =
    Math.sqrt(
      (x - alpha) / beta
    ) *
      (Wmax - A)
    +
    Math.pow(
      (x - alpha) / x,
      2
    ) *
      A
    +
    A;

  /*
   * First cap:
   * Base result cannot exceed
   * 800,000,000 Toman per expert.
   */

  const feeBeforeFiftyPercent =
    Math.min(
      rawFormulaFee,
      Wmax
    );

  const cappedBeforeIncrease =
    rawFormulaFee > Wmax;

  /*
   * Optional 50% increase.
   * Applied only when explicitly selected.
   */

  const fiftyPercentIncreaseAmount =
    applyFiftyPercentIncrease
      ? feeBeforeFiftyPercent * 0.5
      : 0;

  const rawFeeAfterFiftyPercent =
    feeBeforeFiftyPercent +
    fiftyPercentIncreaseAmount;

  /*
   * Second cap:
   * Even after +50%, each expert
   * cannot receive more than
   * 800,000,000 Toman.
   */

  const feePerExpert =
    Math.min(
      rawFeeAfterFiftyPercent,
      Wmax
    );

  const cappedAfterIncrease =
    rawFeeAfterFiftyPercent > Wmax;

  /*
   * IMPORTANT:
   *
   * For Note 1 cases, the 30% reduction
   * for multiple same-field experts
   * is NOT applied.
   *
   * Every expert receives the full
   * calculated fee.
   */

  const totalPanelFee =
    feePerExpert * expertCount;

  return {
    evaluationValueToman,

    applicable: true,

    rawFormulaFee:
      Math.round(rawFormulaFee),

    feeBeforeFiftyPercent:
      Math.round(
        feeBeforeFiftyPercent
      ),

    fiftyPercentIncreaseAmount:
      Math.round(
        fiftyPercentIncreaseAmount
      ),

    rawFeeAfterFiftyPercent:
      Math.round(
        rawFeeAfterFiftyPercent
      ),

    feePerExpert:
      Math.round(feePerExpert),

    expertCount,

    totalPanelFee:
      Math.round(totalPanelFee),

    fiftyPercentApplied:
      applyFiftyPercentIncrease,

    cappedBeforeIncrease,

    cappedAfterIncrease,

    sameFieldThirtyPercentReductionApplied:
      false,

    warning:
      NOTE1_WARNING,

    calculationLabel:
      NOTE1_LABEL
  };
}