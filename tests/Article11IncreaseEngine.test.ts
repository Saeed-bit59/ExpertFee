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
    Math.abs(actual - expected) <= tolerance,
    name
  );
}


/*
 * ==========================================
 * TEST 1
 * مسیر عادی بدون ضریب افزایشی
 * ==========================================
 */

const standard =
  calculateArticle11Engine({

    evaluationValueToman:
      100_000_000
  });


assert(
  standard.mode === "STANDARD",
  "Standard mode selected"
);


assert(
  standard.increaseRuleApplied === false,
  "No increase rule applied"
);


assert(
  standard.increaseRuleCode === null,
  "Increase rule code is null"
);


assert(
  standard.increaseRate === 0,
  "Increase rate is zero"
);


/*
 * ==========================================
 * TEST 2
 * تبصره 4
 * افزایش 50 درصد
 * ==========================================
 */

const note4 =
  calculateArticle11Engine({

    evaluationValueToman:
      10_000_000_000,

    increaseRuleCode:
      "NOTE4_DAMAGE"
  });


assert(
  note4.mode === "STANDARD",
  "Note 4 uses standard Article 11 path"
);


assert(
  note4.increaseRuleApplied === true,
  "Note 4 increase rule applied"
);


assert(
  note4.increaseRuleCode ===
    "NOTE4_DAMAGE",
  "Note 4 rule code returned"
);


assert(
  note4.increaseRuleNoteNumber === 4,
  "Note 4 number returned"
);


assert(
  note4.increaseRate === 0.50,
  "Note 4 increase rate is 50 percent"
);


near(
  note4.feePerExpertToman,
  note4.feeAfterAdjustmentToman * 1.5,
  1,
  "Note 4 final fee increased by 50 percent"
);


/*
 * ==========================================
 * TEST 3
 * تبصره 3
 * افزایش 100 درصد
 * ==========================================
 */

const note3Full =
  calculateArticle11Engine({

    evaluationValueToman:
      10_000_000_000,

    increaseRuleCode:
      "NOTE3_CONTRACT_FULL"
  });


assert(
  note3Full.increaseRuleApplied === true,
  "Note 3 full increase applied"
);


assert(
  note3Full.increaseRate === 1,
  "Note 3 full increase rate is 100 percent"
);


near(
  note3Full.feePerExpertToman,
  note3Full.feeAfterAdjustmentToman * 2,
  1,
  "Note 3 full doubles fee below cap"
);


/*
 * ==========================================
 * TEST 4
 * کنترل سقف 118 میلیون تومان
 * ==========================================
 */

const capped =
  calculateArticle11Engine({

    evaluationValueToman:
      880_000_000_000,

    increaseRuleCode:
      "NOTE4_DAMAGE"
  });


assert(
  capped.capped === true,
  "Maximum fee activated"
);


assert(
  capped.feePerExpertToman ===
    118_000_000,
  "Final fee capped at 118 million"
);


/*
 * ==========================================
 * TEST 5
 * افزایش 100 درصد نیز
 * نباید از سقف عبور کند
 * ==========================================
 */

const capped100 =
  calculateArticle11Engine({

    evaluationValueToman:
      880_000_000_000,

    increaseRuleCode:
      "NOTE3_CONTRACT_FULL"
  });


assert(
  capped100.feePerExpertToman ===
    118_000_000,
  "100 percent increase cannot exceed maximum"
);


/*
 * ==========================================
 * TEST 6
 * مجموع دستمزد هیأت
 *
 * اینجا فقط کنترل می‌کنیم:
 * total = feePerExpert × expertCount
 *
 * درباره ترتیب تبصره 6 و ضریب افزایشی
 * در این تست تصمیم حقوقی نمی‌گیریم.
 * ==========================================
 */

const panel =
  calculateArticle11Engine({

    evaluationValueToman:
      10_000_000_000,

    expertCount:
      3,

    panelFieldMode:
      "SAME_FIELD",

    increaseRuleCode:
      "NOTE4_DAMAGE"
  });


assert(
  panel.expertCount === 3,
  "Three expert panel preserved"
);


near(
  panel.totalFeeToman,
  panel.feePerExpertToman * 3,
  1,
  "Panel total equals fee per expert times expert count"
);


assert(
  panel.sameFieldThirtyPercentReductionApplied ===
    true,
  "Same-field panel rule remains active"
);


/*
 * ==========================================
 * TEST 7
 * رشته‌های مختلف
 * ==========================================
 */

const differentFields =
  calculateArticle11Engine({

    evaluationValueToman:
      10_000_000_000,

    expertCount:
      3,

    panelFieldMode:
      "DIFFERENT_FIELDS",

    increaseRuleCode:
      "NOTE5_SPECIAL_ITEMS"
  });


assert(
  differentFields
    .sameFieldThirtyPercentReductionApplied ===
    false,
  "Different-field panel has no 30 percent reduction"
);


assert(
  differentFields.increaseRuleApplied === true,
  "Increase rule works with different-field mode"
);


/*
 * ==========================================
 * TEST 8
 * تبصره 1 باید مستقل باقی بماند
 * ==========================================
 */

const note1 =
  calculateArticle11Engine({

    evaluationValueToman:
      5_000_000_000_001,

    increaseRuleCode:
      "NOTE4_DAMAGE"
  });


assert(
  note1.mode === "NOTE_1",
  "Above 5 HEMMAT enters Note 1"
);


assert(
  note1.increaseRuleApplied === false,
  "General increase rule not applied inside Note 1"
);


assert(
  note1.increaseRuleCode === null,
  "Note 1 ignores general increase rule"
);


/*
 * ==========================================
 * TEST 9
 * دقیقاً 5 همت
 * همچنان STANDARD
 * ==========================================
 */

const exactlyFive =
  calculateArticle11Engine({

    evaluationValueToman:
      5_000_000_000_000
  });


assert(
  exactlyFive.mode === "STANDARD",
  "Exactly 5 HEMMAT remains standard"
);


/*
 * ==========================================
 * TEST 10
 * هیچ خروجی STANDARD با ضریب افزایشی
 * نباید از سقف عبور کند
 * ==========================================
 */

const ruleCodes = [

  "NOTE3_CONTRACT_FULL",

  "NOTE3_CONTRACT_PARTIAL",

  "NOTE4_DAMAGE",

  "NOTE5_SPECIAL_ITEMS",

  "NOTE7_INTANGIBLE_ASSETS"

] as const;


for (
  const ruleCode of ruleCodes
) {

  const result =
    calculateArticle11Engine({

      evaluationValueToman:
        4_000_000_000_000,

      increaseRuleCode:
        ruleCode
    });


  assert(
    result.feePerExpertToman <=
      118_000_000,

    `${ruleCode} never exceeds 118 million`
  );
}


/*
 * ==========================================
 * پایان
 * ==========================================
 */

console.log(
  "Article 11 Increase Engine tests completed."
);