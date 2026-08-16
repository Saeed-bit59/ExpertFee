import {
  ARTICLE_45_EVALUATION_RULE,
  ARTICLE_45_NOTE_1_RULE,
  ARTICLE_45_NOTE_2_RULE,
  ARTICLE_45_RULES,
  INDUSTRY_TECHNOLOGY_DISCIPLINES,
  INDUSTRY_TECHNOLOGY_SERVICE_TYPES,
  INDUSTRY_TECHNOLOGY_RULES_METADATA,
  getArticle45Rule
} from "../src/engine/IndustryTechnologyRules";


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
 * ماده 45 - ارزیابی
 * ========================================
 */

assertEqual(
  ARTICLE_45_EVALUATION_RULE.article,
  45,
  "Evaluation article"
);

assertEqual(
  ARTICLE_45_EVALUATION_RULE.serviceType,
  "EVALUATION",
  "Evaluation service type"
);

assertEqual(
  ARTICLE_45_EVALUATION_RULE.usesArticle11,
  true,
  "Evaluation uses Article 11"
);

assertEqual(
  ARTICLE_45_EVALUATION_RULE.adjustmentMode,
  "NONE",
  "Evaluation has no adjustment"
);

assertEqual(
  ARTICLE_45_EVALUATION_RULE.additionalPercent,
  0,
  "Evaluation additional percent"
);

assertEqual(
  ARTICLE_45_EVALUATION_RULE.equivalentMultiplier,
  1,
  "Evaluation multiplier"
);


/*
 * ========================================
 * تبصره 1
 * ماده 11 + 40%
 * ========================================
 */

assertEqual(
  ARTICLE_45_NOTE_1_RULE.article,
  45,
  "Note 1 article"
);

assertEqual(
  ARTICLE_45_NOTE_1_RULE.serviceType,
  "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",
  "Note 1 service type"
);

assertEqual(
  ARTICLE_45_NOTE_1_RULE.usesArticle11,
  true,
  "Note 1 uses Article 11"
);

assertEqual(
  ARTICLE_45_NOTE_1_RULE.adjustmentMode,
  "ADD_PERCENT_TO_ARTICLE_11",
  "Note 1 adjustment mode"
);

assertEqual(
  ARTICLE_45_NOTE_1_RULE.additionalPercent,
  40,
  "Note 1 must add 40 percent"
);

assertEqual(
  ARTICLE_45_NOTE_1_RULE.equivalentMultiplier,
  1.4,
  "Note 1 must equal Article 11 x 1.40"
);

assertEqual(
  ARTICLE_45_NOTE_1_RULE.restrictedToMachinery,
  true,
  "Note 1 restricted to machinery"
);

assertEqual(
  ARTICLE_45_NOTE_1_RULE.restrictedToSoftware,
  false,
  "Note 1 not restricted to software"
);


/*
 * کنترل معنایی بسیار مهم:
 *
 * تبصره 1 نباید به اشتباه فقط 40 درصد
 * ماده 11 در نظر گرفته شود.
 */

assert(
  ARTICLE_45_NOTE_1_RULE
    .equivalentMultiplier > 1,
  "Note 1 is an addition, not 40% standalone fee"
);


/*
 * ========================================
 * تبصره 2
 * ماده 11 + 50%
 * ========================================
 */

assertEqual(
  ARTICLE_45_NOTE_2_RULE.article,
  45,
  "Note 2 article"
);

assertEqual(
  ARTICLE_45_NOTE_2_RULE.serviceType,
  "SOFTWARE_EXPERTISE",
  "Note 2 service type"
);

assertEqual(
  ARTICLE_45_NOTE_2_RULE.usesArticle11,
  true,
  "Note 2 uses Article 11"
);

assertEqual(
  ARTICLE_45_NOTE_2_RULE.adjustmentMode,
  "ADD_PERCENT_TO_ARTICLE_11",
  "Note 2 adjustment mode"
);

assertEqual(
  ARTICLE_45_NOTE_2_RULE.additionalPercent,
  50,
  "Note 2 must add 50 percent"
);

assertEqual(
  ARTICLE_45_NOTE_2_RULE.equivalentMultiplier,
  1.5,
  "Note 2 must equal Article 11 x 1.50"
);

assertEqual(
  ARTICLE_45_NOTE_2_RULE.restrictedToMachinery,
  false,
  "Note 2 not restricted to machinery"
);

assertEqual(
  ARTICLE_45_NOTE_2_RULE.restrictedToSoftware,
  true,
  "Note 2 restricted to software"
);


/*
 * ========================================
 * getArticle45Rule
 * ========================================
 */

assertEqual(
  getArticle45Rule(
    "EVALUATION"
  ).additionalPercent,
  0,
  "Getter evaluation"
);

assertEqual(
  getArticle45Rule(
    "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT"
  ).additionalPercent,
  40,
  "Getter Note 1"
);

assertEqual(
  getArticle45Rule(
    "SOFTWARE_EXPERTISE"
  ).additionalPercent,
  50,
  "Getter Note 2"
);


/*
 * ========================================
 * ARTICLE_45_RULES
 * ========================================
 */

assertEqual(
  ARTICLE_45_RULES
    .evaluation
    .equivalentMultiplier,
  1,
  "Rules evaluation multiplier"
);

assertEqual(
  ARTICLE_45_RULES
    .machineryEvaluationWithTechnicalAssessment
    .equivalentMultiplier,
  1.4,
  "Rules Note 1 multiplier"
);

assertEqual(
  ARTICLE_45_RULES
    .softwareExpertise
    .equivalentMultiplier,
  1.5,
  "Rules Note 2 multiplier"
);


/*
 * ========================================
 * رشته‌های گروه 7
 * ========================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_DISCIPLINES.length,
  11,
  "Group 7 discipline count"
);

assert(
  INDUSTRY_TECHNOLOGY_DISCIPLINES.includes(
    "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS"
  ),
  "Must contain electrical machinery factory installations"
);

assert(
  INDUSTRY_TECHNOLOGY_DISCIPLINES.includes(
    "COMPUTER_INFORMATION_TECHNOLOGY"
  ),
  "Must contain computer and IT"
);

assert(
  INDUSTRY_TECHNOLOGY_DISCIPLINES.includes(
    "MEDICAL_ENGINEERING_EQUIPMENT"
  ),
  "Must contain medical engineering"
);


/*
 * ========================================
 * انواع خدمات
 * ========================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_SERVICE_TYPES.length,
  3,
  "Only three calculable service types"
);

assert(
  INDUSTRY_TECHNOLOGY_SERVICE_TYPES.includes(
    "EVALUATION"
  ),
  "Evaluation service exists"
);

assert(
  INDUSTRY_TECHNOLOGY_SERVICE_TYPES.includes(
    "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT"
  ),
  "Machinery technical assessment service exists"
);

assert(
  INDUSTRY_TECHNOLOGY_SERVICE_TYPES.includes(
    "SOFTWARE_EXPERTISE"
  ),
  "Software expertise service exists"
);


/*
 * ========================================
 * Metadata
 * ========================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA.group,
  7,
  "Metadata group"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA.article,
  45,
  "Metadata article"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA.usesArticle11,
  true,
  "Metadata uses Article 11"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA
    .automaticCalculationSupported,
  true,
  "Automatic calculation supported"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA
    .excludedFromCalculation
    .length,
  1,
  "One excluded rule"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA
    .excludedFromCalculation[0],
  "ARTICLE_45_NOTE_3",
  "Article 45 Note 3 excluded"
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
  "Industry Technology Rules: ALL TESTS PASSED"
);

console.log(
  "Article 45 / Note 1 +40% / Note 2 +50%"
);

console.log(
  "========================================"
);
