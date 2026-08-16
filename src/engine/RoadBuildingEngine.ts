import {
  calculateArticle33,
  calculateArticle34,
  calculateArticle35,
  calculateArticle36,
  calculateArticle37,
  calculateArticle38
} from "./RoadBuildingCalculator";

import type {
  Article33Input,
  Article34Input,
  Article35Input,
  Article36Input,
  Article37Input,
  Article38Input,
  RoadBuildingCalculationResult
} from "./RoadBuildingCalculator";

import {
  calculateArticle39,
  calculateArticle40,
  calculateArticle41,
  getArticle42Status,
  calculateArticle43
} from "./SurveyCalculator";

import type {
  Article39Input,
  Article40Input,
  Article41Input,
  Article42Status,
  Article43Input,
  SurveyCalculationResult
} from "./SurveyCalculator";

import {
  calculateArticle44
} from "./UrbanPlanningCalculator";

import type {
  Article44Input,
  Article44CalculationResult
} from "./UrbanPlanningCalculator";


/*
 * ========================================
 * ExpertFee
 * Group 6 - Road, Building and Surveying
 * RoadBuildingEngine
 * ========================================
 *
 * هدف:
 * ایجاد API واحد برای مواد 33 تا 44
 *
 * این Engine هیچ فرمول تعرفه‌ای جدیدی
 * پیاده‌سازی نمی‌کند.
 *
 * مسئولیت محاسبه همچنان در Calculatorهای
 * اختصاصی باقی می‌ماند.
 */


/*
 * ========================================
 * نوع ماده
 * ========================================
 */

export type RoadBuildingEngineArticle =
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44;


/*
 * ========================================
 * ورودی Discriminated Union
 * ========================================
 *
 * مزیت این ساختار:
 *
 * article تعیین می‌کند data باید دقیقاً
 * از چه نوعی باشد.
 */

export type RoadBuildingEngineInput =

  | {
      article: 33;
      data: Article33Input;
    }

  | {
      article: 34;
      data: Article34Input;
    }

  | {
      article: 35;
      data: Article35Input;
    }

  | {
      article: 36;
      data: Article36Input;
    }

  | {
      article: 37;
      data: Article37Input;
    }

  | {
      article: 38;
      data: Article38Input;
    }

  | {
      article: 39;
      data: Article39Input;
    }

  | {
      article: 40;
      data: Article40Input;
    }

  | {
      article: 41;
      data: Article41Input;
    }

  | {
      article: 42;
    }

  | {
      article: 43;
      data: Article43Input;
    }

  | {
      article: 44;
      data: Article44Input;
    };


/*
 * ========================================
 * خروجی Engine
 * ========================================
 */

export type RoadBuildingEngineResult =
  | RoadBuildingCalculationResult
  | SurveyCalculationResult
  | Article42Status
  | Article44CalculationResult;


/*
 * ========================================
 * اجرای Engine
 * ========================================
 */

export function calculateRoadBuildingFee(
  input: RoadBuildingEngineInput
): RoadBuildingEngineResult {

  switch (
    input.article
  ) {

    case 33:

      return calculateArticle33(
        input.data
      );


    case 34:

      return calculateArticle34(
        input.data
      );


    case 35:

      return calculateArticle35(
        input.data
      );


    case 36:

      return calculateArticle36(
        input.data
      );


    case 37:

      return calculateArticle37(
        input.data
      );


    case 38:

      return calculateArticle38(
        input.data
      );


    case 39:

      return calculateArticle39(
        input.data
      );


    case 40:

      return calculateArticle40(
        input.data
      );


    case 41:

      return calculateArticle41(
        input.data
      );


    case 42:

      return getArticle42Status();


    case 43:

      return calculateArticle43(
        input.data
      );


    case 44:

      return calculateArticle44(
        input.data
      );


    default: {

      const exhaustiveCheck:
        never = input;

      return exhaustiveCheck;
    }
  }
}


/*
 * ========================================
 * Metadata
 * ========================================
 *
 * برای UI، جستجو و توسعه بعدی.
 *
 * هیچ محاسبه‌ای بر اساس این Metadata
 * انجام نمی‌شود.
 */

export const ROAD_BUILDING_ENGINE_METADATA = {

  group:
    6,

  title:
    "راه، ساختمان و نقشه‌برداری",

  firstArticle:
    33,

  lastArticle:
    44,

  articles: [

    {
      article: 33,
      automaticCalculationSupported: true
    },

    {
      article: 34,
      automaticCalculationSupported: true
    },

    {
      article: 35,
      automaticCalculationSupported: true
    },

    {
      article: 36,
      automaticCalculationSupported: true
    },

    {
      article: 37,
      automaticCalculationSupported: true
    },

    {
      article: 38,
      automaticCalculationSupported: true
    },

    {
      article: 39,
      automaticCalculationSupported: true
    },

    {
      article: 40,
      automaticCalculationSupported: true
    },

    {
      article: 41,
      automaticCalculationSupported: true
    },

    {
      article: 42,
      automaticCalculationSupported: false
    },

    {
      article: 43,
      automaticCalculationSupported: true
    },

    {
      article: 44,
      automaticCalculationSupported: true
    }

  ]

} as const;
