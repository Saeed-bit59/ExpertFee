import {
  calculateCommonFee
} from "./CommonFeeEngine";

import type {
  CommonFeeResult
} from "./CommonFeeEngine";

import {
  ARTICLE_51_BASE_FEE_TOMAN,
  ARTICLE_51_FIRST_AREA_LIMIT_SQM,
  ARTICLE_51_ONE_HECTARE_SQM,
  ARTICLE_51_BLOCK_SIZE_SQM,
  ARTICLE_51_FIRST_BLOCK_FEE_TOMAN,
  ARTICLE_51_ONE_HECTARE_FEE_TOMAN,
  ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN,
  ARTICLE_51_MAXIMUM_FEE_TOMAN,
  ARTICLE_52_ADDITIONAL_PERCENT,
  getAgricultureRuleByArticle
} from "./AgricultureNaturalResourcesRules";

import type {
  AgricultureNaturalResourcesDiscipline
} from "./AgricultureNaturalResourcesRules";

import type {
  MissionType
} from "./MissionCalculator";


/*
 * ========================================
 * ExpertFee
 * Group 9 - Agriculture and Natural Resources
 *
 * Calculator for Articles:
 * 48, 49, 51, 52, 53
 *
 * Article 50 is intentionally excluded.
 *
 * Money unit: Toman
 * Area unit: Square Meter
 * ========================================
 */


/*
 * ========================================
 * Shared Mission Input
 * ========================================
 */

interface AgricultureMissionInput {

  missionType?:
    MissionType;

  missionDays?:
    number;
}


/*
 * ========================================
 * Article 48 Input
 * ========================================
 */

export interface Article48Input
  extends AgricultureMissionInput {

  article:
    48;

  discipline:
    AgricultureNaturalResourcesDiscipline;

  evaluationValueToman:
    number;
}


/*
 * ========================================
 * Article 49 Input
 * ========================================
 */

export interface Article49Input
  extends AgricultureMissionInput {

  article:
    49;

  discipline:
    AgricultureNaturalResourcesDiscipline;

  evaluationValueToman:
    number;
}


/*
 * ========================================
 * Article 51 Input
 * ========================================
 */

export interface Article51Input
  extends AgricultureMissionInput {

  article:
    51;

  discipline:
    AgricultureNaturalResourcesDiscipline;

  areaSquareMeters:
    number;
}


/*
 * ========================================
 * Article 52 Input
 * ========================================
 */

export interface Article52Input
  extends AgricultureMissionInput {

  article:
    52;

  discipline:
    AgricultureNaturalResourcesDiscipline;

  evaluationValueToman:
    number;
}


/*
 * ========================================
 * Article 53 Input
 * ========================================
 */

export interface Article53Input
  extends AgricultureMissionInput {

  article:
    53;

  discipline:
    AgricultureNaturalResourcesDiscipline;

  evaluationValueToman:
    number;
}


/*
 * ========================================
 * Calculator Input
 * ========================================
 */

export type AgricultureNaturalResourcesCalculationInput =

  | Article48Input
  | Article49Input
  | Article51Input
  | Article52Input
  | Article53Input;


/*
 * ========================================
 * Shared Result Fields
 * ========================================
 */

interface AgricultureCommonResult {

  discipline:
    AgricultureNaturalResourcesDiscipline;

  title:
    string;

  expertFeeToman:
    number;

  missionType:
    MissionType;

  missionDays:
    number;

  dailyMissionRateToman:
    number;

  missionFeeToman:
    number;

  totalPayableToman:
    number;

  finalCommonFeeResult:
    CommonFeeResult;
}


/*
 * ========================================
 * Article 48 Result
 * ========================================
 */

export interface Article48CalculationResult
  extends AgricultureCommonResult {

  article:
    48;

  serviceType:
    "GENERAL_EVALUATION";

  evaluationValueToman:
    number;

  article11FeeToman:
    number;

  additionalPercent:
    0;

  additionalFeeToman:
    0;

  article11CommonFeeResult:
    CommonFeeResult;
}


/*
 * ========================================
 * Article 49 Result
 * ========================================
 */

export interface Article49CalculationResult
  extends AgricultureCommonResult {

  article:
    49;

  serviceType:
    "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT";

  evaluationValueToman:
    number;

  article11FeeToman:
    number;

  additionalPercent:
    0;

  additionalFeeToman:
    0;

  article11CommonFeeResult:
    CommonFeeResult;
}


/*
 * ========================================
 * Article 51 Result
 * ========================================
 */

export interface Article51CalculationResult
  extends AgricultureCommonResult {

  article:
    51;

  serviceType:
    "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES";

  areaSquareMeters:
    number;

  /*
   * Number of started 1,000 m² blocks
   * above the first 1,000 m² and,
   * separately, above one hectare.
   */
  blocksAboveFirst1000:
    number;

  blocksAboveOneHectare:
    number;

  calculatedFeeBeforeCapToman:
    number;

  maximumFeeToman:
    number;

  maximumApplied:
    boolean;
}


/*
 * ========================================
 * Article 52 Result
 * ========================================
 */

export interface Article52CalculationResult
  extends AgricultureCommonResult {

  article:
    52;

  serviceType:
    "AGRICULTURAL_PROPERTY_PARTITION";

  evaluationValueToman:
    number;

  article11FeeToman:
    number;

  additionalPercent:
    20;

  additionalFeeToman:
    number;

  feeBeforeCapToman:
    number;

  maximumApplied:
    boolean;

  article11CommonFeeResult:
    CommonFeeResult;
}


/*
 * ========================================
 * Article 53 Result
 * ========================================
 */

export interface Article53CalculationResult
  extends AgricultureCommonResult {

  article:
    53;

  serviceType:
    "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION";

  evaluationValueToman:
    number;

  article11FeeToman:
    number;

  additionalPercent:
    0;

  additionalFeeToman:
    0;

  article11CommonFeeResult:
    CommonFeeResult;
}


/*
 * ========================================
 * Calculator Result
 * ========================================
 */

export type AgricultureNaturalResourcesCalculationResult =

  | Article48CalculationResult
  | Article49CalculationResult
  | Article51CalculationResult
  | Article52CalculationResult
  | Article53CalculationResult;


/*
 * ========================================
 * Validation
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
 * Article 11 Only Helper
 *
 * Used by Articles 48, 49 and 53.
 * ========================================
 */

function calculateArticle11Only(
  article:
    48 | 49 | 53,
  discipline:
    AgricultureNaturalResourcesDiscipline,
  evaluationValueToman:
    number,
  missionType?:
    MissionType,
  missionDays?:
    number
):
  Article48CalculationResult |
  Article49CalculationResult |
  Article53CalculationResult {

  assertPositiveFinite(
    evaluationValueToman,
    "evaluationValueToman"
  );


  const rule =
    getAgricultureRuleByArticle(
      article
    );


  /*
   * Base Article 11 calculation is performed
   * without mission so its pure expert fee
   * remains available in the result.
   */
  const article11Result =
    calculateCommonFee({

      baseMode:
        "ARTICLE_11",

      evaluationValueToman
    });


  const article11FeeToman =
    article11Result
      .finalExpertFeeToman;


  /*
   * Mission is added after the expert fee.
   * FIXED mode prevents recalculation of
   * Article 11 and does not impose a second
   * hidden cap.
   */
  const finalResult =
    calculateCommonFee({

      baseMode:
        "FIXED",

      fixedFeeToman:
        article11FeeToman,

      missionType,

      missionDays
    });


  const commonFields = {

    discipline,

    title:
      rule.title,

    evaluationValueToman,

    article11FeeToman,

    additionalPercent:
      0 as const,

    additionalFeeToman:
      0 as const,

    expertFeeToman:
      finalResult
        .finalExpertFeeToman,

    missionType:
      finalResult
        .missionType,

    missionDays:
      finalResult
        .missionDays,

    dailyMissionRateToman:
      finalResult
        .dailyMissionRateToman,

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


  if (
    article === 48
  ) {

    return {

      article:
        48,

      serviceType:
        "GENERAL_EVALUATION",

      ...commonFields
    };
  }


  if (
    article === 49
  ) {

    return {

      article:
        49,

      serviceType:
        "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT",

      ...commonFields
    };
  }


  return {

    article:
      53,

    serviceType:
      "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION",

    ...commonFields
  };
}


/*
 * ========================================
 * Article 48
 * ========================================
 */

export function calculateArticle48(
  input:
    Omit<Article48Input, "article">
): Article48CalculationResult {

  return calculateArticle11Only(
    48,
    input.discipline,
    input.evaluationValueToman,
    input.missionType,
    input.missionDays
  ) as Article48CalculationResult;
}


/*
 * ========================================
 * Article 49
 * ========================================
 */

export function calculateArticle49(
  input:
    Omit<Article49Input, "article">
): Article49CalculationResult {

  return calculateArticle11Only(
    49,
    input.discipline,
    input.evaluationValueToman,
    input.missionType,
    input.missionDays
  ) as Article49CalculationResult;
}


/*
 * ========================================
 * Article 51 Raw Fee
 * ========================================
 *
 * Rules:
 *
 * <= 1,000 m²
 *   800,000 Toman
 *
 * 1,001 ... 10,000 m²
 *   800,000
 *   + 80,000 per started 1,000 m² block
 *
 * > 10,000 m²
 *   1,520,000
 *   + 40,000 per started 1,000 m² block
 *     above one hectare
 *
 * Any fraction of a 1,000 m² block is
 * counted as one complete block.
 * ========================================
 */

export function calculateArticle51FeeBeforeCap(
  areaSquareMeters:
    number
): {
  blocksAboveFirst1000: number;
  blocksAboveOneHectare: number;
  calculatedFeeBeforeCapToman: number;
} {

  assertPositiveFinite(
    areaSquareMeters,
    "areaSquareMeters"
  );


  if (
    areaSquareMeters <=
      ARTICLE_51_FIRST_AREA_LIMIT_SQM
  ) {

    return {

      blocksAboveFirst1000:
        0,

      blocksAboveOneHectare:
        0,

      calculatedFeeBeforeCapToman:
        ARTICLE_51_BASE_FEE_TOMAN
    };
  }


  if (
    areaSquareMeters <=
      ARTICLE_51_ONE_HECTARE_SQM
  ) {

    const blocksAboveFirst1000 =
      Math.ceil(
        (
          areaSquareMeters -
          ARTICLE_51_FIRST_AREA_LIMIT_SQM
        ) /
        ARTICLE_51_BLOCK_SIZE_SQM
      );


    return {

      blocksAboveFirst1000,

      blocksAboveOneHectare:
        0,

      calculatedFeeBeforeCapToman:
        ARTICLE_51_BASE_FEE_TOMAN +
        (
          blocksAboveFirst1000 *
          ARTICLE_51_FIRST_BLOCK_FEE_TOMAN
        )
    };
  }


  /*
   * At exactly one hectare there are
   * nine 1,000 m² blocks above the first
   * 1,000 m².
   */
  const blocksAboveFirst1000 =
    (
      ARTICLE_51_ONE_HECTARE_SQM -
      ARTICLE_51_FIRST_AREA_LIMIT_SQM
    ) /
    ARTICLE_51_BLOCK_SIZE_SQM;


  const blocksAboveOneHectare =
    Math.ceil(
      (
        areaSquareMeters -
        ARTICLE_51_ONE_HECTARE_SQM
      ) /
      ARTICLE_51_BLOCK_SIZE_SQM
    );


  return {

    blocksAboveFirst1000,

    blocksAboveOneHectare,

    calculatedFeeBeforeCapToman:
      ARTICLE_51_ONE_HECTARE_FEE_TOMAN +
      (
        blocksAboveOneHectare *
        ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN
      )
  };
}


/*
 * ========================================
 * Article 51
 * ========================================
 */

export function calculateArticle51(
  input:
    Omit<Article51Input, "article">
): Article51CalculationResult {

  const rule =
    getAgricultureRuleByArticle(
      51
    );


  const raw =
    calculateArticle51FeeBeforeCap(
      input.areaSquareMeters
    );


  /*
   * CommonFeeEngine is used in FIXED mode
   * because Article 51 is NOT an Article 11
   * calculation.
   *
   * The explicit Article 51 cap is applied
   * before mission.
   */
  const finalResult =
    calculateCommonFee({

      baseMode:
        "FIXED",

      fixedFeeToman:
        raw.calculatedFeeBeforeCapToman,

      maximumFeeToman:
        ARTICLE_51_MAXIMUM_FEE_TOMAN,

      missionType:
        input.missionType,

      missionDays:
        input.missionDays
    });


  return {

    article:
      51,

    discipline:
      input.discipline,

    serviceType:
      "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES",

    title:
      rule.title,

    areaSquareMeters:
      input.areaSquareMeters,

    blocksAboveFirst1000:
      raw.blocksAboveFirst1000,

    blocksAboveOneHectare:
      raw.blocksAboveOneHectare,

    calculatedFeeBeforeCapToman:
      raw.calculatedFeeBeforeCapToman,

    maximumFeeToman:
      ARTICLE_51_MAXIMUM_FEE_TOMAN,

    maximumApplied:
      finalResult
        .maximumApplied,

    expertFeeToman:
      finalResult
        .finalExpertFeeToman,

    missionType:
      finalResult
        .missionType,

    missionDays:
      finalResult
        .missionDays,

    dailyMissionRateToman:
      finalResult
        .dailyMissionRateToman,

    missionFeeToman:
      finalResult
        .missionFeeToman,

    totalPayableToman:
      finalResult
        .totalPayableToman,

    finalCommonFeeResult:
      finalResult
  };
}


/*
 * ========================================
 * Article 52
 *
 * Article 11 + 20%
 *
 * Important:
 * The 20% is added to the Article 11 fee,
 * then the general 135M expert-fee cap is
 * applied, and mission is added afterwards.
 * ========================================
 */

export function calculateArticle52(
  input:
    Omit<Article52Input, "article">
): Article52CalculationResult {

  assertPositiveFinite(
    input.evaluationValueToman,
    "evaluationValueToman"
  );


  const rule =
    getAgricultureRuleByArticle(
      52
    );


  /*
   * Pure Article 11 base, without mission.
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
   * CommonFeeEngine performs:
   *
   * Article 11 base
   * + 20%
   * -> 135M cap
   * -> mission
   *
   * This matches the project-wide order.
   */
  const finalResult =
    calculateCommonFee({

      baseMode:
        "ARTICLE_11",

      evaluationValueToman:
        input.evaluationValueToman,

      increasePercent:
        ARTICLE_52_ADDITIONAL_PERCENT,

      missionType:
        input.missionType,

      missionDays:
        input.missionDays
    });


  return {

    article:
      52,

    discipline:
      input.discipline,

    serviceType:
      "AGRICULTURAL_PROPERTY_PARTITION",

    title:
      rule.title,

    evaluationValueToman:
      input.evaluationValueToman,

    article11FeeToman,

    additionalPercent:
      20,

    additionalFeeToman:
      finalResult
        .increaseAmountToman,

    feeBeforeCapToman:
      finalResult
        .feeAfterIncreaseToman,

    maximumApplied:
      finalResult
        .maximumApplied,

    expertFeeToman:
      finalResult
        .finalExpertFeeToman,

    missionType:
      finalResult
        .missionType,

    missionDays:
      finalResult
        .missionDays,

    dailyMissionRateToman:
      finalResult
        .dailyMissionRateToman,

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


/*
 * ========================================
 * Article 53
 * ========================================
 */

export function calculateArticle53(
  input:
    Omit<Article53Input, "article">
): Article53CalculationResult {

  return calculateArticle11Only(
    53,
    input.discipline,
    input.evaluationValueToman,
    input.missionType,
    input.missionDays
  ) as Article53CalculationResult;
}


/*
 * ========================================
 * Unified Group 9 Calculator
 * ========================================
 */

export function calculateAgricultureNaturalResources(
  input:
    AgricultureNaturalResourcesCalculationInput
): AgricultureNaturalResourcesCalculationResult {

  switch (
    input.article
  ) {

    case 48:

      return calculateArticle48(
        input
      );


    case 49:

      return calculateArticle49(
        input
      );


    case 51:

      return calculateArticle51(
        input
      );


    case 52:

      return calculateArticle52(
        input
      );


    case 53:

      return calculateArticle53(
        input
      );
  }
}
