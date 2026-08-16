import {
  validateValuationWorkflow
} from "../src/workflow/ValidationEngine";


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


/*
 * ========================================
 * TEST 1
 * یک کارشناس
 * ========================================
 */

const singleExpert =
  validateValuationWorkflow({

    evaluationValue:
      100_000_000,

    expertCount:
      1,

    panelFieldMode:
      "SINGLE_EXPERT"

  });


assert(
  singleExpert.valid === true,
  "Single expert is valid"
);


/*
 * ========================================
 * TEST 2
 * هیأت هم‌رشته
 * ========================================
 */

const sameFieldPanel =
  validateValuationWorkflow({

    evaluationValue:
      100_000_000,

    expertCount:
      3,

    panelFieldMode:
      "SAME_FIELD"

  });


assert(
  sameFieldPanel.valid === true,
  "Same-field panel is valid"
);


/*
 * ========================================
 * TEST 3
 * هیأت با رشته‌های مختلف
 * ========================================
 */

const differentFieldPanel =
  validateValuationWorkflow({

    evaluationValue:
      100_000_000,

    expertCount:
      3,

    panelFieldMode:
      "DIFFERENT_FIELDS"

  });


assert(
  differentFieldPanel.valid === true,
  "Different-field panel is valid"
);


/*
 * ========================================
 * TEST 4
 * یک کارشناس با وضعیت هیأت
 * ========================================
 */

const invalidSingleExpert =
  validateValuationWorkflow({

    evaluationValue:
      100_000_000,

    expertCount:
      1,

    panelFieldMode:
      "SAME_FIELD"

  });


assert(
  invalidSingleExpert.valid === false,
  "Single expert cannot use panel mode"
);


assert(
  invalidSingleExpert.errors.some(
    error =>
      error.field ===
      "panelFieldMode"
  ),
  "Single expert panel error detected"
);


/*
 * ========================================
 * TEST 5
 * هیأت با SINGLE_EXPERT
 * ========================================
 */

const invalidPanel =
  validateValuationWorkflow({

    evaluationValue:
      100_000_000,

    expertCount:
      3,

    panelFieldMode:
      "SINGLE_EXPERT"

  });


assert(
  invalidPanel.valid === false,
  "Panel cannot use SINGLE_EXPERT mode"
);


/*
 * ========================================
 * TEST 6
 * تعداد کارشناس نامعتبر
 * ========================================
 */

const invalidExpertCount =
  validateValuationWorkflow({

    evaluationValue:
      100_000_000,

    expertCount:
      0

  });


assert(
  invalidExpertCount.valid === false,
  "Zero expert count rejected"
);


assert(
  invalidExpertCount.errors.some(
    error =>
      error.field ===
      "expertCount"
  ),
  "Expert count error detected"
);


/*
 * ========================================
 * TEST 7
 * مبلغ ارزیابی نامعتبر
 * ========================================
 */

const invalidEvaluationValue =
  validateValuationWorkflow({

    evaluationValue:
      -100,

    expertCount:
      1,

    panelFieldMode:
      "SINGLE_EXPERT"

  });


assert(
  invalidEvaluationValue.valid === false,
  "Negative evaluation value rejected"
);


assert(
  invalidEvaluationValue.errors.some(
    error =>
      error.field ===
      "evaluationValue"
  ),
  "Evaluation value error detected"
);


console.log(
  "Validation Engine tests completed."
);