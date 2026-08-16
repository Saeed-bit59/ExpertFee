import {
  getVisibleQuestions
} from "../src/workflow/QuestionEngine";


/*
 * ========================================
 * Test Helper
 * ========================================
 */

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
 * Helper
 * ========================================
 */

function hasQuestion(
  answers: Record<string, unknown>,
  questionId: string
): boolean {

  const questions =
    getVisibleQuestions(
      "VALUATION",
      answers
    );


  return questions.some(
    question =>
      question.id === questionId
  );
}


/*
 * ========================================
 * SCENARIO 1
 * ارزیابی عادی - یک کارشناس
 * ========================================
 */

assert(
  !hasQuestion(
    {
      subjectType:
        "STANDARD_VALUATION",

      expertCount:
        1
    },
    "contractScope"
  ),
  "SCENARIO 1 | Standard valuation -> contractScope hidden"
);


assert(
  !hasQuestion(
    {
      subjectType:
        "STANDARD_VALUATION",

      expertCount:
        1
    },
    "panelFieldMode"
  ),
  "SCENARIO 1 | One expert -> panelFieldMode hidden"
);


/*
 * ========================================
 * SCENARIO 2
 * خسارت
 * ========================================
 */

assert(
  !hasQuestion(
    {
      subjectType:
        "DAMAGE",

      expertCount:
        1
    },
    "contractScope"
  ),
  "SCENARIO 2 | Damage -> contractScope hidden"
);


/*
 * ========================================
 * SCENARIO 3
 * قرارداد
 * ========================================
 */

assert(
  hasQuestion(
    {
      subjectType:
        "CONTRACT",

      expertCount:
        1
    },
    "contractScope"
  ),
  "SCENARIO 3 | Contract -> contractScope visible"
);


/*
 * ========================================
 * SCENARIO 4
 * یک کارشناس
 * ========================================
 */

assert(
  !hasQuestion(
    {
      subjectType:
        "CONTRACT",

      expertCount:
        1
    },
    "panelFieldMode"
  ),
  "SCENARIO 4 | One expert -> panelFieldMode hidden"
);


/*
 * ========================================
 * SCENARIO 5
 * هیأت سه نفره
 * ========================================
 */

assert(
  hasQuestion(
    {
      subjectType:
        "STANDARD_VALUATION",

      expertCount:
        3
    },
    "panelFieldMode"
  ),
  "SCENARIO 5 | Three experts -> panelFieldMode visible"
);


/*
 * ========================================
 * SCENARIO 6
 * قرارداد + هیأت سه نفره
 * ========================================
 */

const combinedQuestions =
  getVisibleQuestions(
    "VALUATION",
    {
      subjectType:
        "CONTRACT",

      expertCount:
        3
    }
  );


assert(
  combinedQuestions.some(
    question =>
      question.id ===
      "contractScope"
  ),
  "SCENARIO 6 | Contract -> contractScope visible"
);


assert(
  combinedQuestions.some(
    question =>
      question.id ===
      "panelFieldMode"
  ),
  "SCENARIO 6 | Three experts -> panelFieldMode visible"
);


/*
 * ========================================
 * BASE QUESTIONS
 * ========================================
 *
 * سوالات اصلی باید مستقل از شرایط
 * همیشه در Workflow باقی بمانند.
 */

const baseQuestions =
  getVisibleQuestions(
    "VALUATION",
    {}
  );


assert(
  baseQuestions.some(
    question =>
      question.id ===
      "evaluationValue"
  ),
  "BASE | evaluationValue visible"
);


assert(
  baseQuestions.some(
    question =>
      question.id ===
      "subjectType"
  ),
  "BASE | subjectType visible"
);


assert(
  baseQuestions.some(
    question =>
      question.id ===
      "expertCount"
  ),
  "BASE | expertCount visible"
);


/*
 * ========================================
 * CONTRACT SAFETY
 * ========================================
 *
 * contractScope نباید بدون انتخاب
 * CONTRACT ظاهر شود.
 */

const nonContractSubjects = [

  "STANDARD_VALUATION",

  "DAMAGE",

  "SPECIAL_ITEMS",

  "INTANGIBLE_ASSETS"

];


for (
  const subjectType of
  nonContractSubjects
) {

  assert(
    !hasQuestion(
      {
        subjectType,
        expertCount:
          1
      },
      "contractScope"
    ),
    `CONTRACT SAFETY | ${subjectType} -> contractScope hidden`
  );
}


/*
 * ========================================
 * PANEL BOUNDARY
 * ========================================
 */

assert(
  !hasQuestion(
    {
      expertCount:
        0
    },
    "panelFieldMode"
  ),
  "PANEL | 0 experts -> hidden"
);


assert(
  !hasQuestion(
    {
      expertCount:
        1
    },
    "panelFieldMode"
  ),
  "PANEL | 1 expert -> hidden"
);


assert(
  hasQuestion(
    {
      expertCount:
        2
    },
    "panelFieldMode"
  ),
  "PANEL | 2 experts -> visible"
);


/*
 * ========================================
 * COMPLETED
 * ========================================
 */

console.log("");
console.log(
  "QUESTION ENGINE VISIBILITY BENCHMARK COMPLETED"
);