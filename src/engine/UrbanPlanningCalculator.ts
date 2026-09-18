import {
  calculateCommonFee
} from "./CommonFeeEngine";

import type {
  CommonFeeResult
} from "./CommonFeeEngine";

import {
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN
} from "../config/Tariff1405";

import {
  ARTICLE_44
} from "./RoadBuildingRules";

import type {
  Article44ServiceType
} from "./RoadBuildingRules";

import type {
  MissionType
} from "./MissionCalculator";


/*
 * ========================================
 * ExpertFee
 * Group 6 - Article 44
 * UrbanPlanningCalculator
 * ========================================
 *
 * واحد تمام مبالغ: تومان
 *
 * ماده 44 شامل سه خدمت مستقل است:
 *
 * 1) انطباق طرح تفکیک اراضی شهری
 * 2) انطباق کاربری اراضی شهری
 * 3) انطباق شهری ساختمان‌ها
 */


/*
 * ========================================
 * ورودی
 * ========================================
 */

export interface Article44Input {

  serviceType:
    Article44ServiceType;

  /*
   * تعداد قطعات / موارد / ساختمان‌ها
   * حسب نوع خدمت انتخابی.
   */
  itemCount: number;

  missionType?: MissionType;

  missionDays?: number;
}


/*
 * ========================================
 * خروجی
 * ========================================
 */

export interface Article44CalculationResult {

  article: 44;

  serviceType:
    Article44ServiceType;

  title: string;

  itemCount: number;

  /*
   * مبلغ پایه برای دو مورد اول
   */
  baseFeeToman: number;

  /*
   * تعداد موارد در بازه 3 تا 10
   */
  middleBandItemCount: number;

  /*
   * هزینه بازه 3 تا 10
   */
  middleBandFeeToman: number;

  /*
   * تعداد موارد مازاد بر 10
   */
  upperBandItemCount: number;

  /*
   * هزینه موارد مازاد بر 10
   */
  upperBandFeeToman: number;

  /*
   * دستمزد کارشناسی قبل از مأموریت
   */
  expertFeeToman: number;

  missionType: MissionType;

  missionDays: number;

  missionFeeToman: number;

  totalPayableToman: number;

  commonFeeResult:
    CommonFeeResult;
}


/*
 * ========================================
 * اعتبارسنجی
 * ========================================
 */

function assertPositiveInteger(
  value: number,
  fieldName: string
): void {

  if (
    !Number.isFinite(value) ||
    value <= 0 ||
    !Number.isInteger(value)
  ) {

    throw new Error(
      `${fieldName} must be a positive integer.`
    );
  }
}


/*
 * ========================================
 * انتخاب Rule
 * ========================================
 */

function getArticle44Rule(
  serviceType:
    Article44ServiceType
) {

  switch (serviceType) {

    case "SUBDIVISION_PLAN":

      return {
        title:
          "انطباق طرح تفکیک اراضی شهری",

        rule:
          ARTICLE_44
            .subdivisionPlan
      };


    case "LAND_USE_COMPLIANCE":

      return {
        title:
          "انطباق کاربری اراضی شهری",

        rule:
          ARTICLE_44
            .landUseCompliance
      };


    case "BUILDING_URBAN_COMPLIANCE":

      return {
        title:
          "انطباق شهری ساختمان‌ها",

        rule:
          ARTICLE_44
            .buildingUrbanCompliance
      };


    default: {

      const exhaustiveCheck:
        never = serviceType;

      return exhaustiveCheck;
    }
  }
}


/*
 * ========================================
 * محاسبه ماده 44
 * ========================================
 *
 * قاعده:
 *
 * تا 2 مورد:
 * مبلغ پایه
 *
 * از مورد 3 تا 10:
 * نرخ میانی برای هر مورد اضافه
 *
 * از مورد 11 به بعد:
 * نرخ بالایی برای هر مورد اضافه
 *
 * مأموریت پس از دستمزد کارشناسی
 * اضافه می‌شود.
 */

export function calculateArticle44(
  input: Article44Input
): Article44CalculationResult {

  assertPositiveInteger(
    input.itemCount,
    "itemCount"
  );


  const selected =
    getArticle44Rule(
      input.serviceType
    );


  const {
    baseCount,
    baseFeeToman,
    middleMaximumCount,
    additionalFeeFrom3To10TomanPerItem,
    additionalFeeAbove10TomanPerItem
  } =
    selected.rule;


  /*
   * ========================================
   * بازه 3 تا 10
   * ========================================
   */

  const middleBandItemCount =
    Math.max(
      0,

      Math.min(
        input.itemCount,
        middleMaximumCount
      ) -
      baseCount
    );


  const middleBandFeeToman =
    middleBandItemCount *
    additionalFeeFrom3To10TomanPerItem;


  /*
   * ========================================
   * بالاتر از 10
   * ========================================
   */

  const upperBandItemCount =
    Math.max(
      0,

      input.itemCount -
      middleMaximumCount
    );


  const upperBandFeeToman =
    upperBandItemCount *
    additionalFeeAbove10TomanPerItem;


  /*
   * ========================================
   * دستمزد اصلی
   * ========================================
   */

  const calculatedFeeToman =
    baseFeeToman +
    middleBandFeeToman +
    upperBandFeeToman;


  /*
   * ========================================
   * مأموریت
   * ========================================
   *
   * CommonFeeEngine در حالت FIXED
   * برای استاندارد ماندن خروجی کل پروژه.
   */

  const common =
    calculateCommonFee({

      baseMode:
        "FIXED",

      fixedFeeToman:
        calculatedFeeToman,

      maximumFeeToman:
        ARTICLE_11_GENERAL_MAXIMUM_TOMAN,

      missionType:
        input.missionType,

      missionDays:
        input.missionDays
    });


  return {

    article: 44,

    serviceType:
      input.serviceType,

    title:
      selected.title,

    itemCount:
      input.itemCount,

    baseFeeToman,

    middleBandItemCount,

    middleBandFeeToman,

    upperBandItemCount,

    upperBandFeeToman,

    expertFeeToman:
      common.finalExpertFeeToman,

    missionType:
      common.missionType,

    missionDays:
      common.missionDays,

    missionFeeToman:
      common.missionFeeToman,

    totalPayableToman:
      common.totalPayableToman,

    commonFeeResult:
      common
  };
}
