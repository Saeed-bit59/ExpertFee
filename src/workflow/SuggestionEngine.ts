import {
  ARTICLE11_INCREASE_RULES
} from "../engine/Article11IncreaseRules";

import type {
  Article11IncreaseRuleCode
} from "../engine/Article11IncreaseRules";


/*
 * ========================================
 * نوع موضوع کارشناسی
 * ========================================
 *
 * این عناوین برای فهم کاربر طراحی شده‌اند.
 * انتخاب آنها به معنی اعمال خودکار ضریب نیست.
 */

export type Article11SubjectType =

  | "STANDARD_VALUATION"

  | "CONTRACT_FULL"

  | "CONTRACT_PARTIAL"

  | "DAMAGE"

  | "SPECIAL_ITEMS"

  | "INTANGIBLE_ASSETS";


/*
 * ========================================
 * Context
 * ========================================
 */

export interface Article11SuggestionContext {

  /*
   * نوع موضوع کارشناسی
   */
  subjectType?:
    Article11SubjectType;

  /*
   * امکان درخواست فهرست تمام
   * ضرایب افزایشی
   */
  includeIncreaseRules?: boolean;
}


/*
 * ========================================
 * Suggestion
 * ========================================
 */

export interface Article11Suggestion {

  code:
    Article11IncreaseRuleCode;

  noteNumber:
    number;

  title:
    string;

  increaseRate:
    number;

  /*
   * هیچ پیشنهاد تعرفه‌ای بدون
   * تأیید کاربر اعمال نمی‌شود.
   */
  requiresUserConfirmation:
    true;

  /*
   * علت پیشنهاد برای استفاده داخلی UI
   */
  reason:
    string;
}


/*
 * ========================================
 * نگاشت موضوع به Rule
 * ========================================
 */

const SUBJECT_RULE_MAP:
  Partial<
    Record<
      Article11SubjectType,
      Article11IncreaseRuleCode
    >
  > = {

  CONTRACT_FULL:
    "NOTE3_CONTRACT_FULL",

  CONTRACT_PARTIAL:
    "NOTE3_CONTRACT_PARTIAL",

  INTANGIBLE_ASSETS:
    "NOTE4_INTANGIBLE_ASSETS"

};


/*
 * ========================================
 * ساخت Suggestion از Rule
 * ========================================
 */

function createSuggestion(
  code: Article11IncreaseRuleCode,
  reason: string
): Article11Suggestion | undefined {

  const rule =
    ARTICLE11_INCREASE_RULES.find(
      item =>
        item.code === code
    );


  if (!rule) {
    return undefined;
  }


  return {

    code:
      rule.code,

    noteNumber:
      rule.noteNumber,

    title:
      rule.title,

    increaseRate:
      rule.increaseRate,

    requiresUserConfirmation:
      true,

    reason
  };
}


/*
 * ========================================
 * Suggestion Engine
 * ========================================
 */

export function getArticle11Suggestions(
  context: Article11SuggestionContext
): Article11Suggestion[] {

  /*
   * ========================================
   * حالت 1
   * درخواست تمام قواعد
   * ========================================
   */

  if (
    context.includeIncreaseRules
  ) {

    return ARTICLE11_INCREASE_RULES.map(
      rule => ({

        code:
          rule.code,

        noteNumber:
          rule.noteNumber,

        title:
          rule.title,

        increaseRate:
          rule.increaseRate,

        requiresUserConfirmation:
          true,

        reason:
          "نمایش تمام ضرایب افزایشی ماده 11"

      })
    );
  }


  /*
   * ========================================
   * حالت 2
   * موضوع کارشناسی مشخص نشده
   * ========================================
   */

  if (!context.subjectType) {
    return [];
  }


  /*
   * ========================================
   * حالت 3
   * ارزیابی عادی
   * ========================================
   *
   * در ارزیابی عادی هیچ ضریب افزایشی
   * صرفاً بر اساس این انتخاب پیشنهاد نمی‌شود.
   */

  if (
    context.subjectType ===
    "STANDARD_VALUATION"
  ) {

    return [];
  }


  /*
   * ========================================
   * پیدا کردن Rule مرتبط
   * ========================================
   */

  const ruleCode =
    SUBJECT_RULE_MAP[
      context.subjectType
    ];


  if (!ruleCode) {
    return [];
  }


  /*
   * ========================================
   * ایجاد پیشنهاد
   * ========================================
   */

  const suggestion =
    createSuggestion(
      ruleCode,
      "بر اساس موضوع کارشناسی انتخاب‌شده توسط کاربر"
    );


  if (!suggestion) {
    return [];
  }


  return [
    suggestion
  ];
}


/*
 * ========================================
 * دریافت Suggestion بر اساس Code
 * ========================================
 */

export function getArticle11SuggestionByCode(
  code: Article11IncreaseRuleCode
): Article11Suggestion | undefined {

  return createSuggestion(
    code,
    "انتخاب مستقیم Rule"
  );
}
