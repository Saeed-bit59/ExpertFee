import {
  calculateIndustryTechnologyFee,
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
} from "../src/engine/IndustryTechnologyEngine";

import {
  getArticle45Rule,
  INDUSTRY_TECHNOLOGY_RULES_METADATA
} from "../src/engine/IndustryTechnologyRules";

import {
  calculateArticle45
} from "../src/engine/IndustryTechnologyCalculator";

import {
  calculateCommonFee
} from "../src/engine/CommonFeeEngine";

import {
  getMissionDailyRate
} from "../src/engine/MissionCalculator";


/*
 * ========================================
 * ExpertFee
 * Group 7 - Final Integration Test
 * Article 45
 * ========================================
 *
 * زنجیره مورد آزمون:
 *
 * IndustryTechnologyRules
 *   -> IndustryTechnologyCalculator
 *   -> IndustryTechnologyEngine
 *   -> CommonFeeEngine
 *   -> Article 11
 *   -> MissionCalculator
 *
 * مسیرهای نهایی:
 *
 * 1) Evaluation
 *    Article 11
 *
 * 2) Machinery evaluation with technical
 *    assessment
 *    Article 11 + 40%
 *
 * 3) Software expertise
 *    Article 11 + 50%
 *
 * تبصره 3 طبق تصمیم پروژه
 * از محاسبات خارج است.
 */


/*
 * ========================================
 * Test helpers
 * ========================================
 */

function assert(
  condition: boolean,
  message: string
): void {

  if (!condition) {
    throw new Error(
      `INTEGRATION TEST FAILED: ${message}`
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

  if (actual !== expected) {
    throw new Error(
      [
        `INTEGRATION TEST FAILED: ${message}`,
        `expected=${expected}`,
        `actual=${actual}`
      ].join(" | ")
    );
  }
}


function mustThrow(
  fn: () => void,
  message: string
): void {

  let thrown = false;

  try {
    fn();
  } catch {
    thrown = true;
  }

  assert(
    thrown,
    message
  );
}


/*
 * ========================================
 * Base Article 11 reference
 * ========================================
 */

const evaluationValue =
  1_000_000_000;


const article11 =
  calculateCommonFee({

    baseMode:
      "ARTICLE_11",

    evaluationValueToman:
      evaluationValue
  });


const baseFee =
  article11.finalExpertFeeToman;


/*
 * ========================================
 * 1) Rules integrity
 * ========================================
 */

const evaluationRule =
  getArticle45Rule(
    "EVALUATION"
  );

const machineryRule =
  getArticle45Rule(
    "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT"
  );

const softwareRule =
  getArticle45Rule(
    "SOFTWARE_EXPERTISE"
  );


assertEqual(
  evaluationRule.additionalPercent,
  0,
  "Evaluation rule = Article 11"
);

assertEqual(
  machineryRule.additionalPercent,
  40,
  "Machinery rule adds 40%"
);

assertEqual(
  machineryRule.equivalentMultiplier,
  1.4,
  "Machinery multiplier = 1.40"
);

assertEqual(
  softwareRule.additionalPercent,
  50,
  "Software rule adds 50%"
);

assertEqual(
  softwareRule.equivalentMultiplier,
  1.5,
  "Software multiplier = 1.50"
);


/*
 * ========================================
 * 2) Evaluation path
 * Engine -> Calculator -> Article 11
 * ========================================
 */

const evaluation =
  calculateIndustryTechnologyFee({

    article: 45,

    data: {

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "EVALUATION",

      evaluationValueToman:
        evaluationValue
    }
  });


assertEqual(
  evaluation.article,
  45,
  "Evaluation Article 45"
);

assertEqual(
  evaluation.article11FeeToman,
  baseFee,
  "Evaluation Article 11 base"
);

assertEqual(
  evaluation.additionalPercent,
  0,
  "Evaluation no increase"
);

assertEqual(
  evaluation.additionalFeeToman,
  0,
  "Evaluation no additional fee"
);

assertEqual(
  evaluation.expertFeeToman,
  baseFee,
  "Evaluation final fee equals Article 11"
);

assertEqual(
  evaluation.totalPayableToman,
  baseFee,
  "Evaluation total without mission"
);


/*
 * ========================================
 * 3) Note 1 path
 * Article 11 + 40%
 * ========================================
 */

const machinery =
  calculateIndustryTechnologyFee({

    article: 45,

    data: {

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

      evaluationValueToman:
        evaluationValue
    }
  });


const expected40 =
  Math.round(
    baseFee * 0.40
  );


assertEqual(
  machinery.article11FeeToman,
  baseFee,
  "Note 1 Article 11 base"
);

assertEqual(
  machinery.additionalFeeToman,
  expected40,
  "Note 1 additional amount"
);

assertEqual(
  machinery.expertFeeToman,
  baseFee + expected40,
  "Note 1 = Article 11 + 40%"
);

assert(
  machinery.expertFeeToman > baseFee,
  "Note 1 must be an addition, not standalone 40%"
);


/*
 * ========================================
 * 4) Note 2 path
 * Article 11 + 50%
 * ========================================
 */

const software =
  calculateIndustryTechnologyFee({

    article: 45,

    data: {

      discipline:
        "COMPUTER_INFORMATION_TECHNOLOGY",

      serviceType:
        "SOFTWARE_EXPERTISE",

      evaluationValueToman:
        evaluationValue
    }
  });


const expected50 =
  Math.round(
    baseFee * 0.50
  );


assertEqual(
  software.article11FeeToman,
  baseFee,
  "Note 2 Article 11 base"
);

assertEqual(
  software.additionalFeeToman,
  expected50,
  "Note 2 additional amount"
);

assertEqual(
  software.expertFeeToman,
  baseFee + expected50,
  "Note 2 = Article 11 + 50%"
);


/*
 * ========================================
 * 5) Calculator and Engine consistency
 * ========================================
 */

const direct =
  calculateArticle45({

    discipline:
      "OIL_INDUSTRIES",

    serviceType:
      "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

    evaluationValueToman:
      evaluationValue
  });


const throughEngine =
  calculateIndustryTechnologyFee({

    article: 45,

    data: {

      discipline:
        "OIL_INDUSTRIES",

      serviceType:
        "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

      evaluationValueToman:
        evaluationValue
    }
  });


assertEqual(
  throughEngine.article11FeeToman,
  direct.article11FeeToman,
  "Engine/Calculator base consistency"
);

assertEqual(
  throughEngine.additionalFeeToman,
  direct.additionalFeeToman,
  "Engine/Calculator addition consistency"
);

assertEqual(
  throughEngine.expertFeeToman,
  direct.expertFeeToman,
  "Engine/Calculator final consistency"
);


/*
 * ========================================
 * 6) All Group 7 disciplines
 * Evaluation must route to Article 11
 * ========================================
 */

const disciplines = [
  "ELECTROCHEMISTRY_PETROCHEMICAL_CHEMICAL",
  "NUCLEAR_ENERGY",
  "ELECTRICAL_ELECTRONICS_TELECOMMUNICATION",
  "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
  "BUILDING_INSTALLATIONS",
  "COMPUTER_INFORMATION_TECHNOLOGY",
  "GAS_INDUSTRIES",
  "OIL_INDUSTRIES",
  "AEROSPACE_INDUSTRIES",
  "MEDICAL_ENGINEERING_EQUIPMENT",
  "TEXTILE_DYEING"
] as const;


for (
  const discipline
  of disciplines
) {

  const result =
    calculateIndustryTechnologyFee({

      article: 45,

      data: {

        discipline,

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          evaluationValue
      }
    });


  assertEqual(
    result.article11FeeToman,
    baseFee,
    `Article 11 base for ${discipline}`
  );

  assertEqual(
    result.expertFeeToman,
    baseFee,
    `Evaluation fee for ${discipline}`
  );
}


/*
 * ========================================
 * 7) Note 1 across industrial disciplines
 * ========================================
 */

const oilMachinery =
  calculateIndustryTechnologyFee({

    article: 45,

    data: {

      discipline:
        "OIL_INDUSTRIES",

      serviceType:
        "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

      evaluationValueToman:
        evaluationValue
    }
  });


assertEqual(
  oilMachinery.expertFeeToman,
  baseFee + expected40,
  "Note 1 for oil industry machinery"
);


/*
 * ========================================
 * 8) Software restriction
 * ========================================
 */

mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article: 45,

      data: {

        discipline:
          "OIL_INDUSTRIES",

        serviceType:
          "SOFTWARE_EXPERTISE",

        evaluationValueToman:
          evaluationValue
      }
    });
  },

  "Software expertise only for Computer/IT"
);


/*
 * ========================================
 * 9) Mission integration
 * ========================================
 *
 * Mission is added after expert fee.
 */

const missionRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const mission =
  calculateIndustryTechnologyFee({

    article: 45,

    data: {

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

      evaluationValueToman:
        evaluationValue,

      missionType:
        "IN_PROVINCE",

      missionDays:
        2
    }
  });


assertEqual(
  mission.expertFeeToman,
  baseFee + expected40,
  "Mission does not change expert fee"
);

assertEqual(
  mission.missionFeeToman,
  missionRate * 2,
  "Mission fee"
);

assertEqual(
  mission.totalPayableToman,
  baseFee +
    expected40 +
    missionRate * 2,
  "Mission added after expert fee"
);


/*
 * ========================================
 * 10) No mission
 * ========================================
 */

assertEqual(
  evaluation.missionFeeToman,
  0,
  "Default mission fee = 0"
);

assertEqual(
  evaluation.totalPayableToman,
  evaluation.expertFeeToman,
  "No mission: payable = expert fee"
);


/*
 * ========================================
 * 11) Invalid evaluation values
 * ========================================
 */

mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article: 45,

      data: {

        discipline:
          "OIL_INDUSTRIES",

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          0
      }
    });
  },

  "Zero value rejected"
);


mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article: 45,

      data: {

        discipline:
          "OIL_INDUSTRIES",

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          -1
      }
    });
  },

  "Negative value rejected"
);


mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article: 45,

      data: {

        discipline:
          "OIL_INDUSTRIES",

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          Number.NaN
      }
    });
  },

  "NaN rejected"
);


/*
 * ========================================
 * 12) Mission validation propagation
 * ========================================
 */

mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article: 45,

      data: {

        discipline:
          "OIL_INDUSTRIES",

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          evaluationValue,

        missionType:
          "IN_PROVINCE",

        missionDays:
          0
      }
    });
  },

  "Selected mission requires at least one day"
);


mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article: 45,

      data: {

        discipline:
          "OIL_INDUSTRIES",

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          evaluationValue,

        missionType:
          "OUT_PROVINCE",

        missionDays:
          1.5
      }
    });
  },

  "Mission days must be integer"
);


/*
 * ========================================
 * 13) Rules Metadata
 * ========================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA.group,
  7,
  "Rules metadata group"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA.article,
  45,
  "Rules metadata article"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA
    .serviceTypes.length,
  3,
  "Rules metadata service count"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_RULES_METADATA
    .excludedFromCalculation[0],
  "ARTICLE_45_NOTE_3",
  "Rules metadata excludes Note 3"
);


/*
 * ========================================
 * 14) Engine Metadata
 * ========================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.group,
  7,
  "Engine metadata group"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.firstArticle,
  45,
  "Engine first article"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.lastArticle,
  45,
  "Engine last article"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .disciplines.length,
  11,
  "Engine discipline count"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .serviceTypes.length,
  3,
  "Engine service count"
);

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .excludedFromCalculation[0],
  "ARTICLE_45_NOTE_3",
  "Engine excludes Note 3"
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
  "GROUP 7 FINAL INTEGRATION: ALL TESTS PASSED"
);

console.log(
  "Article 45 / Rules / Calculator / Engine / Article 11 / Mission"
);

console.log(
  "========================================"
);
