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
    number | string,
  expected:
    number | string,
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
 * مبلغ نمونه
 * ========================================
 *
 * برای جلوگیری از وابستگی تست به محاسبه
 * دستی پلکان ماده 11، خروجی مورد انتظار
 * مستقیماً از CommonFeeEngine گرفته می‌شود.
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
 * مسیر 1
 * ارزیابی عادی
 * ========================================
 */

const evaluation =
  calculateArticle45({

    discipline:
      "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

    serviceType:
      "EVALUATION",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  evaluation.article,
  45,
  "Article number"
);


assertEqual(
  evaluation.serviceType,
  "EVALUATION",
  "Evaluation service type"
);


assertEqual(
  evaluation.article11FeeToman,
  baseFee,
  "Evaluation Article 11 base"
);


assertEqual(
  evaluation.additionalPercent,
  0,
  "Evaluation additional percent"
);


assertEqual(
  evaluation.additionalFeeToman,
  0,
  "Evaluation additional fee"
);


assertEqual(
  evaluation.expertFeeToman,
  baseFee,
  "Evaluation final fee"
);


/*
 * ========================================
 * مسیر 2
 * تبصره 1
 * ماده 11 + 40 درصد
 * ========================================
 */

const machinery =
  calculateArticle45({

    discipline:
      "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

    serviceType:
      "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

    evaluationValueToman:
      evaluationValue
  });


const expected40 =
  Math.round(
    baseFee *
    0.40
  );


assertEqual(
  machinery.article11FeeToman,
  baseFee,
  "Note 1 Article 11 base"
);


assertEqual(
  machinery.additionalPercent,
  40,
  "Note 1 additional percent"
);


assertEqual(
  machinery.additionalFeeToman,
  expected40,
  "Note 1 additional fee"
);


assertEqual(
  machinery.expertFeeToman,
  baseFee +
    expected40,
  "Note 1 must be Article 11 + 40%"
);


/*
 * کنترل حیاتی:
 * نتیجه نباید فقط 40 درصد ماده 11 باشد.
 */

assert(
  machinery.expertFeeToman >
    baseFee,
  "Note 1 must increase Article 11 fee"
);


/*
 * ========================================
 * مسیر 3
 * تبصره 2
 * ماده 11 + 50 درصد
 * ========================================
 */

const software =
  calculateArticle45({

    discipline:
      "COMPUTER_INFORMATION_TECHNOLOGY",

    serviceType:
      "SOFTWARE_EXPERTISE",

    evaluationValueToman:
      evaluationValue
  });


const expected50 =
  Math.round(
    baseFee *
    0.50
  );


/*
 * ========================================
 * سقف عمومی ماده 11 بعد از ضریب تبصره‌ها
 * ========================================
 */

const veryLargeEvaluationValue =
  1_000_000_000_000_000;

for (const serviceType of [
  "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",
  "SOFTWARE_EXPERTISE"
] as const) {

  const cappedResult =
    calculateArticle45({
      discipline:
        serviceType === "SOFTWARE_EXPERTISE"
          ? "COMPUTER_INFORMATION_TECHNOLOGY"
          : "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
      serviceType,
      evaluationValueToman:
        veryLargeEvaluationValue
    });

  assertEqual(
    cappedResult.expertFeeToman,
    135_000_000,
    `${serviceType} must respect the Article 11 general maximum`
  );

  assert(
    cappedResult.cappedByArticle11Maximum,
    `${serviceType} must report Article 11 maximum application`
  );
}


assertEqual(
  software.article11FeeToman,
  baseFee,
  "Note 2 Article 11 base"
);


assertEqual(
  software.additionalPercent,
  50,
  "Note 2 additional percent"
);


assertEqual(
  software.additionalFeeToman,
  expected50,
  "Note 2 additional fee"
);


assertEqual(
  software.expertFeeToman,
  baseFee +
    expected50,
  "Note 2 must be Article 11 + 50%"
);


/*
 * ========================================
 * کنترل نسبت‌ها
 * ========================================
 */

assertEqual(
  machinery.expertFeeToman,
  Math.round(
    baseFee *
    1.40
  ),
  "Note 1 equivalent multiplier 1.40"
);


assertEqual(
  software.expertFeeToman,
  Math.round(
    baseFee *
    1.50
  ),
  "Note 2 equivalent multiplier 1.50"
);


/*
 * ========================================
 * رشته‌های دیگر - ارزیابی عادی
 * ========================================
 */

const oil =
  calculateArticle45({

    discipline:
      "OIL_INDUSTRIES",

    serviceType:
      "EVALUATION",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  oil.expertFeeToman,
  baseFee,
  "Oil industry evaluation"
);


const medical =
  calculateArticle45({

    discipline:
      "MEDICAL_ENGINEERING_EQUIPMENT",

    serviceType:
      "EVALUATION",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  medical.expertFeeToman,
  baseFee,
  "Medical equipment evaluation"
);


/*
 * ========================================
 * تبصره 1 در رشته صنعتی دیگر
 * ========================================
 *
 * Calculator رشته را به یک رشته خاص محدود
 * نمی‌کند، چون ماشین‌آلات صنعتی می‌تواند
 * موضوع کارشناسی چند رشته گروه 7 باشد.
 */

const oilMachinery =
  calculateArticle45({

    discipline:
      "OIL_INDUSTRIES",

    serviceType:
      "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",

    evaluationValueToman:
      evaluationValue
  });


assertEqual(
  oilMachinery.expertFeeToman,
  baseFee +
    expected40,
  "Note 1 usable for industrial machinery in another discipline"
);


/*
 * ========================================
 * محدودیت کارشناسی نرم‌افزار
 * ========================================
 */

mustThrow(
  () => {

    calculateArticle45({

      discipline:
        "OIL_INDUSTRIES",

      serviceType:
        "SOFTWARE_EXPERTISE",

      evaluationValueToman:
        evaluationValue
    });
  },

  "Software expertise must be limited to computer/IT discipline"
);


/*
 * ========================================
 * مأموریت
 * ========================================
 */

const missionRate =
  getMissionDailyRate(
    "IN_PROVINCE"
  );


const withMission =
  calculateArticle45({

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
  });


assertEqual(
  withMission.expertFeeToman,
  baseFee +
    expected40,
  "Mission must not alter Article 45 expert fee"
);


assertEqual(
  withMission.missionFeeToman,
  missionRate * 2,
  "Article 45 mission fee"
);


assertEqual(
  withMission.totalPayableToman,
  baseFee +
    expected40 +
    missionRate * 2,
  "Article 45 total payable"
);


/*
 * ========================================
 * بدون مأموریت
 * ========================================
 */

assertEqual(
  evaluation.missionFeeToman,
  0,
  "No mission fee by default"
);


assertEqual(
  evaluation.totalPayableToman,
  evaluation.expertFeeToman,
  "No mission total equals expert fee"
);


/*
 * ========================================
 * ورودی نامعتبر
 * ========================================
 */

mustThrow(
  () => {

    calculateArticle45({

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "EVALUATION",

      evaluationValueToman:
        0
    });
  },

  "Zero evaluation value must throw"
);


mustThrow(
  () => {

    calculateArticle45({

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "EVALUATION",

      evaluationValueToman:
        -1
    });
  },

  "Negative evaluation value must throw"
);


mustThrow(
  () => {

    calculateArticle45({

      discipline:
        "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",

      serviceType:
        "EVALUATION",

      evaluationValueToman:
        Number.NaN
    });
  },

  "NaN evaluation value must throw"
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
  "Industry Technology Calculator: ALL TESTS PASSED"
);

console.log(
  "Article 45 / Evaluation / +40% / +50% / Mission"
);

console.log(
  "========================================"
);
