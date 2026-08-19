import {
  calculateArticle11Engine
} from "../src/engine/Article11Engine";


function formatToman(
  value: number
): string {

  return Math.round(value)
    .toLocaleString("en-US");
}


function printLine() {

  console.log(
    "------------------------------------------------------------"
  );
}


/*
 * ==========================================
 * مبالغ مرجع
 * ==========================================
 *
 * عمداً نقاط مختلف منحنی ماده 11
 * و نواحی نزدیک سقف انتخاب شده‌اند.
 */

const evaluationValues = [

  25_000_000,
  50_000_000,
  100_000_000,
  500_000_000,

  1_000_000_000,
  3_000_000_000,
  5_000_000_000,

  10_000_000_000,
  15_000_000_000,
  30_000_000_000,

  50_000_000_000,
  75_000_000_000,
  100_000_000_000,

  150_000_000_000,
  200_000_000_000,
  300_000_000_000,

  400_000_000_000,
  500_000_000_000,
  750_000_000_000,

  1_000_000_000_000

];


/*
 * ==========================================
 * TEST A
 * تک کارشناس
 * بدون ضریب افزایشی
 * ==========================================
 */

console.log("");
console.log(
  "ARTICLE 11 BENCHMARK"
);

console.log(
  "A - SINGLE EXPERT / STANDARD"
);

printLine();


for (
  const evaluationValueToman
  of evaluationValues
) {

  const result =
    calculateArticle11Engine({

      evaluationValueToman,

      expertCount: 1
    });


  console.log(
    [
      `Evaluation: ${formatToman(
        evaluationValueToman
      )}`,

      `Fee: ${formatToman(
        result.feePerExpertToman
      )}`,

      `Cap: ${
        result.capped
          ? "YES"
          : "NO"
      }`
    ].join(" | ")
  );
}


/*
 * ==========================================
 * TEST B
 * هیأت سه نفره هم‌رشته
 * ==========================================
 */

console.log("");
console.log(
  "B - 3 EXPERTS / SAME FIELD"
);

printLine();


for (
  const evaluationValueToman
  of evaluationValues
) {

  const result =
    calculateArticle11Engine({

      evaluationValueToman,

      expertCount: 3,

      panelFieldMode:
        "SAME_FIELD"
    });


  console.log(
    [
      `Evaluation: ${formatToman(
        evaluationValueToman
      )}`,

      `Per Expert: ${formatToman(
        result.feePerExpertToman
      )}`,

      `Panel Total: ${formatToman(
        result.totalFeeToman
      )}`,

      `30%: ${
        result
          .sameFieldThirtyPercentReductionApplied
          ? "YES"
          : "NO"
      }`,

      `Cap: ${
        result.capped
          ? "YES"
          : "NO"
      }`
    ].join(" | ")
  );
}


/*
 * ==========================================
 * TEST C
 * تک کارشناس
 * ضریب افزایشی 50 درصد
 * ==========================================
 */

console.log("");
console.log(
  "C - SINGLE EXPERT / +50%"
);

printLine();


for (
  const evaluationValueToman
  of evaluationValues
) {

  const result =
    calculateArticle11Engine({

      evaluationValueToman,

      expertCount: 1,

      increaseRuleCode:
        "NOTE4_INTANGIBLE_ASSETS"
    });


  console.log(
    [
      `Evaluation: ${formatToman(
        evaluationValueToman
      )}`,

      `Base: ${formatToman(
        result.feeBeforeAdjustmentToman
      )}`,

      `Final: ${formatToman(
        result.feePerExpertToman
      )}`,

      `Cap: ${
        result.capped
          ? "YES"
          : "NO"
      }`
    ].join(" | ")
  );
}


/*
 * ==========================================
 * TEST D
 *
 * هیأت سه نفره هم‌رشته
 * ضریب افزایشی 50 درصد
 *
 * Rule مورد انتظار:
 *
 * Base
 * ↓
 * +50%
 * ↓
 * -30%
 * ↓
 * CAP
 * ==========================================
 */

console.log("");
console.log(
  "D - 3 EXPERTS / SAME FIELD / +50%"
);

printLine();


for (
  const evaluationValueToman
  of evaluationValues
) {

  const result =
    calculateArticle11Engine({

      evaluationValueToman,

      expertCount: 3,

      panelFieldMode:
        "SAME_FIELD",

      increaseRuleCode:
        "NOTE4_INTANGIBLE_ASSETS"
    });


  console.log(
    [
      `Evaluation: ${formatToman(
        evaluationValueToman
      )}`,

      `Base: ${formatToman(
        result.feeBeforeAdjustmentToman
      )}`,

      `Final Per Expert: ${formatToman(
        result.feePerExpertToman
      )}`,

      `Panel Total: ${formatToman(
        result.totalFeeToman
      )}`,

      `Cap: ${
        result.capped
          ? "YES"
          : "NO"
      }`
    ].join(" | ")
  );
}


/*
 * ==========================================
 * TEST E
 * کنترل سخت سقف
 * ==========================================
 */

console.log("");
console.log(
  "E - HARD CAP CHECK"
);

printLine();


const capTestValues = [

  100_000_000_000,
  250_000_000_000,
  500_000_000_000,
  880_000_000_000,
  1_000_000_000_000,
  2_000_000_000_000,
  4_000_000_000_000

];


for (
  const evaluationValueToman
  of capTestValues
) {

  const result =
    calculateArticle11Engine({

      evaluationValueToman,

      expertCount: 3,

      panelFieldMode:
        "SAME_FIELD",

      increaseRuleCode:
        "NOTE4_INTANGIBLE_ASSETS"
    });


  if (
    result.feePerExpertToman >
    118_000_000
  ) {

    throw new Error(
      `CAP FAILED at evaluation ${evaluationValueToman}`
    );
  }


  console.log(
    `PASS CAP | ${formatToman(
      evaluationValueToman
    )} -> ${formatToman(
      result.feePerExpertToman
    )}`
  );
}


console.log("");
console.log(
  "ARTICLE 11 BENCHMARK COMPLETED"
);
