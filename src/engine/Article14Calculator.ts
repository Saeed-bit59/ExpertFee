/*
 * ==========================================
 * Article 14 Calculator
 * ==========================================
 *
 * ماده 14 تعرفه دستمزد کارشناسان رسمی
 *
 * موضوع:
 * تفسیر عکس های هوایی و ماهواره ای ارائه شده
 * برای هر پلاک ثبتی و تعیین موقعیت ثبتی آن
 * در عکس های مزبور.
 *
 * مبالغ تعرفه:
 *
 * 1- حق الزحمه پایه برای هر مورد:
 *    20,000,000 ریال
 *    = 2,000,000 تومان
 *
 * 2- تصاویر و عکس های مربوط به سال های گذشته:
 *    به ازای هر سال تصویر و عکس مورد اظهارنظر:
 *    10 درصد حق الزحمه ماده 14
 *
 * 3- پلاک های متعدد متصل به هم:
 *    به ازای هر پلاک اضافی:
 *    40 درصد حق الزحمه پایه این ردیف
 *
 * نکته:
 * تعداد پلاک اضافی، پلاک اصلی را شامل نمی شود.
 *
 * مثال:
 * additionalConnectedParcelCount = 2
 *
 * یعنی:
 * 1 پلاک اصلی + 2 پلاک اضافی
 * = مجموع 3 پلاک
 *
 * ==========================================
 */

import { TARIFF_1405 } from "../config/Tariff1405";

const ARTICLE14_TARIFF = TARIFF_1405.article14;

export const ARTICLE14_BASE_FEE_TOMAN = ARTICLE14_TARIFF.baseFeeToman;
export const ARTICLE14_PAST_YEAR_RATE = ARTICLE14_TARIFF.pastImageYearRate;
export const ARTICLE14_PAST_YEAR_FEE_TOMAN =
  ARTICLE14_BASE_FEE_TOMAN * ARTICLE14_PAST_YEAR_RATE;
export const ARTICLE14_ADDITIONAL_PARCEL_RATE =
  ARTICLE14_TARIFF.additionalConnectedParcelRate;
export const ARTICLE14_MAXIMUM_FEE_TOMAN =
  TARIFF_1405.ARTICLE11_GENERAL_MAXIMUM_TOMAN;


/*
 * ==========================================
 * Input
 * ==========================================
 */

export interface Article14CalculatorInput {

  /*
   * تعداد سال های تصویر و عکس
   * مورد اظهارنظر مربوط به سال های گذشته
   *
   * صفر یعنی هیچ تصویر مربوط به
   * سال های گذشته وجود ندارد.
   */

  pastImageYearCount:
    number;


  /*
   * آیا پلاک های اضافی متصل به هم
   * وجود دارد؟
   */

  hasAdditionalConnectedParcels:
    boolean;


  /*
   * تعداد پلاک های اضافی متصل
   *
   * این عدد شامل پلاک اصلی نیست.
   *
   * مثال:
   *
   * 0 = فقط یک پلاک اصلی
   *
   * 2 = یک پلاک اصلی
   *     + دو پلاک اضافی
   */

  additionalConnectedParcelCount:
    number;
}


/*
 * ==========================================
 * Result
 * ==========================================
 */

export interface Article14CalculatorResult {

  /*
   * حق الزحمه پایه
   */

  baseFeeToman:
    number;


  /*
   * تعداد سال های تصاویر گذشته
   */

  pastImageYearCount:
    number;


  /*
   * نرخ هر سال تصویر گذشته
   */

  pastImageYearFeePerYearToman:
    number;


  /*
   * مبلغ افزایشی بابت
   * تصاویر سال های گذشته
   */

  pastImagesAdditionalFeeToman:
    number;


  /*
   * آیا پلاک اضافی وجود دارد؟
   */

  hasAdditionalConnectedParcels:
    boolean;


  /*
   * تعداد پلاک های اضافی
   */

  additionalConnectedParcelCount:
    number;


  /*
   * تعداد کل پلاک ها
   *
   * یک پلاک اصلی
   * + پلاک های اضافی
   */

  totalParcelCount:
    number;


  /*
   * درصد افزایش هر پلاک اضافی
   */

  additionalParcelRate:
    number;


  /*
   * مبلغ افزایش برای
   * یک پلاک اضافی
   */

  additionalFeePerParcelToman:
    number;


  /*
   * کل مبلغ افزایش بابت
   * پلاک های اضافی
   */

  additionalParcelsFeeToman:
    number;


  /*
   * حق الزحمه نهایی ماده 14
   *
   * قبل از مأموریت
   */

  finalFeeToman:
    number;


  /*
   * عنوان محاسبه
   */

  calculationLabel:
    string;
}


/*
 * ==========================================
 * Validation Helpers
 * ==========================================
 */


/*
 * کنترل عدد صحیح غیرمنفی
 */

function validateNonNegativeInteger(
  value: number,
  fieldName: string
): void {

  if (
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 0
  ) {

    throw new Error(
      `${fieldName} must be a non-negative integer.`
    );
  }
}


/*
 * ==========================================
 * Main Calculator
 * ==========================================
 */

export function calculateArticle14(
  input: Article14CalculatorInput
): Article14CalculatorResult {

  const {

    pastImageYearCount,

    hasAdditionalConnectedParcels,

    additionalConnectedParcelCount

  } = input;


  /*
   * ========================================
   * Validation
   * ========================================
   */


  validateNonNegativeInteger(
    pastImageYearCount,
    "pastImageYearCount"
  );


  validateNonNegativeInteger(
    additionalConnectedParcelCount,
    "additionalConnectedParcelCount"
  );


  /*
   * اگر گزینه پلاک های اضافی
   * غیرفعال باشد، تعداد پلاک اضافی
   * در محاسبات صفر در نظر گرفته می شود.
   *
   * بنابراین حتی اگر UI به هر علت
   * مقدار قبلی را نگه داشته باشد،
   * Engine آن را اعمال نمی کند.
   */

  const effectiveAdditionalParcelCount =
    hasAdditionalConnectedParcels
      ? additionalConnectedParcelCount
      : 0;


  /*
   * ========================================
   * Base Fee
   * ========================================
   */

  const baseFeeToman =
    ARTICLE14_BASE_FEE_TOMAN;


  /*
   * ========================================
   * Past Images
   * ========================================
   *
   * به ازای هر سال تصویر و عکس
   * مورد اظهارنظر:
   *
   * 10 درصد حق‌الزحمه پایه
   */

  const pastImagesAdditionalFeeToman =
    pastImageYearCount *
    ARTICLE14_PAST_YEAR_FEE_TOMAN;


  /*
   * ========================================
   * Additional Connected Parcels
   * ========================================
   *
   * برای هر پلاک اضافی:
   *
   * 40 درصد مبلغ پایه
   */

  const additionalFeePerParcelToman =
    baseFeeToman *
    ARTICLE14_ADDITIONAL_PARCEL_RATE;


  /*
   * کل افزایش بابت پلاک های اضافی
   */

  const additionalParcelsFeeToman =
    effectiveAdditionalParcelCount *
    additionalFeePerParcelToman;


  /*
   * ========================================
   * Total Parcel Count
   * ========================================
   *
   * همیشه یک پلاک اصلی وجود دارد.
   */

  const totalParcelCount =
    1 +
    effectiveAdditionalParcelCount;


  /*
   * ========================================
   * Final Article 14 Fee
   * ========================================
   */

  const calculatedFeeToman =
    baseFeeToman +
    pastImagesAdditionalFeeToman +
    additionalParcelsFeeToman;

  const finalFeeToman =
    Math.min(
      calculatedFeeToman,
      ARTICLE14_MAXIMUM_FEE_TOMAN
    );


  /*
   * ========================================
   * Result
   * ========================================
   */

  return {

    baseFeeToman,

    pastImageYearCount,

    pastImageYearFeePerYearToman:
      ARTICLE14_PAST_YEAR_FEE_TOMAN,

    pastImagesAdditionalFeeToman,

    hasAdditionalConnectedParcels,

    additionalConnectedParcelCount:
      effectiveAdditionalParcelCount,

    totalParcelCount,

    additionalParcelRate:
      ARTICLE14_ADDITIONAL_PARCEL_RATE,

    additionalFeePerParcelToman,

    additionalParcelsFeeToman,

    finalFeeToman,

    calculationLabel:
      "محاسبه حق‌الزحمه تفسیر عکس‌های هوایی و ماهواره‌ای موضوع ماده ۱۴ تعرفه ۱۴۰۵"

  };
}
