import {
  calculateCommonFee
} from "./CommonFeeEngine";

import type {
  CommonFeeResult
} from "./CommonFeeEngine";

import {
  getArticle45Rule
} from "./IndustryTechnologyRules";

import type {
  IndustryTechnologyDiscipline,
  IndustryTechnologyServiceType
} from "./IndustryTechnologyRules";

import type {
  MissionType
} from "./MissionCalculator";

import {
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN
} from "../config/Tariff1405";


/*
 * ========================================
 * ExpertFee
 * Group 7 - Industry and Technology
 * Article 45
 * IndustryTechnologyCalculator
 * ========================================
 *
 * واحد مبالغ: تومان
 *
 * سه مسیر قابل محاسبه:
 *
 * 1) ارزیابی عادی
 *    Article 11
 *
 * 2) ارزیابی ماشین‌آلات همراه با
 *    مشخصات فنی / استهلاک / عمر مفید
 *    Article 11 + 40%
 *
 * 3) کارشناسی نرم‌افزار
 *    Article 11 + 50%
 *
 * مأموریت پس از دستمزد کارشناسی
 * اضافه می‌شود.
 */


/*
 * ========================================
 * ورودی
 * ========================================
 */

export interface Article45Input {

  discipline:
    IndustryTechnologyDiscipline;

  serviceType:
    IndustryTechnologyServiceType;

  /*
   * ارزش موضوع کارشناسی برای محاسبه ماده 11
   */
  evaluationValueToman:
    number;

  missionType?:
    MissionType;

  missionDays?:
    number;
}


/*
 * ========================================
 * خروجی
 * ========================================
 */

export interface Article45CalculationResult {

  article:
    45;

  discipline:
    IndustryTechnologyDiscipline;

  serviceType:
    IndustryTechnologyServiceType;

  title:
    string;

  evaluationValueToman:
    number;

  /*
   * دستمزد پایه ماده 11
   * قبل از ضریب تبصره‌ها
   */
  article11FeeToman:
    number;

  /*
   * درصد افزایشی
   *
   * 0 / 40 / 50
   */
  additionalPercent:
    number;

  /*
   * مبلغ افزایشی ناشی از تبصره
   */
  additionalFeeToman:
    number;

  /* سقف عمومی ماده 11 پس از اعمال تبصره نیز کنترل می‌شود. */
  cappedByArticle11Maximum:
    boolean;

  /*
   * دستمزد کارشناسی نهایی
   * قبل از مأموریت
   */
  expertFeeToman:
    number;

  missionType:
    MissionType;

  missionDays:
    number;

  missionFeeToman:
    number;

  totalPayableToman:
    number;

  /*
   * خروجی ماده 11 پایه
   */
  article11CommonFeeResult:
    CommonFeeResult;

  /*
   * خروجی نهایی CommonFeeEngine
   */
  finalCommonFeeResult:
    CommonFeeResult;
}


/*
 * ========================================
 * اعتبارسنجی
 * ========================================
 */

function assertPositiveFinite(
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


/*
 * ========================================
 * محدودیت منطقی نوع خدمت
 * ========================================
 *
 * تبصره 1:
 * برای ارزیابی ماشین‌آلات تولیدی و صنعتی.
 *
 * تبصره 2:
 * کارشناسی نرم‌افزار و در نتیجه فقط
 * رشته کامپیوتر و فناوری اطلاعات.
 *
 * برای تبصره 1 رشته را محدود نمی‌کنیم،
 * زیرا ماشین‌آلات صنعتی ممکن است در چند
 * رشته گروه 7 موضوع کارشناسی قرار گیرند.
 *
 * اما ماهیت خدمت با serviceType صریحاً
 * مشخص می‌شود.
 */

function validateServiceForDiscipline(
  discipline:
    IndustryTechnologyDiscipline,

  serviceType:
    IndustryTechnologyServiceType
): void {

  if (
    serviceType ===
      "SOFTWARE_EXPERTISE" &&
    discipline !==
      "COMPUTER_INFORMATION_TECHNOLOGY"
  ) {

    throw new Error(
      "SOFTWARE_EXPERTISE is only available for COMPUTER_INFORMATION_TECHNOLOGY."
    );
  }
}


/*
 * ========================================
 * محاسبه ماده 45
 * ========================================
 */

export function calculateArticle45(
  input:
    Article45Input
): Article45CalculationResult {

  assertPositiveFinite(
    input.evaluationValueToman,
    "evaluationValueToman"
  );


  validateServiceForDiscipline(
    input.discipline,
    input.serviceType
  );


  const rule =
    getArticle45Rule(
      input.serviceType
    );


  /*
   * ========================================
   * مرحله 1
   * محاسبه ماده 11
   * ========================================
   *
   * در این مرحله مأموریت وارد نمی‌شود.
   */

  const article11Result =
    calculateCommonFee({

      baseMode:
        "ARTICLE_11",

      evaluationValueToman:
        input.evaluationValueToman
    });


  const article11FeeToman =
    article11Result
      .finalExpertFeeToman;


  /*
   * ========================================
   * مرحله 2
   * محاسبه مبلغ افزایشی
   * ========================================
   */

  const additionalFeeToman =
    Math.round(
      article11FeeToman *
      rule.additionalPercent /
      100
    );


  /*
   * ========================================
   * مرحله 3
   * دستمزد کارشناسی
   * ========================================
   *
   * ارزیابی:
   * Article 11
   *
   * تبصره 1:
   * Article 11 + 40%
   *
   * تبصره 2:
   * Article 11 + 50%
   *
   * CommonFeeEngine در حالت FIXED
   * برای یکپارچگی با معماری پروژه استفاده
   * می‌شود و مأموریت در همین مرحله اضافه
   * خواهد شد.
   */

  const expertFeeBeforeArticle11MaximumToman =
    article11FeeToman +
    additionalFeeToman;

  const cappedByArticle11Maximum =
    expertFeeBeforeArticle11MaximumToman >
    ARTICLE_11_GENERAL_MAXIMUM_TOMAN;

  const calculatedExpertFeeToman =
    Math.min(
      expertFeeBeforeArticle11MaximumToman,
      ARTICLE_11_GENERAL_MAXIMUM_TOMAN
    );


  const finalResult =
    calculateCommonFee({

      baseMode:
        "FIXED",

      fixedFeeToman:
        calculatedExpertFeeToman,

      missionType:
        input.missionType,

      missionDays:
        input.missionDays
    });


  return {

    article:
      45,

    discipline:
      input.discipline,

    serviceType:
      input.serviceType,

    title:
      rule.title,

    evaluationValueToman:
      input.evaluationValueToman,

    article11FeeToman,

    additionalPercent:
      rule.additionalPercent,

    additionalFeeToman,

    cappedByArticle11Maximum,

    expertFeeToman:
      finalResult
        .finalExpertFeeToman,

    missionType:
      finalResult
        .missionType,

    missionDays:
      finalResult
        .missionDays,

    missionFeeToman:
      finalResult
        .missionFeeToman,

    totalPayableToman:
      finalResult
        .totalPayableToman,

    article11CommonFeeResult:
      article11Result,

    finalCommonFeeResult:
      finalResult
  };
}
