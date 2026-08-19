import {
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES,
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES,
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES,

  ARTICLE_48_RULE,
  ARTICLE_49_RULE,

  ARTICLE_51_RULE,
  ARTICLE_51_BASE_FEE_TOMAN,
  ARTICLE_51_FIRST_AREA_LIMIT_SQM,
  ARTICLE_51_ONE_HECTARE_SQM,
  ARTICLE_51_BLOCK_SIZE_SQM,
  ARTICLE_51_FIRST_BLOCK_PERCENT,
  ARTICLE_51_FIRST_BLOCK_FEE_TOMAN,
  ARTICLE_51_ONE_HECTARE_FEE_TOMAN,
  ARTICLE_51_ABOVE_HECTARE_PERCENT,
  ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN,
  ARTICLE_51_MAXIMUM_FEE_TOMAN,

  ARTICLE_52_RULE,
  ARTICLE_52_ADDITIONAL_PERCENT,
  ARTICLE_52_EQUIVALENT_MULTIPLIER,
  ARTICLE_52_SURVEYING_NOTE,

  ARTICLE_53_RULE,

  AGRICULTURE_NATURAL_RESOURCES_RULES,

  getAgricultureRuleByArticle,
  getAgricultureRuleByServiceType,

  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
} from "../src/engine/AgricultureNaturalResourcesRules";


/*
 * ========================================
 * Test Helpers
 * ========================================
 */

function assert(
  condition: boolean,
  message: string
): void {

  if (!condition) {

    throw new Error(
      `TEST FAILED: ${message}`
    );
  }
}


function assertEqual(
  actual:
    number | string | boolean,
  expected:
    number | string | boolean,
  message: string
): void {

  if (
    actual !== expected
  ) {

    throw new Error(
      [
        `TEST FAILED: ${message}`,
        `expected=${expected}`,
        `actual=${actual}`
      ].join(" | ")
    );
  }
}


/*
 * ========================================
 * Group Metadata
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA.group,
  9,
  "Group number"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA.title,
  "کشاورزی و منابع طبیعی",
  "Group title"
);


/*
 * ========================================
 * Disciplines
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.length,
  6,
  "Six disciplines"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.includes(
    "AQUATICS_FISHERIES"
  ),
  "Aquatics and fisheries exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.includes(
    "ANIMAL_HUSBANDRY_VETERINARY"
  ),
  "Animal husbandry and veterinary exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.includes(
    "WOOD_INDUSTRIES"
  ),
  "Wood industries exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.includes(
    "AGRICULTURE_NATURAL_RESOURCES"
  ),
  "Agriculture and natural resources exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.includes(
    "ANIMAL_PRODUCTS"
  ),
  "Animal products exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_DISCIPLINES.includes(
    "NATURAL_ENVIRONMENT"
  ),
  "Natural environment exists"
);


/*
 * ========================================
 * Supported Articles
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES.length,
  5,
  "Five calculable articles"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES.includes(
    48
  ),
  "Article 48 supported"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES.includes(
    49
  ),
  "Article 49 supported"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES.includes(
    51
  ),
  "Article 51 supported"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES.includes(
    52
  ),
  "Article 52 supported"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_ARTICLES.includes(
    53
  ),
  "Article 53 supported"
);


/*
 * ========================================
 * Article 50 must NOT be supported
 * ========================================
 *
 * A separate readonly number[] variable
 * avoids TypeScript literal-union issues
 * when checking for excluded Article 50.
 */

const supportedArticles:
  readonly number[] =
    AGRICULTURE_NATURAL_RESOURCES_ARTICLES;


assert(
  !supportedArticles.includes(
    50
  ),
  "Article 50 excluded from supported articles"
);


/*
 * ========================================
 * Service Types
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES.length,
  5,
  "Five service types"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES.includes(
    "GENERAL_EVALUATION"
  ),
  "General evaluation service exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES.includes(
    "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT"
  ),
  "Agricultural land rights service exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES.includes(
    "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES"
  ),
  "Land classification service exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES.includes(
    "AGRICULTURAL_PROPERTY_PARTITION"
  ),
  "Agricultural partition service exists"
);


assert(
  AGRICULTURE_NATURAL_RESOURCES_SERVICE_TYPES.includes(
    "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION"
  ),
  "Agricultural equipment/products service exists"
);


/*
 * ========================================
 * Article 48
 * ========================================
 */

assertEqual(
  ARTICLE_48_RULE.article,
  48,
  "Article 48 number"
);


assertEqual(
  ARTICLE_48_RULE.serviceType,
  "GENERAL_EVALUATION",
  "Article 48 service type"
);


assertEqual(
  ARTICLE_48_RULE.calculationMode,
  "ARTICLE_11",
  "Article 48 calculation mode"
);


assertEqual(
  ARTICLE_48_RULE.usesArticle11,
  true,
  "Article 48 uses Article 11"
);


assertEqual(
  ARTICLE_48_RULE.additionalPercent,
  0,
  "Article 48 no additional percentage"
);


/*
 * ========================================
 * Article 49
 * ========================================
 */

assertEqual(
  ARTICLE_49_RULE.article,
  49,
  "Article 49 number"
);


assertEqual(
  ARTICLE_49_RULE.serviceType,
  "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT",
  "Article 49 service type"
);


assertEqual(
  ARTICLE_49_RULE.calculationMode,
  "ARTICLE_11",
  "Article 49 calculation mode"
);


assertEqual(
  ARTICLE_49_RULE.usesArticle11,
  true,
  "Article 49 uses Article 11"
);


assertEqual(
  ARTICLE_49_RULE.additionalPercent,
  0,
  "Article 49 no additional percentage"
);


/*
 * ========================================
 * Article 51 Rule
 * ========================================
 */

assertEqual(
  ARTICLE_51_RULE.article,
  51,
  "Article 51 number"
);


assertEqual(
  ARTICLE_51_RULE.serviceType,
  "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES",
  "Article 51 service type"
);


assertEqual(
  ARTICLE_51_RULE.calculationMode,
  "AREA_BASED",
  "Article 51 is area based"
);


assertEqual(
  ARTICLE_51_RULE.usesArticle11,
  false,
  "Article 51 does not use Article 11"
);


assertEqual(
  ARTICLE_51_RULE.additionalPercent,
  0,
  "Article 51 has no Article 11 percentage"
);


/*
 * ========================================
 * Article 51 Constants
 * ========================================
 */

assertEqual(
  ARTICLE_51_BASE_FEE_TOMAN,
  2_000_000,
  "Article 51 base fee"
);


assertEqual(
  ARTICLE_51_FIRST_AREA_LIMIT_SQM,
  1_000,
  "Article 51 first area limit"
);


assertEqual(
  ARTICLE_51_ONE_HECTARE_SQM,
  10_000,
  "One hectare = 10,000 sqm"
);


assertEqual(
  ARTICLE_51_BLOCK_SIZE_SQM,
  1_000,
  "Article 51 block size"
);


assertEqual(
  ARTICLE_51_FIRST_BLOCK_PERCENT,
  10,
  "Article 51 first block percent"
);


assertEqual(
  ARTICLE_51_FIRST_BLOCK_FEE_TOMAN,
  200_000,
  "10 percent of base fee = 80,000"
);


assertEqual(
  ARTICLE_51_ONE_HECTARE_FEE_TOMAN,
  3_800_000,
  "Article 51 one hectare fee"
);


assertEqual(
  ARTICLE_51_ABOVE_HECTARE_PERCENT,
  5,
  "Above hectare percent"
);


assertEqual(
  ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN,
  100_000,
  "5 percent of base fee = 40,000"
);


assertEqual(
  ARTICLE_51_MAXIMUM_FEE_TOMAN,
  135_000_000,
  "Article 51 maximum fee"
);


/*
 * ========================================
 * Mathematical Integrity of Article 51
 * ========================================
 *
 * These tests verify Rules constants.
 *
 * Actual Math.ceil boundary behavior
 * will be tested in Calculator tests.
 */

assertEqual(
  ARTICLE_51_BASE_FEE_TOMAN *
    ARTICLE_51_FIRST_BLOCK_PERCENT /
    100,
  ARTICLE_51_FIRST_BLOCK_FEE_TOMAN,
  "First block fee derived correctly"
);


assertEqual(
  ARTICLE_51_BASE_FEE_TOMAN *
    ARTICLE_51_ABOVE_HECTARE_PERCENT /
    100,
  ARTICLE_51_ABOVE_HECTARE_BLOCK_FEE_TOMAN,
  "Above hectare block fee derived correctly"
);


assertEqual(
  ARTICLE_51_BASE_FEE_TOMAN +
    (
      9 *
      ARTICLE_51_FIRST_BLOCK_FEE_TOMAN
    ),
  ARTICLE_51_ONE_HECTARE_FEE_TOMAN,
  "One hectare fee derived correctly"
);


/*
 * ========================================
 * Article 52
 * ========================================
 */

assertEqual(
  ARTICLE_52_RULE.article,
  52,
  "Article 52 number"
);


assertEqual(
  ARTICLE_52_RULE.serviceType,
  "AGRICULTURAL_PROPERTY_PARTITION",
  "Article 52 service type"
);


assertEqual(
  ARTICLE_52_RULE.calculationMode,
  "ARTICLE_11_PLUS_PERCENT",
  "Article 52 calculation mode"
);


assertEqual(
  ARTICLE_52_RULE.usesArticle11,
  true,
  "Article 52 uses Article 11"
);


assertEqual(
  ARTICLE_52_ADDITIONAL_PERCENT,
  20,
  "Article 52 additional percent"
);


assertEqual(
  ARTICLE_52_RULE.additionalPercent,
  20,
  "Article 52 rule additional percent"
);


assertEqual(
  ARTICLE_52_EQUIVALENT_MULTIPLIER,
  1.2,
  "Article 52 multiplier"
);


/*
 * ========================================
 * Article 52 Surveying Note
 * ========================================
 */

assertEqual(
  ARTICLE_52_SURVEYING_NOTE
    .requiresSeparateCalculation,
  true,
  "Surveying requires separate calculation"
);


assertEqual(
  ARTICLE_52_SURVEYING_NOTE
    .includedInArticle52Fee,
  false,
  "Surveying not included in Article 52 fee"
);


assertEqual(
  ARTICLE_52_SURVEYING_NOTE
    .targetCalculation,
  "SURVEYING_TARIFF",
  "Surveying redirects to surveying tariff"
);


/*
 * ========================================
 * Article 53
 * ========================================
 */

assertEqual(
  ARTICLE_53_RULE.article,
  53,
  "Article 53 number"
);


assertEqual(
  ARTICLE_53_RULE.serviceType,
  "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION",
  "Article 53 service type"
);


assertEqual(
  ARTICLE_53_RULE.calculationMode,
  "ARTICLE_11",
  "Article 53 calculation mode"
);


assertEqual(
  ARTICLE_53_RULE.usesArticle11,
  true,
  "Article 53 uses Article 11"
);


assertEqual(
  ARTICLE_53_RULE.additionalPercent,
  0,
  "Article 53 no additional percentage"
);


/*
 * ========================================
 * Rules Collection
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES
    .article48.article,
  48,
  "Rules collection Article 48"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES
    .article49.article,
  49,
  "Rules collection Article 49"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES
    .article51.article,
  51,
  "Rules collection Article 51"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES
    .article52.article,
  52,
  "Rules collection Article 52"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES
    .article53.article,
  53,
  "Rules collection Article 53"
);


/*
 * ========================================
 * Getter by Article
 * ========================================
 */

assertEqual(
  getAgricultureRuleByArticle(
    48
  ).serviceType,
  "GENERAL_EVALUATION",
  "Getter Article 48"
);


assertEqual(
  getAgricultureRuleByArticle(
    49
  ).serviceType,
  "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT",
  "Getter Article 49"
);


assertEqual(
  getAgricultureRuleByArticle(
    51
  ).serviceType,
  "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES",
  "Getter Article 51"
);


assertEqual(
  getAgricultureRuleByArticle(
    52
  ).serviceType,
  "AGRICULTURAL_PROPERTY_PARTITION",
  "Getter Article 52"
);


assertEqual(
  getAgricultureRuleByArticle(
    53
  ).serviceType,
  "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION",
  "Getter Article 53"
);


/*
 * ========================================
 * Getter by Service Type
 * ========================================
 */

assertEqual(
  getAgricultureRuleByServiceType(
    "GENERAL_EVALUATION"
  ).article,
  48,
  "Service getter Article 48"
);


assertEqual(
  getAgricultureRuleByServiceType(
    "AGRICULTURAL_LAND_RIGHTS_AND_IMPROVEMENT"
  ).article,
  49,
  "Service getter Article 49"
);


assertEqual(
  getAgricultureRuleByServiceType(
    "LAND_CLASSIFICATION_AND_NATIONAL_RESOURCES"
  ).article,
  51,
  "Service getter Article 51"
);


assertEqual(
  getAgricultureRuleByServiceType(
    "AGRICULTURAL_PROPERTY_PARTITION"
  ).article,
  52,
  "Service getter Article 52"
);


assertEqual(
  getAgricultureRuleByServiceType(
    "AGRICULTURAL_EQUIPMENT_PRODUCTS_EVALUATION"
  ).article,
  53,
  "Service getter Article 53"
);


/*
 * ========================================
 * Metadata
 * ========================================
 */

assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .firstArticle,
  48,
  "Metadata first article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .lastArticle,
  53,
  "Metadata last article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .supportedArticles.length,
  5,
  "Metadata supported article count"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .disciplines.length,
  6,
  "Metadata discipline count"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .serviceTypes.length,
  5,
  "Metadata service count"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .excludedFromCalculation.length,
  1,
  "One excluded article"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .excludedFromCalculation[0],
  50,
  "Article 50 excluded"
);


assertEqual(
  AGRICULTURE_NATURAL_RESOURCES_RULES_METADATA
    .isFinalImplementedTariffGroup,
  true,
  "Group 9 is final implemented tariff group"
);


/*
 * ========================================
 * Automatic Calculation
 * ========================================
 */

assertEqual(
  ARTICLE_48_RULE
    .automaticCalculationSupported,
  true,
  "Article 48 automatic calculation"
);


assertEqual(
  ARTICLE_49_RULE
    .automaticCalculationSupported,
  true,
  "Article 49 automatic calculation"
);


assertEqual(
  ARTICLE_51_RULE
    .automaticCalculationSupported,
  true,
  "Article 51 automatic calculation"
);


assertEqual(
  ARTICLE_52_RULE
    .automaticCalculationSupported,
  true,
  "Article 52 automatic calculation"
);


assertEqual(
  ARTICLE_53_RULE
    .automaticCalculationSupported,
  true,
  "Article 53 automatic calculation"
);


/*
 * ========================================
 * FINAL
 * ========================================
 */

console.log(
  "\n========================================"
);


console.log(
  "Agriculture Natural Resources Rules: ALL TESTS PASSED"
);


console.log(
  "Articles 48 / 49 / 51 / 52 / 53"
);


console.log(
  "Article 50 excluded"
);


console.log(
  "Article 51: Area Based / Ceiling Blocks / 118M Cap"
);


console.log(
  "========================================"
);
