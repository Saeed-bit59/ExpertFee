/*
 * ==========================================
 * ماده 13
 * محاسبه دستمزد تعیین اجاره‌بها
 * تعرفه اصلاحی 1402
 * ==========================================
 *
 * تمام مبالغ داخلی این ماژول به تومان هستند.
 */


/*
 * ==========================================
 * ثابت‌های تعرفه
 * ==========================================
 */

export const ARTICLE13_LIMIT_1_TOMAN =
  1_500_000;

export const ARTICLE13_LIMIT_2_TOMAN =
  5_000_000;

export const ARTICLE13_LIMIT_3_TOMAN =
  10_000_000;


/*
 * دستمزد مقطوع مرحله اول
 *
 * 6,000,000 ریال
 * =
 * 600,000 تومان
 */

export const ARTICLE13_BASE_FEE_TOMAN =
  600_000;


/*
 * درصدهای مراحل بعد
 */

export const ARTICLE13_RATE_2 =
  0.20;

export const ARTICLE13_RATE_3 =
  0.10;

export const ARTICLE13_RATE_4 =
  0.04;


/*
 * سقف دستمزد
 *
 * 600,000,000 ریال
 * =
 * 60,000,000 تومان
 */

export const ARTICLE13_MAXIMUM_FEE_TOMAN =
  60_000_000;


/*
 * ==========================================
 * ورودی
 * ==========================================
 */

export interface Article13Input {

  /*
   * اجاره ماهانه هر واحد
   * یا مجموعه مستقل
   */
  monthlyRentToman: number;
}


/*
 * ==========================================
 * خروجی
 * ==========================================
 */

export interface Article13Result {

  monthlyRentToman: number;

  /*
   * دستمزد قبل از کنترل سقف
   */
  calculatedFeeToman: number;

  /*
   * دستمزد نهایی
   */
  finalFeeToman: number;

  /*
   * آیا سقف اعمال شده؟
   */
  capped: boolean;

  maximumFeeToman: number;

  calculationLabel: string;
}


/*
 * ==========================================
 * Calculator
 * ==========================================
 */

export function calculateArticle13(
  input: Article13Input
): Article13Result {

  const {
    monthlyRentToman
  } = input;


  /*
   * ========================================
   * Validation
   * ========================================
   */

  if (
    !Number.isFinite(monthlyRentToman) ||
    monthlyRentToman < 0
  ) {

    throw new Error(
      "Monthly rent must be a non-negative number."
    );
  }


  let calculatedFeeToman = 0;


  /*
   * ========================================
   * مرحله اول
   *
   * تا 1,500,000 تومان
   * دستمزد مقطوع 600,000 تومان
   * ========================================
   */

  if (
    monthlyRentToman <=
    ARTICLE13_LIMIT_1_TOMAN
  ) {

    calculatedFeeToman =
      ARTICLE13_BASE_FEE_TOMAN;

  }


  /*
   * ========================================
   * مرحله دوم
   *
   * مازاد 1,500,000
   * تا 5,000,000 تومان
   *
   * 20 درصد
   * ========================================
   */

  else if (
    monthlyRentToman <=
    ARTICLE13_LIMIT_2_TOMAN
  ) {

    const excess =
      monthlyRentToman -
      ARTICLE13_LIMIT_1_TOMAN;

    calculatedFeeToman =
      ARTICLE13_BASE_FEE_TOMAN +
      excess *
      ARTICLE13_RATE_2;

  }


  /*
   * ========================================
   * مرحله سوم
   *
   * مازاد 5,000,000
   * تا 10,000,000 تومان
   *
   * 10 درصد
   * ========================================
   */

  else if (
    monthlyRentToman <=
    ARTICLE13_LIMIT_3_TOMAN
  ) {

    const secondTierFee =
      (
        ARTICLE13_LIMIT_2_TOMAN -
        ARTICLE13_LIMIT_1_TOMAN
      ) *
      ARTICLE13_RATE_2;


    const excess =
      monthlyRentToman -
      ARTICLE13_LIMIT_2_TOMAN;


    calculatedFeeToman =
      ARTICLE13_BASE_FEE_TOMAN +
      secondTierFee +
      excess *
      ARTICLE13_RATE_3;

  }


  /*
   * ========================================
   * مرحله چهارم
   *
   * مازاد بر 10,000,000 تومان
   *
   * 4 درصد
   * ========================================
   */

  else {

    const secondTierFee =
      (
        ARTICLE13_LIMIT_2_TOMAN -
        ARTICLE13_LIMIT_1_TOMAN
      ) *
      ARTICLE13_RATE_2;


    const thirdTierFee =
      (
        ARTICLE13_LIMIT_3_TOMAN -
        ARTICLE13_LIMIT_2_TOMAN
      ) *
      ARTICLE13_RATE_3;


    const excess =
      monthlyRentToman -
      ARTICLE13_LIMIT_3_TOMAN;


    calculatedFeeToman =
      ARTICLE13_BASE_FEE_TOMAN +
      secondTierFee +
      thirdTierFee +
      excess *
      ARTICLE13_RATE_4;

  }


  /*
   * ========================================
   * کنترل سقف
   * ========================================
   */

  const capped =
    calculatedFeeToman >
    ARTICLE13_MAXIMUM_FEE_TOMAN;


  const finalFeeToman =
    Math.min(
      calculatedFeeToman,
      ARTICLE13_MAXIMUM_FEE_TOMAN
    );


  /*
   * ========================================
   * Result
   * ========================================
   */

  return {

    monthlyRentToman,

    calculatedFeeToman,

    finalFeeToman,

    capped,

    maximumFeeToman:
      ARTICLE13_MAXIMUM_FEE_TOMAN,

    calculationLabel:
      "محاسبه دستمزد تعیین اجاره‌بها مطابق ماده 13 تعرفه"

  };
}