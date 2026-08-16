import {
  calculateArticle48,
  calculateArticle49,
  calculateArticle51,
  calculateArticle52,
  calculateArticle53
} from "./AgricultureNaturalResourcesCalculator";

import type {
  Article48Input,
  Article49Input,
  Article51Input,
  Article52Input,
  Article53Input,
  Article48CalculationResult,
  Article49CalculationResult,
  Article51CalculationResult,
  Article52CalculationResult,
  Article53CalculationResult
} from "./AgricultureNaturalResourcesCalculator";

import {
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES,
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES
} from "./AgricultureNaturalResourcesRules";


/*
 * ========================================
 * ExpertFee
 * Group 9 - Agriculture and Natural Resources
 * AgricultureNaturalResourcesEngine
 * ========================================
 *
 * هدف:
 * ایجاد API واحد برای گروه 9 و مواد:
 *
 * 48
 * 49
 * 51
 * 52
 * 53
 *
 * این Engine هیچ فرمول تعرفه‌ای جدیدی
 * پیاده‌سازی نمی‌کند.
 *
 * تمام منطق محاسباتی در:
 *
 * AgricultureNaturalResourcesRules
 * AgricultureNaturalResourcesCalculator
 *
 * باقی می‌ماند.
 */


/*
 * ========================================
 * Articles
 * ========================================
 */

export type AgricultureNaturalResourcesEngineArticle =
  | 48
  | 49
  | 51
  | 52
  | 53;


/*
 * ========================================
 * Article-specific Engine Inputs
 * ========================================
 */

export type AgricultureArticle48EngineInput = {

  article:
    48;

  data:
    Article48Input;
};


export type AgricultureArticle49EngineInput = {

  article:
    49;

  data:
    Article49Input;
};


export type AgricultureArticle51EngineInput = {

  article:
    51;

  data:
    Article51Input;
};


export type AgricultureArticle52EngineInput = {

  article:
    52;

  data:
    Article52Input;
};


export type AgricultureArticle53EngineInput = {

  article:
    53;

  data:
    Article53Input;
};


/*
 * ========================================
 * Unified Engine Input
 * ========================================
 */

export type AgricultureNaturalResourcesEngineInput =

  | AgricultureArticle48EngineInput
  | AgricultureArticle49EngineInput
  | AgricultureArticle51EngineInput
  | AgricultureArticle52EngineInput
  | AgricultureArticle53EngineInput;


/*
 * ========================================
 * Unified Engine Result
 * ========================================
 */

export type AgricultureNaturalResourcesEngineResult =

  | Article48CalculationResult
  | Article49CalculationResult
  | Article51CalculationResult
  | Article52CalculationResult
  | Article53CalculationResult;


/*
 * ========================================
 * Function Overloads
 * ========================================
 *
 * هدف:
 *
 * اگر ورودی article = 51 باشد،
 * TypeScript باید بداند خروجی دقیقاً
 * Article51CalculationResult است.
 *
 * همین منطق برای سایر مواد نیز اعمال می‌شود.
 */

export function calculateAgricultureNaturalResourcesFee(
  input:
    AgricultureArticle48EngineInput
): Article48CalculationResult;


export function calculateAgricultureNaturalResourcesFee(
  input:
    AgricultureArticle49EngineInput
): Article49CalculationResult;


export function calculateAgricultureNaturalResourcesFee(
  input:
    AgricultureArticle51EngineInput
): Article51CalculationResult;


export function calculateAgricultureNaturalResourcesFee(
  input:
    AgricultureArticle52EngineInput
): Article52CalculationResult;


export function calculateAgricultureNaturalResourcesFee(
  input:
    AgricultureArticle53EngineInput
): Article53CalculationResult;


/*
 * ========================================
 * Implementation
 * ========================================
 */

export function calculateAgricultureNaturalResourcesFee(
  input:
    AgricultureNaturalResourcesEngineInput
): AgricultureNaturalResourcesEngineResult {

  switch (
    input.article
  ) {

    case 48:

      return calculateArticle48(
        input.data
      );


    case 49:

      return calculateArticle49(
        input.data
      );


    case 51:

      return calculateArticle51(
        input.data
      );


    case 52:

      return calculateArticle52(
        input.data
      );


    case 53:

      return calculateArticle53(
        input.data
      );
  }
}


/*
 * ========================================
 * Metadata
 * ========================================
 */

export const AGRICULTURE_NATURAL_RESOURCES_ENGINE_METADATA = {

  group:
    9,

  title:
    "کشاورزی و منابع طبیعی",

  firstArticle:
    48,

  lastArticle:
    53,

  articles: [

    {
      article:
        48,

      automaticCalculationSupported:
        true,

      usesArticle11:
        true
    },

    {
      article:
        49,

      automaticCalculationSupported:
        true,

      usesArticle11:
        true
    },

    {
      article:
        51,

      automaticCalculationSupported:
        true,

      usesArticle11:
        false
    },

    {
      article:
        52,

      automaticCalculationSupported:
        true,

      usesArticle11:
        true
    },

    {
      article:
        53,

      automaticCalculationSupported:
        true,

      usesArticle11:
        true
    }

  ],

  disciplines:
    AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES,

  serviceTypes:
    AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES,

  /*
   * ماده 50:
   *
   * به دلیل ارجاع به توافق و ماده 9
   * از محاسبات خودکار نرم‌افزار خارج است.
   */
  excludedFromCalculation: [
    50
  ],

  /*
   * گروه 9 آخرین گروه تعرفه‌ای
   * مورد استفاده در نرم‌افزار است.
   */
  isFinalImplementedTariffGroup:
    true

} as const;