import {
  applyArticle11PanelRules
} from "../src/engine/Article11PanelRules";


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
 * سقف عمومی ماده 11
 * 118 میلیون تومان
 */
const MAXIMUM_FEE =
  118_000_000;


/*
 * TEST 1
 * یک کارشناس
 */

const single =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      100_000_000,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      1,

    fieldMode:
      "SINGLE_EXPERT",

    isNote1:
      false
  });


assert(
  single
    .thirtyPercentReductionApplied ===
    false,

  "Single expert has no 30 percent reduction"
);


assert(
  single.feePerExpertToman ===
    100_000_000,

  "Single expert receives full fee"
);


/*
 * TEST 2
 * یک کارشناس بالاتر از سقف
 */

const singleAboveCap =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      150_000_000,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      1,

    fieldMode:
      "SINGLE_EXPERT",

    isNote1:
      false
  });


assert(
  singleAboveCap.feePerExpertToman ===
    118_000_000,

  "Single expert maximum fee enforced"
);


assert(
  singleAboveCap.cappedAfterReduction ===
    true,

  "Single expert cap detected"
);


/*
 * TEST 3
 * هیأت سه نفره هم‌رشته
 *
 * دستمزد خام = 100 میلیون
 * کسر 30 درصد = 30 میلیون
 * دستمزد نهایی = 70 میلیون
 */

const sameField3 =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      100_000_000,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      3,

    fieldMode:
      "SAME_FIELD",

    isNote1:
      false
  });


assert(
  sameField3
    .thirtyPercentReductionApplied ===
    true,

  "Same-field panel activates 30 percent reduction"
);


assert(
  sameField3.reductionRate ===
    0.30,

  "Reduction rate is 30 percent"
);


assert(
  sameField3
    .reductionPerExpertToman ===
    30_000_000,

  "30 million deducted from each expert"
);


assert(
  sameField3
    .feeAfterReductionBeforeCapToman ===
    70_000_000,

  "Fee after reduction equals 70 million"
);


assert(
  sameField3.feePerExpertToman ===
    70_000_000,

  "Each expert receives 70 million"
);


assert(
  sameField3.totalPanelFeeToman ===
    210_000_000,

  "Three-expert panel total is 210 million"
);


/*
 * TEST 4
 * کنترل ترتیب تبصره 6
 *
 * دستمزد خام = 150 میلیون
 * پس از کسر 30 درصد = 105 میلیون
 *
 * چون 105 میلیون کمتر از سقف است،
 * سقف نباید اعمال شود.
 *
 * این تست ثابت می‌کند سقف
 * قبل از کسر 30 درصد اعمال نشده است.
 */

const reductionBeforeCap =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      150_000_000,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      3,

    fieldMode:
      "SAME_FIELD",

    isNote1:
      false
  });


assert(
  reductionBeforeCap
    .feeAfterReductionBeforeCapToman ===
    105_000_000,

  "30 percent reduction occurs before cap"
);


assert(
  reductionBeforeCap
    .feePerExpertToman ===
    105_000_000,

  "105 million remains below cap"
);


assert(
  reductionBeforeCap
    .cappedAfterReduction ===
    false,

  "Cap not applied when reduced fee is below maximum"
);


/*
 * TEST 5
 * تست مرجع 880 میلیارد تومان
 *
 * دستمزد خام هر نفر:
 * 171,787,500 تومان
 *
 * پس از کسر 30 درصد:
 * 120,251,250 تومان
 *
 * چون از سقف 118 میلیون بیشتر است:
 * دستمزد نهایی هر نفر = 118 میلیون
 */

const reference880B =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      171_787_500,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      3,

    fieldMode:
      "SAME_FIELD",

    isNote1:
      false
  });


assert(
  reference880B
    .thirtyPercentReductionApplied ===
    true,

  "880B same-field panel activates Note 6"
);


assert(
  reference880B
    .reductionPerExpertToman ===
    51_536_250,

  "880B reduction amount is correct"
);


assert(
  reference880B
    .feeAfterReductionBeforeCapToman ===
    120_251_250,

  "880B fee after 30 percent reduction is correct"
);


assert(
  reference880B
    .cappedAfterReduction ===
    true,

  "880B cap applies after reduction"
);


assert(
  reference880B
    .feePerExpertToman ===
    118_000_000,

  "880B final fee per expert is 118 million"
);


assert(
  reference880B
    .totalPanelFeeToman ===
    354_000_000,

  "880B panel total is 354 million"
);


/*
 * TEST 6
 * هیأت پنج نفره هم‌رشته
 */

const sameField5 =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      100_000_000,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      5,

    fieldMode:
      "SAME_FIELD",

    isNote1:
      false
  });


assert(
  sameField5.feePerExpertToman ===
    70_000_000,

  "Five-expert same-field fee per expert"
);


assert(
  sameField5.totalPanelFeeToman ===
    350_000_000,

  "Five-expert panel total"
);


/*
 * TEST 7
 * هیأت رشته‌های مختلف
 *
 * در این مرحله فقط بررسی می‌کنیم
 * که کسر 30 درصد اعمال نشود.
 *
 * محاسبه سهم هر رشته در مرحله
 * مستقل انجام خواهد شد.
 */

const differentFields =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      100_000_000,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      3,

    fieldMode:
      "DIFFERENT_FIELDS",

    isNote1:
      false
  });


assert(
  differentFields
    .thirtyPercentReductionApplied ===
    false,

  "Different-field panel has no 30 percent reduction"
);


assert(
  differentFields.note.includes(
    "سهم"
  ),

  "Different-field panel requires separate valuation shares"
);


/*
 * TEST 8
 * استثنای تبصره یک
 *
 * در تبصره یک، کاهش 30 درصد
 * اعمال نمی‌شود.
 */

const note1SameField =
  applyArticle11PanelRules({

    baseFeePerExpertToman:
      470_453_358,

    maximumFeeToman:
      800_000_000,

    expertCount:
      3,

    fieldMode:
      "SAME_FIELD",

    isNote1:
      true
  });


assert(
  note1SameField
    .thirtyPercentReductionApplied ===
    false,

  "Note 1 disables same-field 30 percent reduction"
);


near(
  note1SameField.feePerExpertToman,
  470_453_358,
  1,

  "Note 1 keeps full fee per expert"
);


near(
  note1SameField.totalPanelFeeToman,
  1_411_360_074,
  3,

  "Note 1 panel total remains full"
);


/*
 * TEST 9
 * اعتبارسنجی تعداد کارشناسان
 */

let invalidCountDetected =
  false;


try {

  applyArticle11PanelRules({

    baseFeePerExpertToman:
      100_000_000,

    maximumFeeToman:
      MAXIMUM_FEE,

    expertCount:
      0,

    fieldMode:
      "SAME_FIELD",

    isNote1:
      false
  });

} catch {

  invalidCountDetected =
    true;
}


assert(
  invalidCountDetected,

  "Invalid expert count rejected"
);


console.log(
  "Article 11 Panel Rules tests completed."
);