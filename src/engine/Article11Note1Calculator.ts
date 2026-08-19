export interface Article11Note1Input {
  evaluationValueToman: number;
  /** برای سازگاری فراخوانی‌های قدیمی؛ تعرفه ۱۴۰۵ ضریب خودکار تعریف نمی‌کند. */
  applyFiftyPercentIncrease?: boolean;
  expertCount?: number;
}

export interface Article11Note1Result {
  evaluationValueToman: number;
  applicable: true;
  requiresCouncilDecision: true;
  statutoryMaximumFeePerExpertToman: number;
  expertCount: number;
  warning: string;
  calculationLabel: string;
}

/** ۵۰ هزار میلیارد ریال، معادل ۵ همت تومان. */
export const NOTE1_THRESHOLD_TOMAN =
  5_000_000_000_000;

/** سقف مندرج در تبصره ۱ ماده ۱۱: سه میلیارد ریال. */
export const NOTE1_STATUTORY_MAXIMUM_FEE_TOMAN =
  300_000_000;

export const NOTE1_COUNCIL_WARNING =
  "این ارزیابی مشمول تبصره ۱ ماده ۱۱ است. تعیین کارشناس، میزان دستمزد و روش پرداخت باید توسط شورای عالی کارشناسان یا مرکز انجام شود؛ نرم‌افزار برای این مورد مبلغ قطعی محاسبه نمی‌کند.";

export const NOTE1_CALCULATION_LABEL =
  "ارجاع برای تعیین دستمزد طبق تبصره ۱ ماده ۱۱";

export function isArticle11Note1Applicable(
  evaluationValueToman: number,
): boolean {
  return (
    Number.isFinite(evaluationValueToman) &&
    evaluationValueToman >= NOTE1_THRESHOLD_TOMAN
  );
}

/**
 * این تابع عمداً فقط وضعیت ارجاع را برمی‌گرداند. متن تعرفه ۱۴۰۵
 * فرمول عددی برای این بازه تعیین نکرده و تصمیم را به شورا/مرکز سپرده است.
 */
export function calculateArticle11Note1(
  input: Article11Note1Input,
): Article11Note1Result {
  const { evaluationValueToman } = input;
  const expertCount = input.expertCount ?? 1;

  if (!isArticle11Note1Applicable(evaluationValueToman)) {
    throw new Error(
      "تبصره ۱ ماده ۱۱ برای ارزش ۵ همت تومان یا بیشتر اعمال می‌شود.",
    );
  }

  if (!Number.isInteger(expertCount) || expertCount < 1) {
    throw new Error("تعداد کارشناسان باید عدد صحیح مثبت باشد.");
  }

  return {
    evaluationValueToman,
    applicable: true,
    requiresCouncilDecision: true,
    statutoryMaximumFeePerExpertToman:
      NOTE1_STATUTORY_MAXIMUM_FEE_TOMAN,
    expertCount,
    warning: NOTE1_COUNCIL_WARNING,
    calculationLabel: NOTE1_CALCULATION_LABEL,
  };
}
