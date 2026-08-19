/*
 * ==========================================
 * ضرایب افزایشی ماده 11
 *
 * تبصره‌های ۳، ۴ و ۵ ماده ۱۱
 * ==========================================
 *
 * مسئولیت تشخیص شمول هر تبصره بر عهده کاربر است.
 *
 * این ماژول:
 *
 * 1- دستمزد مبنا را دریافت می‌کند.
 * 2- ضریب افزایشی انتخاب‌شده را اعمال می‌کند.
 * 3- سقف قانونی ماده 11 را کنترل می‌کند.
 * 4- دستمزد نهایی قابل پرداخت را برمی‌گرداند.
 */


/*
 * سقف ماده 11
 *
 * 1,350,000,000 ریال
 * =
 * 135,000,000 تومان
 */

export const ARTICLE11_MAXIMUM_FEE_TOMAN =
  135_000_000;


/*
 * ==========================================
 * کد Ruleها
 * ==========================================
 */

export type Article11IncreaseRuleCode =

  /*
   * تبصره 3
   */
  | "NOTE3_CONTRACT_FULL"

  | "NOTE3_CONTRACT_PARTIAL"

  /* تبصره ۴: دارایی‌های نامشهود */
  | "NOTE4_INTANGIBLE_ASSETS"
  /** @deprecated در تعرفه ۱۴۰۵ فعال نیست و در زمان اجرا رد می‌شود. */
  | "NOTE4_DAMAGE"
  | "NOTE5_SPECIAL_ITEMS"
  /** @deprecated شماره قدیمی دارایی نامشهود؛ از NOTE4_INTANGIBLE_ASSETS استفاده شود. */
  | "NOTE7_INTANGIBLE_ASSETS";


/*
 * ==========================================
 * تعریف Rule
 * ==========================================
 */

export interface Article11IncreaseRule {

  code:
    Article11IncreaseRuleCode;

  noteNumber:
    3 | 4 | 5 | 7;

  /*
   * عنوان برگرفته از متن تعرفه
   */
  title:
    string;

  /*
   * نرخ افزایش
   *
   * 1.00 = 100%
   * 0.50 = 50%
   */
  increaseRate:
    number;
}


/*
 * ==========================================
 * ورودی محاسبه
 * ==========================================
 */

export interface Article11IncreaseInput {

  /*
   * دستمزد مبنا قبل از ضریب افزایشی
   */
  baseFeeToman:
    number;

  /*
   * Rule انتخاب‌شده توسط کاربر
   */
  ruleCode:
    Article11IncreaseRuleCode;
}


/*
 * ==========================================
 * خروجی محاسبه
 * ==========================================
 */

export interface Article11IncreaseResult {

  ruleCode:
    Article11IncreaseRuleCode;

  noteNumber:
    number;

  title:
    string;

  /*
   * دستمزد مبنا
   */
  baseFeeToman:
    number;

  /*
   * نرخ افزایش
   */
  increaseRate:
    number;

  /*
   * مبلغ افزایش
   *
   * برای کنترل داخلی و تست نگهداری می‌شود.
   * لزوماً در UI نمایش داده نمی‌شود.
   */
  increaseAmountToman:
    number;

  /*
   * مبلغ محاسباتی پس از اعمال ضریب
   * و قبل از کنترل سقف
   *
   * این مقدار برای Engine و تست است
   * و لازم نیست در UI نمایش داده شود.
   */
  feeAfterIncreaseToman:
    number;

  /*
   * دستمزد نهایی پس از کنترل سقف
   */
  finalFeeToman:
    number;

  /*
   * آیا سقف فعال شده است؟
   */
  capped:
    boolean;

  /*
   * سقف ماده 11
   */
  maximumFeeToman:
    number;

  calculationLabel:
    string;
}


/*
 * ==========================================
 * فهرست ضرایب افزایشی
 * ==========================================
 */

export const ARTICLE11_INCREASE_RULES:
  Article11IncreaseRule[] = [

  /*
   * تبصره 3
   */

  {
    code:
      "NOTE3_CONTRACT_FULL",

    noteNumber:
      3,

    title:
      "بررسی اختلاف بین کارفرمایان، پیمانکاران، مهندسان مشاور و همچنین قراردادهای مربوط و کنترل و تعیین صورت وضعیت",

    increaseRate:
      1.00
  },


  {
    code:
      "NOTE3_CONTRACT_PARTIAL",

    noteNumber:
      3,

    title:
      "کارشناسی صرفاً مربوط به بخشی از قرارداد مانند تشخیص تخلف از مفاد قرارداد و یا رسیدگی به تاخیر در انجام قرارداد",

    increaseRate:
      0.50
  },


  /* تبصره ۴ */
  {
    code:
      "NOTE4_INTANGIBLE_ASSETS",

    noteNumber:
      4,

    title:
      "ارزش‌گذاری دارایی‌های نامشهود مانند انواع برندها (ویژند)",

    increaseRate:
      0.50
  },

  /*
   * تبصره ۵: اقلام خاص، تنها هنگامی که مستقل و یک‌جا
   * موضوع کارشناسی باشند.
   */
  {
    code:
      "NOTE5_SPECIAL_ITEMS",

    noteNumber:
      5,

    title:
      "رسیدگی و ارزیابی مستقل و یک‌جای قطعات یدکی، کالا و لوازم مستعمل، فرآورده‌های غذایی، دارویی و بهداشتی، ضایعات، ابزارآلات و اجزای ریزالکترونیک و مخابرات",

    increaseRate:
      0.50
  }
];


/*
 * ==========================================
 * دریافت Rule
 * ==========================================
 */

export function getArticle11IncreaseRule(
  ruleCode:
    Article11IncreaseRuleCode
): Article11IncreaseRule {

  const rule =
    ARTICLE11_INCREASE_RULES.find(
      item =>
        item.code === ruleCode
    );


  if (!rule) {

    throw new Error(
      "Invalid Article 11 increase rule."
    );
  }


  return rule;
}


/*
 * ==========================================
 * اعمال ضریب افزایشی
 * ==========================================
 */

export function applyArticle11IncreaseRule(
  input:
    Article11IncreaseInput
): Article11IncreaseResult {

  const {
    baseFeeToman,
    ruleCode
  } = input;


  /*
   * اعتبارسنجی مبلغ
   */

  if (
    !Number.isFinite(
      baseFeeToman
    ) ||
    baseFeeToman < 0
  ) {

    throw new Error(
      "Base fee must be a non-negative number."
    );
  }


  const rule =
    getArticle11IncreaseRule(
      ruleCode
    );


  /*
   * مبلغ افزایش
   */

  const increaseAmountToman =
    baseFeeToman *
    rule.increaseRate;


  /*
   * مبلغ محاسباتی پس از افزایش
   * و قبل از کنترل سقف
   */

  const feeAfterIncreaseToman =
    baseFeeToman +
    increaseAmountToman;


  /*
   * آیا سقف فعال شده است؟
   */

  const capped =
    feeAfterIncreaseToman >
    ARTICLE11_MAXIMUM_FEE_TOMAN;


  /*
   * دستمزد نهایی
   *
   * ضرایب افزایشی نیز فقط در محدوده
   * سقف ماده 11 قابل اعمال هستند.
   */

  const finalFeeToman =
    Math.min(
      feeAfterIncreaseToman,
      ARTICLE11_MAXIMUM_FEE_TOMAN
    );


  return {

    ruleCode:
      rule.code,

    noteNumber:
      rule.noteNumber,

    title:
      rule.title,

    baseFeeToman,

    increaseRate:
      rule.increaseRate,

    increaseAmountToman,

    feeAfterIncreaseToman,

    finalFeeToman,

    capped,

    maximumFeeToman:
      ARTICLE11_MAXIMUM_FEE_TOMAN,

    calculationLabel:
      `اعمال ضریب افزایشی تبصره ${rule.noteNumber} ماده 11`
  };
}
