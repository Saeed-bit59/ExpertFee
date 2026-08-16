import {
  calculateArticle11Engine
} from "../src/engine/Article11Engine";


function assert(
  condition: boolean,
  name: string
) {

  if (!condition) {

    throw new Error(
      `FAILED: ${name}`
    );
  }

  console.log(
    `PASS: ${name}`
  );
}


function near(
  actual: number,
  expected: number,
  tolerance: number,
  name: string
) {

  assert(
    Math.abs(actual - expected) <=
      tolerance,

    name
  );
}


/*
 * TEST 1
 * مبلغ عادی
 */

const standard =
  calculateArticle11Engine({

    evaluationValueToman:
      100_000_000
  });


assert(
  standard.mode ===
    "STANDARD",

  "Standard mode selected"
);


/*
 * TEST 2
 * دقیقاً 5 همت
 *
 * هنوز مشمول مسیر ویژه
 * تبصره یک نیست.
 */

const exactlyFive =
  calculateArticle11Engine({

    evaluationValueToman:
      5_000_000_000_000
  });


assert(
  exactlyFive.mode ===
    "STANDARD",

  "Exactly 5 HEMMAT uses standard mode"
);


/*
 * TEST 3
 * یک تومان بالاتر از 5 همت
 */

const aboveFive =
  calculateArticle11Engine({

    evaluationValueToman:
      5_000_000_000_001
  });


assert(
  aboveFive.mode ===
    "NOTE_1",

  "Above 5 HEMMAT uses Note 1"
);


/*
 * TEST 4
 * نمونه مرجع Excel تبصره یک
 */

const excelReference =
  calculateArticle11Engine({

    evaluationValueToman:
      40_131_293_000_000
  });


near(
  excelReference.feePerExpertToman,
  470_453_358,
  2,

  "Engine matches Excel reference"
);


/*
 * TEST 5
 * افزایش 50 درصد تبصره یک
 */

const with50 =
  calculateArticle11Engine({

    evaluationValueToman:
      40_131_293_000_000,

    applyFiftyPercentIncrease:
      true
  });


near(
  with50.feeBeforeAdjustmentToman,
  470_453_358,
  2,

  "Fee before 50 percent"
);


near(
  with50.feeAfterAdjustmentToman,
  705_680_037,
  2,

  "Fee after 50 percent"
);


near(
  with50.feePerExpertToman,
  705_680_037,
  2,

  "Final fee after 50 percent"
);


/*
 * TEST 6
 * سقف 800 میلیون تومان
 * در تبصره یک
 */

const capped =
  calculateArticle11Engine({

    evaluationValueToman:
      100_000_000_000_000,

    applyFiftyPercentIncrease:
      true
  });


assert(
  capped.feePerExpertToman ===
    800_000_000,

  "Note 1 maximum fee enforced"
);


/*
 * TEST 7
 * هیأت سه نفره در تبصره یک
 *
 * کاهش 30 درصد اعمال نمی‌شود.
 */

const note1Panel =
  calculateArticle11Engine({

    evaluationValueToman:
      40_131_293_000_000,

    expertCount:
      3,

    panelFieldMode:
      "SAME_FIELD"
  });


near(
  note1Panel.feePerExpertToman,
  470_453_358,
  2,

  "Full fee per Note 1 panel expert"
);


near(
  note1Panel.totalFeeToman,
  1_411_360_074,
  6,

  "Note 1 panel total calculated"
);


assert(
  note1Panel
    .sameFieldThirtyPercentReductionApplied ===
    false,

  "No 30 percent reduction in Note 1"
);


/*
 * TEST 8
 * هشدار تبصره یک
 */

assert(
  note1Panel.warning !==
    null,

  "Note 1 warning returned"
);


/*
 * TEST 9
 * عنوان محاسبه تبصره یک
 */

assert(
  note1Panel
    .calculationLabel
    .includes("تبصره"),

  "Note 1 calculation label"
);


/*
 * TEST 10
 * هیأت سه نفره هم‌رشته
 * در مسیر عادی ماده 11
 *
 * مبلغ پایین‌تر از سقف
 */

const standardSameField =
  calculateArticle11Engine({

    evaluationValueToman:
      100_000_000_000,

    expertCount:
      3,

    panelFieldMode:
      "SAME_FIELD"
  });


assert(
  standardSameField.mode ===
    "STANDARD",

  "Standard same-field panel selected"
);


assert(
  standardSameField
    .sameFieldThirtyPercentReductionApplied ===
    true,

  "Standard same-field panel applies 30 percent reduction"
);


/*
 * TEST 11
 * تست بسیار مهم ترتیب سقف
 *
 * مبلغ خام فرضی توسط Engine
 * ابتدا باید مشمول کسر 30 درصد شود
 * و سپس سقف کنترل گردد.
 *
 * تست مرجع واقعی در TEST 12
 * انجام می‌شود.
 */

assert(
  standardSameField
    .feeAfterAdjustmentToman <=
    standardSameField
      .feeBeforeAdjustmentToman,

  "Panel adjustment occurs after base calculation"
);


/*
 * TEST 12
 * تست مرجع تبصره 6
 *
 * مبلغ ارزیابی:
 * 880 میلیارد تومان
 *
 * هیأت:
 * 3 نفر هم‌رشته
 *
 * دستمزد نهایی هر نفر:
 * 118 میلیون تومان
 *
 * جمع هیأت:
 * 354 میلیون تومان
 */

const panel880B =
  calculateArticle11Engine({

    evaluationValueToman:
      880_000_000_000,

    expertCount:
      3,

    panelFieldMode:
      "SAME_FIELD"
  });


assert(
  panel880B.mode ===
    "STANDARD",

  "880B uses standard Article 11 mode"
);


assert(
  panel880B
    .sameFieldThirtyPercentReductionApplied ===
    true,

  "880B same-field panel applies 30 percent reduction"
);


near(
  panel880B
    .feeBeforeAdjustmentToman,

  171_787_500,

  1,

  "880B raw fee before Note 6"
);


near(
  panel880B
    .feeAfterAdjustmentToman,

  120_251_250,

  1,

  "880B fee after 30 percent reduction"
);


assert(
  panel880B
    .feePerExpertToman ===
    118_000_000,

  "880B final fee per expert equals 118 million"
);


assert(
  panel880B
    .totalFeeToman ===
    354_000_000,

  "880B total panel fee equals 354 million"
);


assert(
  panel880B.capped ===
    true,

  "880B cap applies after 30 percent reduction"
);


/*
 * TEST 13
 * اطمینان از ترتیب صحیح:
 *
 * اگر مبلغ خام 150 میلیون باشد،
 * بعد از کسر 30 درصد به 105 میلیون
 * می‌رسد و نباید سقف 118 میلیون
 * اعمال شود.
 *
 * این منطق در PanelRules
 * به طور مستقل تست شده است.
 */


/*
 * TEST 14
 * هیأت رشته‌های مختلف
 *
 * کسر 30 درصد نباید اعمال شود.
 */

const differentFields =
  calculateArticle11Engine({

    evaluationValueToman:
      100_000_000_000,

    expertCount:
      3,

    panelFieldMode:
      "DIFFERENT_FIELDS"
  });


assert(
  differentFields
    .sameFieldThirtyPercentReductionApplied ===
    false,

  "Different-field panel has no 30 percent reduction"
);


assert(
  differentFields
    .panelFieldMode ===
    "DIFFERENT_FIELDS",

  "Different-field panel mode preserved"
);


console.log(
  "Article 11 Engine tests completed."
);