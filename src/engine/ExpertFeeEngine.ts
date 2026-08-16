import {
  calculateVehicleFee
} from "./VehicleCalculator";

import type {
  VehicleCalculationInput,
  VehicleCalculationResult
} from "./VehicleCalculator";

import {
  calculateRoadBuildingFee
} from "./RoadBuildingEngine";

import type {
  RoadBuildingEngineInput,
  RoadBuildingEngineResult
} from "./RoadBuildingEngine";

import {
  calculateIndustryTechnologyFee
} from "./IndustryTechnologyEngine";

import type {
  IndustryTechnologyEngineInput,
  IndustryTechnologyEngineResult
} from "./IndustryTechnologyEngine";

import {
  calculateAgricultureNaturalResourcesFee
} from "./AgricultureNaturalResourcesEngine";

import type {
  AgricultureNaturalResourcesEngineInput,
  AgricultureNaturalResourcesEngineResult
} from "./AgricultureNaturalResourcesEngine";


/*
 * ============================================================
 * ExpertFee
 *
 * Central Expert Fee Gateway
 * ExpertFeeEngine
 * ============================================================
 *
 * مسئولیت:
 *
 * - ایجاد API واحد برای UI / Search / Registry
 * - Routing درخواست به موتور صحیح
 * - حفظ Type Safety
 * - حفظ خروجی تخصصی هر گروه
 *
 * این فایل:
 *
 * - هیچ فرمول تعرفه‌ای ندارد.
 * - CommonFeeEngine را مستقیماً فراخوانی نمی‌کند.
 * - MissionCalculator را مستقیماً فراخوانی نمی‌کند.
 * - منطق Rules / Calculator / Engineهای گروه‌ها را تکرار نمی‌کند.
 *
 * گروه‌های تحت پوشش:
 *
 * Group 5 -> VehicleCalculator
 * Group 6 -> RoadBuildingEngine
 * Group 7 -> IndustryTechnologyEngine
 * Group 9 -> AgricultureNaturalResourcesEngine
 * ============================================================
 */


/*
 * ============================================================
 * Supported Groups
 * ============================================================
 */

export type ExpertFeeGroup =
  | 5
  | 6
  | 7
  | 9;


/*
 * ============================================================
 * Group-specific Gateway Inputs
 * ============================================================
 */

export interface ExpertFeeGroup5Input {

  group:
    5;

  data:
    VehicleCalculationInput;
}


export interface ExpertFeeGroup6Input {

  group:
    6;

  data:
    RoadBuildingEngineInput;
}


export interface ExpertFeeGroup7Input {

  group:
    7;

  data:
    IndustryTechnologyEngineInput;
}


export interface ExpertFeeGroup9Input {

  group:
    9;

  data:
    AgricultureNaturalResourcesEngineInput;
}


/*
 * ============================================================
 * Unified Gateway Input
 * ============================================================
 */

export type ExpertFeeEngineInput =

  | ExpertFeeGroup5Input
  | ExpertFeeGroup6Input
  | ExpertFeeGroup7Input
  | ExpertFeeGroup9Input;


/*
 * ============================================================
 * Unified Gateway Result
 * ============================================================
 */

export type ExpertFeeEngineResult =

  | VehicleCalculationResult
  | RoadBuildingEngineResult
  | IndustryTechnologyEngineResult
  | AgricultureNaturalResourcesEngineResult;


/*
 * ============================================================
 * Public Overloads
 * ============================================================
 *
 * با مشخص بودن group، نوع خروجی نیز در سطح API حفظ می‌شود.
 * ============================================================
 */

export function calculateExpertFee(
  input:
    ExpertFeeGroup5Input
): VehicleCalculationResult;


export function calculateExpertFee(
  input:
    ExpertFeeGroup6Input
): RoadBuildingEngineResult;


export function calculateExpertFee(
  input:
    ExpertFeeGroup7Input
): IndustryTechnologyEngineResult;


export function calculateExpertFee(
  input:
    ExpertFeeGroup9Input
): AgricultureNaturalResourcesEngineResult;


/*
 * ============================================================
 * Main Implementation
 * ============================================================
 */

export function calculateExpertFee(
  input:
    ExpertFeeEngineInput
): ExpertFeeEngineResult {

  switch (
    input.group
  ) {

    /*
     * ========================================================
     * Group 5
     * Vehicle
     * ========================================================
     */

    case 5:

      return calculateVehicleFee(
        input.data
      );


    /*
     * ========================================================
     * Group 6
     * Road & Building
     * ========================================================
     */

    case 6:

      return calculateRoadBuildingFee(
        input.data
      );


    /*
     * ========================================================
     * Group 7
     * Industry & Technology
     * ========================================================
     */

    case 7:

      return calculateIndustryTechnologyFee(
        input.data
      );


    /*
     * ========================================================
     * Group 9
     * Agriculture & Natural Resources
     *
     * نکته مهم:
     *
     * AgricultureNaturalResourcesEngine دارای overload مجزا
     * برای مواد 48، 49، 51، 52 و 53 است.
     *
     * بنابراین Union ورودی را مستقیماً به تابع نمی‌دهیم.
     * ابتدا بر اساس article آن را Narrow می‌کنیم تا TypeScript
     * overload صحیح را به‌صورت type-safe انتخاب کند.
     * ========================================================
     */

    case 9: {

      switch (
        input.data.article
      ) {

        case 48:

          return calculateAgricultureNaturalResourcesFee(
            input.data
          );


        case 49:

          return calculateAgricultureNaturalResourcesFee(
            input.data
          );


        case 51:

          return calculateAgricultureNaturalResourcesFee(
            input.data
          );


        case 52:

          return calculateAgricultureNaturalResourcesFee(
            input.data
          );


        case 53:

          return calculateAgricultureNaturalResourcesFee(
            input.data
          );
      }
    }
  }
}


/*
 * ============================================================
 * Central Gateway Metadata
 * ============================================================
 *
 * Search / Keyword Registry در فایل مستقل ساخته خواهد شد.
 * ============================================================
 */

export const EXPERT_FEE_ENGINE_METADATA = {

  name:
    "ExpertFeeEngine",

  supportedGroups: [
    5,
    6,
    7,
    9
  ],

  groupCount:
    4,

  routingMode:
    "GROUP_BASED",

  preservesSpecializedResults:
    true,

  containsTariffFormulas:
    false,

  searchRegistryEmbedded:
    false

} as const;
