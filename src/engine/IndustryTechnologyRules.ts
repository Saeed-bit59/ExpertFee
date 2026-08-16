/*
 * ========================================
 * ExpertFee
 * Group 7 - Industry and Technology
 * Article 45
 * IndustryTechnologyRules
 * ========================================
 *
 * واحد مبالغ در کل پروژه: تومان
 *
 * مبنای طراحی:
 *
 * ماده 45:
 * ارزیابی رشته‌های گروه 7 مطابق ماده 11.
 *
 * تبصره 1:
 * در فرآیند ارزیابی ماشین‌آلات تولیدی و صنعتی،
 * در صورت انجام تعیین مشخصات فنی، استهلاکات و
 * عمر مفید باقیمانده، 40 درصد دستمزد ماده 11
 * به دستمزد ارزیابی اضافه می‌شود.
 *
 * تبصره 2:
 * کارشناسی نرم‌افزار مطابق ماده 11
 * به اضافه 50 درصد است.
 *
 * تبصره 3:
 * طبق تصمیم پروژه، به علت وابستگی مبلغ نهایی
 * به ماده 9، در طراحی و محاسبات این گروه
 * وارد نشده است.
 */


/*
 * ========================================
 * رشته‌های گروه 7
 * ========================================
 */

export const INDUSTRY_TECHNOLOGY_DISCIPLINES = [

  "ELECTROCHEMISTRY_PETROCHEMICAL_CHEMICAL",

  "NUCLEAR_ENERGY",

  "ELECTRICAL_ELECTRONICS_TELECOMMUNICATION",

  "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

  "BUILDING_INSTALLATIONS",

  "COMPUTER_INFORMATION_TECHNOLOGY",

  "GAS_INDUSTRIES",

  "OIL_INDUSTRIES",

  "AEROSPACE_INDUSTRIES",

  "MEDICAL_ENGINEERING_EQUIPMENT",

  "TEXTILE_DYEING"

] as const;


export type IndustryTechnologyDiscipline =
  typeof INDUSTRY_TECHNOLOGY_DISCIPLINES[number];


/*
 * ========================================
 * نوع خدمت قابل محاسبه
 * ========================================
 */

export const INDUSTRY_TECHNOLOGY_SERVICE_TYPES = [

  /*
   * ماده 45
   */
  "EVALUATION",

  /*
   * ماده 45 + تبصره 1
   *
   * ارزیابی ماشین‌آلات همراه با:
   * - تعیین مشخصات فنی
   * - تعیین استهلاک
   * - تعیین عمر مفید باقیمانده
   */
  "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

  /*
   * ماده 45 + تبصره 2
   */
  "SOFTWARE_EXPERTISE"

] as const;


export type IndustryTechnologyServiceType =
  typeof INDUSTRY_TECHNOLOGY_SERVICE_TYPES[number];


/*
 * ========================================
 * روش اعمال ضریب
 * ========================================
 *
 * هر دو تبصره 1 و 2 در معماری پروژه
 * به شکل افزایش روی دستمزد ماده 11
 * تعریف شده‌اند.
 */

export type Article45AdjustmentMode =
  | "NONE"
  | "ADD_PERCENT_TO_ARTICLE_11";


/*
 * ========================================
 * Rule ماده 45
 * ========================================
 */

export interface Article45Rule {

  article: 45;

  serviceType:
    IndustryTechnologyServiceType;

  title: string;

  usesArticle11: true;

  adjustmentMode:
    Article45AdjustmentMode;

  /*
   * درصد افزایشی نسبت به خروجی ماده 11
   *
   * مثال:
   * 40 یعنی:
   * Article11 + 40% Article11
   */
  additionalPercent:
    number;

  /*
   * ضریب نهایی معادل برای کنترل و تست
   *
   * 1.00 = ماده 11
   * 1.40 = ماده 11 + 40%
   * 1.50 = ماده 11 + 50%
   */
  equivalentMultiplier:
    number;

  /*
   * آیا این خدمت فقط برای موضوع خاصی
   * قابل استفاده است؟
   */
  restrictedToMachinery:
    boolean;

  restrictedToSoftware:
    boolean;
}


/*
 * ========================================
 * ماده 45 - ارزیابی عادی
 * ========================================
 */

export const ARTICLE_45_EVALUATION_RULE:
  Article45Rule = {

    article:
      45,

    serviceType:
      "EVALUATION",

    title:
      "ارزیابی",

    usesArticle11:
      true,

    adjustmentMode:
      "NONE",

    additionalPercent:
      0,

    equivalentMultiplier:
      1,

    restrictedToMachinery:
      false,

    restrictedToSoftware:
      false
  };


/*
 * ========================================
 * ماده 45 - تبصره 1
 * ========================================
 *
 * تصمیم تفسیری پروژه:
 *
 * تبصره 1 به عنوان خدمت تکمیلی در فرآیند
 * ارزیابی ماشین‌آلات در نظر گرفته می‌شود.
 *
 * بنابراین:
 *
 * Final Fee =
 * Article 11 Fee
 * +
 * 40% of Article 11 Fee
 *
 * Equivalent Multiplier = 1.40
 */

export const ARTICLE_45_NOTE_1_RULE:
  Article45Rule = {

    article:
      45,

    serviceType:
      "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

    title:
      "ارزیابی ماشین‌آلات همراه با تعیین مشخصات فنی، استهلاک و عمر مفید باقیمانده",

    usesArticle11:
      true,

    adjustmentMode:
      "ADD_PERCENT_TO_ARTICLE_11",

    additionalPercent:
      40,

    equivalentMultiplier:
      1.4,

    restrictedToMachinery:
      true,

    restrictedToSoftware:
      false
  };


/*
 * ========================================
 * ماده 45 - تبصره 2
 * ========================================
 *
 * Final Fee =
 * Article 11 Fee
 * +
 * 50% of Article 11 Fee
 *
 * Equivalent Multiplier = 1.50
 */

export const ARTICLE_45_NOTE_2_RULE:
  Article45Rule = {

    article:
      45,

    serviceType:
      "SOFTWARE_EXPERTISE",

    title:
      "کارشناسی نرم‌افزار",

    usesArticle11:
      true,

    adjustmentMode:
      "ADD_PERCENT_TO_ARTICLE_11",

    additionalPercent:
      50,

    equivalentMultiplier:
      1.5,

    restrictedToMachinery:
      false,

    restrictedToSoftware:
      true
  };


/*
 * ========================================
 * مجموعه Rules ماده 45
 * ========================================
 */

export const ARTICLE_45_RULES = {

  evaluation:
    ARTICLE_45_EVALUATION_RULE,

  machineryEvaluationWithTechnicalAssessment:
    ARTICLE_45_NOTE_1_RULE,

  softwareExpertise:
    ARTICLE_45_NOTE_2_RULE

} as const;


/*
 * ========================================
 * دریافت Rule بر اساس نوع خدمت
 * ========================================
 */

export function getArticle45Rule(
  serviceType:
    IndustryTechnologyServiceType
): Article45Rule {

  switch (
    serviceType
  ) {

    case "EVALUATION":

      return ARTICLE_45_EVALUATION_RULE;


    case "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT":

      return ARTICLE_45_NOTE_1_RULE;


    case "SOFTWARE_EXPERTISE":

      return ARTICLE_45_NOTE_2_RULE;


    default: {

      const exhaustiveCheck:
        never = serviceType;

      return exhaustiveCheck;
    }
  }
}


/*
 * ========================================
 * Metadata گروه 7
 * ========================================
 */

export const INDUSTRY_TECHNOLOGY_RULES_METADATA = {

  group:
    7,

  title:
    "صنعت و فن",

  article:
    45,

  automaticCalculationSupported:
    true,

  usesArticle11:
    true,

  excludedFromCalculation: [

    /*
     * تبصره 3 ماده 45
     * به تصمیم پروژه وارد محاسبات نشده است.
     */
    "ARTICLE_45_NOTE_3"

  ],

  disciplines:
    INDUSTRY_TECHNOLOGY_DISCIPLINES,

  serviceTypes:
    INDUSTRY_TECHNOLOGY_SERVICE_TYPES

} as const;
