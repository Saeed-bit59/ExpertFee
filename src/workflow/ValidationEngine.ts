import type {
  WorkflowAnswers
} from "./QuestionEngine";


export interface ValidationError {

  field: string;

  message: string;
}


export interface ValidationResult {

  valid: boolean;

  errors: ValidationError[];
}


/*
 * ========================================
 * Validation Engine
 * ========================================
 *
 * وظیفه:
 *
 * کنترل سازگاری پاسخ‌های Workflow
 *
 * این Engine هیچ محاسبه تعرفه‌ای
 * انجام نمی‌دهد.
 */


export function validateValuationWorkflow(
  answers: WorkflowAnswers
): ValidationResult {

  const errors: ValidationError[] = [];


  /*
   * ========================================
   * مبلغ ارزیابی
   * ========================================
   */

  const evaluationValue =
    answers.evaluationValue;


  if (
    evaluationValue !== undefined &&
    (
      typeof evaluationValue !== "number" ||
      !Number.isFinite(evaluationValue) ||
      evaluationValue <= 0
    )
  ) {

    errors.push({

      field:
        "evaluationValue",

      message:
        "مبلغ ارزیابی باید عددی بزرگ‌تر از صفر باشد."

    });
  }


  /*
   * ========================================
   * تعداد کارشناسان
   * ========================================
   */

  const expertCount =
    answers.expertCount;


  if (
    expertCount !== undefined &&
    (
      typeof expertCount !== "number" ||
      !Number.isInteger(expertCount) ||
      expertCount < 1
    )
  ) {

    errors.push({

      field:
        "expertCount",

      message:
        "تعداد کارشناسان باید عدد صحیح و حداقل یک نفر باشد."

    });
  }


  /*
   * ========================================
   * وضعیت هیأت
   * ========================================
   */

  const panelFieldMode =
    answers.panelFieldMode;


  /*
   * یک کارشناس نباید وضعیت هیأت داشته باشد.
   */

  if (
    expertCount === 1 &&
    panelFieldMode !== undefined &&
    panelFieldMode !==
      "SINGLE_EXPERT"
  ) {

    errors.push({

      field:
        "panelFieldMode",

      message:
        "برای کارشناسی یک‌نفره، وضعیت هیأت قابل انتخاب نیست."

    });
  }


  /*
   * بیش از یک کارشناس نباید
   * SINGLE_EXPERT باشد.
   */

  if (
    typeof expertCount === "number" &&
    expertCount > 1 &&
    panelFieldMode ===
      "SINGLE_EXPERT"
  ) {

    errors.push({

      field:
        "panelFieldMode",

      message:
        "برای بیش از یک کارشناس باید وضعیت رشته اعضای هیأت مشخص شود."

    });
  }


  /*
   * ========================================
   * نتیجه
   * ========================================
   */

  return {

    valid:
      errors.length === 0,

    errors
  };
}