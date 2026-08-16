/*
 * ========================================
 * ExpertFee
 * Group 9 - Agriculture and Natural Resources
 *
 * Articles:
 * 48, 49, 51, 52, 53
 *
 * Article 50 is excluded from automatic
 * calculation because it refers to Article 9.
 *
 * Unit of money: Toman
 * Unit of area: Square Meter
 * ========================================
 */

import {
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN
} from "../config/Tariff1405";


/*
 * ========================================
 * Disciplines
 * ========================================
 */

export const AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES = [

  "AQUATICS_FISHERIES",

  "ANIMAL_HUSBANDRY_VETERINARY",

  "WOOD_INDUSTRIES",

  "AGRICULTURE_NATURAL_RESOURCES",

  "PLANT_PROTECTION",

  "ANIMAL_PRODUCTS",

  "NATURAL_ENVIRONMENT"

] as const;


export type AgricultureNaturalResourcesDiscipline =
  typeof AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES[number];


/*
 * ========================================
 * Supported Articles
 * ========================================
 */

export const AGRICULTURE_NATURAL_RESOURCES_ARTICLES = [

  48,
  49,
  51,
  52,
  53

] as const;


export type AgricultureNaturalResourcesArticle =
  typeof AGRICULTURE_NATURAL_RESOURCES_ARTICLES[number];


/*
 * ========================================
 * Service Types
 * ========================================
 */

export const AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES = [

  /*
   * Article 48
   */
  "GENERAL_EVALUATION",

  /*
   * Article 49
   */
  "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT",

  /*
   * Article 51
   */
  "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES",

  /*
   * Article 52
   */
  "AGRICULTURAL_PROPERTY_PARTITION",

  /*
   * Article 53
   */
  "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION"

] as const;


export type AgricultureNaturalResourcesServiceType =
  typeof AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES[number];


/*
 * ========================================
 * Calculation Modes
 * ========================================
 */

export type AgricultureCalculationMode =

  | "ARTICLE_11"

  | "ARTICLE_11_PLUS_PERCENT"

  | "AREA_BASED";


/*
 * ========================================
 * Common Rule Interface
 * ========================================
 */

export interface AgricultureNaturalResourcesRule {

  article:
    AgricultureNaturalResourcesArticle;

  serviceType:
    AgricultureNaturalResourcesServiceType;

  title:
    string;

  calculationMode:
    AgricultureCalculationMode;

  usesArticle11:
    boolean;

  additionalPercent:
    number;

  automaticCalculationSupported:
    true;
}


/*
 * ========================================
 * Article 48
 *
 * General evaluation
 * According to Article 11
 * ========================================
 */

export const ARTICLE_48_RULE:
  AgricultureNaturalResourcesRule = {

    article:
      48,

    serviceType:
      "GENERAL_EVALUATION",

    title:
      "ارزیابی",

    calculationMode:
      "ARTICLE_11",

    usesArticle11:
      true,

    additionalPercent:
      0,

    automaticCalculationSupported:
      true
  };


/*
 * ========================================
 * Article 49
 *
 * Includes:
 *
 * - حق آبادانی
 * - حق ریشه و زراعت
 * - نسق زارعانه
 * - هزینه احیا
 * - هزینه اصلاح
 * - تسطیح زمین کشاورزی و باغات
 * - حق غارسی
 *
 * According to Article 11
 * ========================================
 */

export const ARTICLE_49_RULE:
  AgricultureNaturalResourcesRule = {

    article:
      49,

    serviceType:
      "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT",

    title:
      "حقوق و هزینه‌های مرتبط با اراضی کشاورزی",

    calculationMode:
      "ARTICLE_11",

    usesArticle11:
      true,

    additionalPercent:
      0,

    automaticCalculationSupported:
      true
  };


/*
 * ========================================
 * Article 51 Constants
 * ========================================
 *
 * Base fee:
 *
 * Up to 1,000 m²
 * = 8,000,000 Rial
 * = 800,000 Toman
 */

export const ARTICLE_51_BASE_FEE_TOMAN =
  800_000;


/*
 * ========================================
 * First Area Threshold
 * ========================================
 */

export const ARTICLE_51_FIRST_AREA_LIMIT_SQM =
  1_000;


/*
 * ========================================
 * Second Area Threshold
 *
 * 1 hectare = 10,000 m²
 * ========================================
 */

export const ARTICLE_51_ONE_HECTARE_SQM =
  10_000;


/*
 * ========================================
 * Area Block
 *
 * Every started 1,000 m² is considered
 * one complete block.
 *
 * Calculator must therefore use Math.ceil.
 * ========================================
 */

export const ARTICLE_51_BLOCK_SIZE_SQM =
  1_000;


/*
 * ========================================
 * Increase from 1,000 m² to 1 hectare
 *
 * 10% of 800,000
 * = 80,000 Toman
 *
 * per additional started 1,000 m² block
 * ========================================
 */

export const ARTICLE_51_FIRST_BLOCK_PERCENT =
  10;


export const ARTICLE_51_FIRST_BLOCK_FEE_TOMAN =
  80_000;


/*
 * ========================================
 * Fee exactly at one hectare
 *
 * 800,000
 * +
 * 9 × 80,000
 *
 * = 1,520,000 Toman
 * ========================================
 */

export const ARTICLE_51_ONE_HECTARE_FEE_TOMAN =
  1_520_000;


/*
 * ========================================
 * Increase above one hectare
 *
 * 5% of 800,000
 * = 40,000 Toman
 *
 * per additional started 1,000 m² block
 * ========================================
 */

export const ARTICLE_51_ABOVE_HECTARE_PERCENT =
  5;


export const ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN =
  40_000;


/*
 * ========================================
 * Article 51 Maximum Fee
 * ========================================
 *
 * Tariff 1405: the supplied text of Article 51
 * defines the area-based calculation but does not
 * state a separate Article 51 cap. Therefore the
 * software applies the current general maximum from
 * the central Tariff 1405 configuration.
 *
 * General maximum in Tariff 1405:
 * 1,350,000,000 Rial = 135,000,000 Toman
 */

export const ARTICLE_51_MAXIMUM_FEE_TOMAN =
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN;


/*
 * ========================================
 * Article 51 Rule
 * ========================================
 */

export const ARTICLE_51_RULE:
  AgricultureNaturalResourcesRule = {

    article:
      51,

    serviceType:
      "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES",

    title:
      "تشخیص اراضی و منابع ملی و مستثنیات",

    calculationMode:
      "AREA_BASED",

    usesArticle11:
      false,

    additionalPercent:
      0,

    automaticCalculationSupported:
      true
  };


/*
 * ========================================
 * Article 52
 *
 * Agricultural property partition
 *
 * Article 11 + 20%
 * ========================================
 */

export const ARTICLE_52_ADDITIONAL_PERCENT =
  20;


export const ARTICLE_52_EQUIVALENT_MULTIPLIER =
  1.20;


export const ARTICLE_52_RULE:
  AgricultureNaturalResourcesRule = {

    article:
      52,

    serviceType:
      "AGRICULTURAL_PROPERTY_PARTITION",

    title:
      "افراز املاک کشاورزی",

    calculationMode:
      "ARTICLE_11_PLUS_PERCENT",

    usesArticle11:
      true,

    additionalPercent:
      ARTICLE_52_ADDITIONAL_PERCENT,

    automaticCalculationSupported:
      true
  };


/*
 * ========================================
 * Article 52 Note
 * ========================================
 *
 * If preparation of a map is required,
 * surveying fee is calculated according
 * to the relevant surveying tariff.
 *
 * This fee is NOT duplicated inside
 * Group 9 Calculator.
 *
 * UI / Router can direct the user to
 * the existing surveying calculation.
 */

export const ARTICLE_52_SURVEYING_NOTE = {

  requiresSeparateCalculation:
    true,

  includedInArticle52Fee:
    false,

  targetCalculation:
    "SURVEYING_TARIFF"

} as const;


/*
 * ========================================
 * Article 53
 *
 * Evaluation of:
 *
 * - related equipment
 * - raw materials
 * - agricultural products
 * - livestock products
 * - forest products
 * - fisheries products
 * - beekeeping products
 * - warehouse inventory
 *
 * According to Article 11
 * ========================================
 */

export const ARTICLE_53_RULE:
  AgricultureNaturalResourcesRule = {

    article:
      53,

    serviceType:
      "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION",

    title:
      "ارزیابی تجهیزات، مواد اولیه و محصولات و فرآورده‌ها",

    calculationMode:
      "ARTICLE_11",

    usesArticle11:
      true,

    additionalPercent:
      0,

    automaticCalculationSupported:
      true
  };


/*
 * ========================================
 * Rules Collection
 * ========================================
 */

export const AGRICULTURE_NATURAL_RESOURCES_RULES = {

  article48:
    ARTICLE_48_RULE,

  article49:
    ARTICLE_49_RULE,

  article51:
    ARTICLE_51_RULE,

  article52:
    ARTICLE_52_RULE,

  article53:
    ARTICLE_53_RULE

} as const;


/*
 * ========================================
 * Get Rule by Article
 * ========================================
 */

export function getAgricultureRuleByArticle(
  article:
    AgricultureNaturalResourcesArticle
): AgricultureNaturalResourcesRule {

  switch (
    article
  ) {

    case 48:

      return ARTICLE_48_RULE;


    case 49:

      return ARTICLE_49_RULE;


    case 51:

      return ARTICLE_51_RULE;


    case 52:

      return ARTICLE_52_RULE;


    case 53:

      return ARTICLE_53_RULE;
  }
}


/*
 * ========================================
 * Get Rule by Service Type
 * ========================================
 */

export function getAgricultureRuleByServiceType(
  serviceType:
    AgricultureNaturalResourcesServiceType
): AgricultureNaturalResourcesRule {

  switch (
    serviceType
  ) {

    case "GENERAL_EVALUATION":

      return ARTICLE_48_RULE;


    case "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT":

      return ARTICLE_49_RULE;


    case "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES":

      return ARTICLE_51_RULE;


    case "AGRICULTURAL_PROPERTY_PARTITION":

      return ARTICLE_52_RULE;


    case "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION":

      return ARTICLE_53_RULE;
  }
}


/*
 * ========================================
 * Group 9 Metadata
 * ========================================
 */

export const AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA = {

  group:
    9,

  title:
    "کشاورزی و منابع طبیعی",

  firstArticle:
    48,

  lastArticle:
    53,

  supportedArticles:
    AGRICULTURE_NATURAL_RESOURCES_ARTICLES,

  disciplines:
    AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES,

  serviceTypes:
    AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES,

  /*
   * Article 50:
   *
   * Sampling for quality determination
   * and classification.
   *
   * Fee is determined by agreement
   * according to Article 9.
   *
   * Therefore it is excluded from
   * automatic calculation.
   */
  excludedFromCalculation: [
    50
  ],

  /*
   * Articles after Group 9 are outside
   * the selected scope of this software.
   */
  isFinalImplementedTariffGroup:
    true

} as const;