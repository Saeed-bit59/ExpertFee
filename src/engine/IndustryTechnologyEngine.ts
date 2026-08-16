import {
  calculateArticle45
} from "./IndustryTechnologyCalculator";

import type {
  Article45Input,
  Article45CalculationResult
} from "./IndustryTechnologyCalculator";

import {
  INDUSTRY_TECHNOLOGY_DISCIPLINES,
  INDUSTRY_TECHNOLOGY_SERVICE_TYPES
} from "./IndustryTechnologyRules";


/*
 * ========================================
 * ExpertFee
 * Group 7 - Industry and Technology
 * IndustryTechnologyEngine
 * ========================================
 *
 * هدف:
 * ایجاد API واحد برای گروه 7 و ماده 45.
 *
 * این Engine هیچ فرمول تعرفه‌ای جدیدی
 * پیاده‌سازی نمی‌کند.
 *
 * تمام منطق محاسباتی در:
 *
 * IndustryTechnologyRules
 * IndustryTechnologyCalculator
 *
 * باقی می‌ماند.
 */


/*
 * ========================================
 * مواد تحت پوشش Engine
 * ========================================
 */

export type IndustryTechnologyEngineArticle =
  45;


/*
 * ========================================
 * ورودی Engine
 * ========================================
 */

export type IndustryTechnologyEngineInput = {
  article: 45;
  data: Article45Input;
};


/*
 * ========================================
 * خروجی Engine
 * ========================================
 */

export type IndustryTechnologyEngineResult =
  Article45CalculationResult;


/*
 * ========================================
 * اجرای Engine
 * ========================================
 *
 * گروه 7 در معماری فعلی فقط ماده 45
 * را شامل می‌شود.
 *
 * بنابراین نیازی به switch و
 * exhaustiveCheck وجود ندارد.
 *
 * TypeScript نیز از طریق نوع ورودی
 * تضمین می‌کند که article فقط 45 باشد.
 */

export function calculateIndustryTechnologyFee(
  input:
    IndustryTechnologyEngineInput
): IndustryTechnologyEngineResult {

  return calculateArticle45(
    input.data
  );
}


/*
 * ========================================
 * Metadata گروه 7
 * ========================================
 *
 * این Metadata برای:
 *
 * - UI
 * - Router
 * - جستجو
 * - صفحه اصلی
 * - توسعه بعدی
 *
 * قابل استفاده است.
 *
 * محاسبه تعرفه بر اساس Metadata
 * انجام نمی‌شود.
 */

export const INDUSTRY_TECHNOLOGY_ENGINE_METADATA = {

  group:
    7,

  title:
    "صنعت و فن",

  firstArticle:
    45,

  lastArticle:
    45,

  articles: [

    {
      article:
        45,

      automaticCalculationSupported:
        true,

      usesArticle11:
        true
    }

  ],

  disciplines:
    INDUSTRY_TECHNOLOGY_DISCIPLINES,

  serviceTypes:
    INDUSTRY_TECHNOLOGY_SERVICE_TYPES,

  /*
   * تبصره 3 ماده 45 طبق تصمیم پروژه
   * از محاسبات نرم‌افزار خارج است.
   */
  excludedFromCalculation: [
    "ARTICLE_45_NOTE_3"
  ]

} as const;