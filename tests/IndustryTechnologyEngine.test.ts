import {
  calculateIndustryTechnologyFee,
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
} from "../src/engine/IndustryTechnologyEngine";

import {
  calculateArticle45
} from "../src/engine/IndustryTechnologyCalculator";

import {
  calculateCommonFee
} from "../src/engine/CommonFeeEngine";

import {
  getMissionDailyRate
} from "../src/engine/MissionCalculator";


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


function mustThrow(
  fn: () => void,
  message: string
): void {

  let thrown =
    false;

  try {

    fn();

  } catch {

    thrown =
      true;
  }


  assert(
    thrown,
    message
  );
}


/*
 * ========================================
 * داده پایه
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
  article11
    .finalExpertFeeToman;


/*
 * ========================================
 * 1) Routing ماده 45
 * ارزیابی عادی
 * ========================================
 */

const evaluation =
  calculateIndustryTechnologyFee({

    article:
      45,

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
  "Engine routes Article 45"
);


assertEqual(
  evaluation.serviceType,
  "EVALUATION",
  "Engine routes evaluation service"
);


assertEqual(
  evaluation.expertFeeToman,
  baseFee,
  "Evaluation through Engine equals Article 11"
);


/*
 * ========================================
 * 2) تبصره 1
 * ماده 11 + 40%
 * ========================================
 */

const machinery =
  calculateIndustryTechnologyFee({

    article:
      45,

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
    baseFee *
    0.40
  );


assertEqual(
  machinery.additionalPercent,
  40,
  "Engine Note 1 percent"
);


assertEqual(
  machinery.additionalFeeToman,
  expected40,
  "Engine Note 1 additional fee"
);


assertEqual(
  machinery.expertFeeToman,
  baseFee +
    expected40,
  "Engine Note 1 = Article 11 + 40%"
);


/*
 * کنترل معنایی مهم:
 * تبصره 1 فقط 40 درصد ماده 11 نیست.
 */

assert(
  machinery.expertFeeToman >
    baseFee,
  "Engine Note 1 must increase Article 11 fee"
);


/*
 * ========================================
 * 3) تبصره 2
 * ماده 11 + 50%
 * ========================================
 */

const software =
  calculateIndustryTechnologyFee({

    article:
      45,

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
    baseFee *
    0.50
  );


assertEqual(
  software.additionalPercent,
  50,
  "Engine Note 2 percent"
);


assertEqual(
  software.additionalFeeToman,
  expected50,
  "Engine Note 2 additional fee"
);


assertEqual(
  software.expertFeeToman,
  baseFee +
    expected50,
  "Engine Note 2 = Article 11 + 50%"
);


/*
 * ========================================
 * 4) تطبیق Engine با Calculator
 * ========================================
 */

const directCalculator =
  calculateArticle45({

    discipline:
      "OIL_INDUSTRIES",

    serviceType:
      "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

    evaluationValueToman:
      evaluationValue
  });


const viaEngine =
  calculateIndustryTechnologyFee({

    article:
      45,

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
  viaEngine.article11FeeToman,
  directCalculator.article11FeeToman,
  "Engine and Calculator Article 11 fee"
);


assertEqual(
  viaEngine.additionalFeeToman,
  directCalculator.additionalFeeToman,
  "Engine and Calculator additional fee"
);


assertEqual(
  viaEngine.expertFeeToman,
  directCalculator.expertFeeToman,
  "Engine and Calculator final fee"
);


/*
 * ========================================
 * 5) مأموریت
 * ========================================
 */

const missionRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const mission =
  calculateIndustryTechnologyFee({

    article:
      45,

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
  baseFee +
    expected40,
  "Mission does not alter expert fee"
);


assertEqual(
  mission.missionFeeToman,
  missionRate * 2,
  "Mission fee through Engine"
);


assertEqual(
  mission.totalPayableToman,
  baseFee +
    expected40 +
    missionRate * 2,
  "Total payable through Engine"
);


/*
 * ========================================
 * 6) رشته‌های مختلف گروه 7
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

      article:
        45,

      data: {

        discipline,

        serviceType:
          "EVALUATION",

        evaluationValueToman:
          evaluationValue
      }
    });


  assertEqual(
    result.expertFeeToman,
    baseFee,
    `Evaluation routing for ${discipline}`
  );
}


/*
 * ========================================
 * 7) محدودیت نرم‌افزار
 * ========================================
 */

mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article:
        45,

      data: {

        discipline:
          "MEDICAL_ENGINEERING_EQUIPMENT",

        serviceType:
          "SOFTWARE_EXPERTISE",

        evaluationValueToman:
          evaluationValue
      }
    });
  },

  "Software expertise must remain restricted through Engine"
);


/*
 * ========================================
 * 8) اعتبارسنجی ورودی
 * ========================================
 */

mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article:
        45,

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

  "Zero evaluation value must propagate validation"
);


mustThrow(
  () => {

    calculateIndustryTechnologyFee({

      article:
        45,

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

  "Negative evaluation value must propagate validation"
);


/*
 * ========================================
 * 9) Metadata
 * ========================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.group,
  7,
  "Metadata group"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.title,
  "صنعت و فن",
  "Metadata title"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.firstArticle,
  45,
  "Metadata first article"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.lastArticle,
  45,
  "Metadata last article"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA.articles.length,
  1,
  "Metadata article count"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .articles[0]
    .article,
  45,
  "Metadata Article 45"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .articles[0]
    .automaticCalculationSupported,
  true,
  "Article 45 automatic calculation"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .articles[0]
    .usesArticle11,
  true,
  "Article 45 uses Article 11"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .disciplines
    .length,
  11,
  "Metadata discipline count"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .serviceTypes
    .length,
  3,
  "Metadata service type count"
);


/*
 * ========================================
 * 10) تبصره 3 خارج از محاسبات
 * ========================================
 */

assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
    .excludedFromCalculation
    .length,
  1,
  "One excluded item"
);


assertEqual(
  INDUSTRY_TECHNOLOGY_ENGINE_METADATA
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
  "Industry Technology Engine: ALL TESTS PASSED"
);

console.log(
  "Group 7 / Article 45 / Evaluation / +40% / +50% / Mission"
);

console.log(
  "========================================"
);
