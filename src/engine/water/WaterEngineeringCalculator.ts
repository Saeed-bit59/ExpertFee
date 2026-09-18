/*
 * ============================================================
 * Water Engineering Calculator
 * فصل دوم - گروه 1 - رشته مهندسی آب
 *
 * مواد 15 تا 21
 * ============================================================
 */


/*
 * ============================================================
 * ARTICLE 15
 * اندازه گیری آب و حقابه ها
 * ============================================================
 */

export const ARTICLE15_FIRST_LIMIT_LPS =
  50;

export const ARTICLE15_SECOND_LIMIT_LPS =
  1000;

export const ARTICLE15_BASE_FEE_TOMAN =
  2_000_000;

export const ARTICLE15_SECOND_RATE_TOMAN =
  600;

export const ARTICLE15_THIRD_RATE_TOMAN =
  300;

export const ARTICLE15_MAXIMUM_FEE_TOMAN =
  9_000_000;


export interface Article15Input {
  flowRateLps: number;
}


export interface Article15Result {

  flowRateLps: number;

  baseFeeToman: number;

  secondTierQuantityLps: number;

  secondTierFeeToman: number;

  thirdTierQuantityLps: number;

  thirdTierFeeToman: number;

  feeBeforeCapToman: number;

  maximumFeeToman: number;

  capped: boolean;

  finalFeeToman: number;

  calculationLabel: string;
}


function validatePositiveNumber(
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


function validateNonNegativeNumber(
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


export function calculateArticle15(
  input: Article15Input
): Article15Result {

  const {
    flowRateLps
  } = input;


  validatePositiveNumber(
    flowRateLps,
    "flowRateLps"
  );


  /*
   * تا 50 لیتر در ثانیه:
   * 2,000,000 تومان مقطوع
   */

  const baseFeeToman =
    ARTICLE15_BASE_FEE_TOMAN;


  /*
   * مازاد بر 50 تا 1000
   */

  const secondTierQuantityLps =
    Math.max(
      0,
      Math.min(
        flowRateLps,
        ARTICLE15_SECOND_LIMIT_LPS
      ) -
      ARTICLE15_FIRST_LIMIT_LPS
    );


  const secondTierFeeToman =
    secondTierQuantityLps *
    ARTICLE15_SECOND_RATE_TOMAN;


  /*
   * مازاد بر 1000
   */

  const thirdTierQuantityLps =
    Math.max(
      0,
      flowRateLps -
      ARTICLE15_SECOND_LIMIT_LPS
    );


  const thirdTierFeeToman =
    thirdTierQuantityLps *
    ARTICLE15_THIRD_RATE_TOMAN;


  const feeBeforeCapToman =
    baseFeeToman +
    secondTierFeeToman +
    thirdTierFeeToman;


  const capped =
    feeBeforeCapToman >
    ARTICLE15_MAXIMUM_FEE_TOMAN;


  const finalFeeToman =
    Math.min(
      feeBeforeCapToman,
      ARTICLE15_MAXIMUM_FEE_TOMAN
    );


  return {

    flowRateLps,

    baseFeeToman,

    secondTierQuantityLps,

    secondTierFeeToman,

    thirdTierQuantityLps,

    thirdTierFeeToman,

    feeBeforeCapToman,

    maximumFeeToman:
      ARTICLE15_MAXIMUM_FEE_TOMAN,

    capped,

    finalFeeToman,

    calculationLabel:
      "اندازه‌گیری آب و حقابه‌ها - ماده ۱۵"

  };

}


/*
 * ============================================================
 * FIXED FEE ARTICLES
 *
 * مواد 16، 17، 19 و 21
 * ============================================================
 */

export type WaterFixedFeeArticle =
  | 16
  | 17
  | 19
  | 21;


export interface WaterFixedFeeResult {

  articleNumber:
    WaterFixedFeeArticle;

  title:
    string;

  feeToman:
    number;

  finalFeeToman:
    number;

  calculationLabel:
    string;
}


export const WATER_FIXED_FEES = {

  16: {

    title:
      "تعیین کیفیت شیمیایی و آلودگی آب",

    feeToman:
      2_000_000

  },

  17: {

    title:
      "بررسی فنی و تعیین مشخصات سفره‌های سطحی و زیرزمینی آب",

    feeToman:
      3_000_000

  },

  19: {

    title:
      "تعیین نوع و بررسی کیفیت حفاری چاه‌ها و قنوات و بهسازی چشمه‌ها",

    feeToman:
      3_000_000

  },

  21: {

    title:
      "رسیدگی به وضع پس‌آب‌ها به لحاظ تشخیص بار آلودگی",

    feeToman:
      2_000_000

  }

} as const;


export function calculateWaterFixedFee(
  articleNumber:
    WaterFixedFeeArticle
): WaterFixedFeeResult {

  const definition =
    WATER_FIXED_FEES[
      articleNumber
    ];


  return {

    articleNumber,

    title:
      definition.title,

    feeToman:
      definition.feeToman,

    finalFeeToman:
      definition.feeToman,

    calculationLabel:
      `محاسبه حق‌الزحمه ماده ${articleNumber}`

  };

}


/*
 * ============================================================
 * ARTICLE 18
 *
 * ارجاع به ماده 11
 * ============================================================
 */

export interface Article18Result {

  articleNumber: 18;

  title: string;

  usesArticle11: true;

  calculationLabel: string;
}


export function getArticle18Definition():
  Article18Result {

  return {

    articleNumber:
      18,

    title:
      "ارزیابی قنوات، چاه‌ها و منصوبات آن، شبکه‌های آبیاری و زهکشی آب و فاضلاب",

    usesArticle11:
      true,

    calculationLabel:
      "محاسبه دستمزد ماده ۱۸ مطابق ماده ۱۱ تعرفه"

  };

}


/*
 * ============================================================
 * ARTICLE 20
 * ============================================================
 */

export type Article20Mode =

  | "CHANNEL_UP_TO_12M"

  | "RIVER_OR_CHANNEL_OVER_12M"

  | "WATER_RIGHT"

  | "WATER_SOURCE_AGE";


export const ARTICLE20_UP_TO_12_RATE_TOMAN_PER_KM =
  2_000_000;

export const ARTICLE20_UP_TO_12_MINIMUM_TOMAN =
  2_000_000;

export const ARTICLE20_UP_TO_12_MAXIMUM_TOMAN =
  8_000_000;


export const ARTICLE20_OVER_12_RATE_TOMAN_PER_KM =
  2_000_000;

export const ARTICLE20_OVER_12_MAXIMUM_TOMAN =
  12_000_000;


export const ARTICLE20_WATER_RIGHT_FEE_TOMAN =
  2_000_000;

export const ARTICLE20_WATER_SOURCE_AGE_FEE_TOMAN =
  2_000_000;


export interface Article20Input {

  mode:
    Article20Mode;

  lengthKm?:
    number;
}


export interface Article20Result {

  mode:
    Article20Mode;

  title:
    string;

  lengthKm:
    number | null;

  rateTomanPerKm:
    number | null;

  minimumFeeToman:
    number | null;

  maximumFeeToman:
    number | null;

  feeBeforeLimitsToman:
    number;

  minimumApplied:
    boolean;

  maximumApplied:
    boolean;

  finalFeeToman:
    number;

  calculationLabel:
    string;
}


export function calculateArticle20(
  input: Article20Input
): Article20Result {

  const {
    mode
  } = input;


  /*
   * ------------------------------------------
   * حقابه هر فرد
   * ------------------------------------------
   */

  if (
    mode ===
    "WATER_RIGHT"
  ) {

    return {

      mode,

      title:
        "تعیین میزان حقابه هر فرد از منابع آبی",

      lengthKm:
        null,

      rateTomanPerKm:
        null,

      minimumFeeToman:
        null,

      maximumFeeToman:
        null,

      feeBeforeLimitsToman:
        ARTICLE20_WATER_RIGHT_FEE_TOMAN,

      minimumApplied:
        false,

      maximumApplied:
        false,

      finalFeeToman:
        ARTICLE20_WATER_RIGHT_FEE_TOMAN,

      calculationLabel:
        "تعیین میزان حقابه هر فرد - تبصره ماده ۱۸"

    };

  }


  /*
   * ------------------------------------------
   * قدمت منابع آبی
   * ------------------------------------------
   */

  if (
    mode ===
    "WATER_SOURCE_AGE"
  ) {

    return {

      mode,

      title:
        "تعیین قدمت منابع آبی",

      lengthKm:
        null,

      rateTomanPerKm:
        null,

      minimumFeeToman:
        null,

      maximumFeeToman:
        null,

      feeBeforeLimitsToman:
        ARTICLE20_WATER_SOURCE_AGE_FEE_TOMAN,

      minimumApplied:
        false,

      maximumApplied:
        false,

      finalFeeToman:
        ARTICLE20_WATER_SOURCE_AGE_FEE_TOMAN,

      calculationLabel:
        "تعیین قدمت منابع آبی - تبصره ماده ۱۸"

    };

  }


  /*
   * دو حالت طولی ماده 20
   */

  const lengthKm =
    input.lengthKm;


  if (
    lengthKm === undefined
  ) {

    throw new Error(
      "lengthKm is required for Article 20 length-based calculations."
    );

  }


  validateNonNegativeNumber(
    lengthKm,
    "lengthKm"
  );


  /*
   * ------------------------------------------
   * کانال و انهار تا عرض بستر 12 متر
   * ------------------------------------------
   */

  if (
    mode ===
    "CHANNEL_UP_TO_12M"
  ) {

    const feeBeforeLimitsToman =
      lengthKm *
      ARTICLE20_UP_TO_12_RATE_TOMAN_PER_KM;


    const afterMinimum =
      Math.max(
        feeBeforeLimitsToman,
        ARTICLE20_UP_TO_12_MINIMUM_TOMAN
      );


    const finalFeeToman =
      Math.min(
        afterMinimum,
        ARTICLE20_UP_TO_12_MAXIMUM_TOMAN
      );


    return {

      mode,

      title:
        "تعیین حریم کانال‌ها و انهار تا عرض بستر ۱۲ متر",

      lengthKm,

      rateTomanPerKm:
        ARTICLE20_UP_TO_12_RATE_TOMAN_PER_KM,

      minimumFeeToman:
        ARTICLE20_UP_TO_12_MINIMUM_TOMAN,

      maximumFeeToman:
        ARTICLE20_UP_TO_12_MAXIMUM_TOMAN,

      feeBeforeLimitsToman,

      minimumApplied:
        feeBeforeLimitsToman <
        ARTICLE20_UP_TO_12_MINIMUM_TOMAN,

      maximumApplied:
        afterMinimum >
        ARTICLE20_UP_TO_12_MAXIMUM_TOMAN,

      finalFeeToman,

      calculationLabel:
        "تعیین حریم کانال‌ها و انهار تا عرض بستر ۱۲ متر - ماده ۲۰"

    };

  }


  /*
   * ------------------------------------------
   * رودخانه و کانال بیش از 12 متر
   * ------------------------------------------
   */

  if (
    mode ===
    "RIVER_OR_CHANNEL_OVER_12M"
  ) {

    const feeBeforeLimitsToman =
      lengthKm *
      ARTICLE20_OVER_12_RATE_TOMAN_PER_KM;


    const finalFeeToman =
      Math.min(
        feeBeforeLimitsToman,
        ARTICLE20_OVER_12_MAXIMUM_TOMAN
      );


    return {

      mode,

      title:
        "تعیین حریم رودخانه و کانال‌های با عرض بیش از ۱۲ متر",

      lengthKm,

      rateTomanPerKm:
        ARTICLE20_OVER_12_RATE_TOMAN_PER_KM,

      minimumFeeToman:
        null,

      maximumFeeToman:
        ARTICLE20_OVER_12_MAXIMUM_TOMAN,

      feeBeforeLimitsToman,

      minimumApplied:
        false,

      maximumApplied:
        feeBeforeLimitsToman >
        ARTICLE20_OVER_12_MAXIMUM_TOMAN,

      finalFeeToman,

      calculationLabel:
        "تعیین حریم رودخانه و کانال‌های با عرض بیش از ۱۲ متر - ماده ۲۰"

    };

  }


  throw new Error(
    "Invalid Article 20 mode."
  );

}

export type Article18NoteMode =
  | "WATER_RIGHT"
  | "WATER_SOURCE_AGE";

export const ARTICLE18_NOTE_FIXED_FEE_TOMAN =
  2_000_000;

export function calculateArticle18Note(
  mode: Article18NoteMode
): {
  mode: Article18NoteMode;
  title: string;
  finalFeeToman: number;
  calculationLabel: string;
} {
  const isWaterRight = mode === "WATER_RIGHT";

  return {
    mode,
    title: isWaterRight
      ? "تعیین میزان حقابه هر فرد از منابع آبی"
      : "تعیین قدمت منابع آبی",
    finalFeeToman: ARTICLE18_NOTE_FIXED_FEE_TOMAN,
    calculationLabel: isWaterRight
      ? "تعیین میزان حقابه هر فرد - تبصره ماده ۱۸"
      : "تعیین قدمت منابع آبی - تبصره ماده ۱۸"
  };
}
